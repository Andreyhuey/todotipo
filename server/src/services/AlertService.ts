import { In, IsNull, MoreThan } from 'typeorm';
import { AppDataSource } from '../config/database';
import { ActivityLog } from '../entity/ActivityLog';
import { MailerService } from './MailService';
import { site } from '../config/site';
import type { LogEntry } from './LogService';

/**
 * Emails warning/error activity-log entries to ALERT_EMAIL as batched digests,
 * so a burst (e.g. 30 failed sign-ins) arrives as one email, not thirty.
 *
 * Durable: pending alerts are the log rows with `alertedAt` still empty, so
 * nothing is lost when the host stops the idle app — they go out after the
 * next start. Rows are claimed before sending so parallel processes don't
 * send duplicates.
 *
 *   ALERT_EMAIL=logs@example.com        comma-separated recipients; unset = off
 *   ALERT_MIN_LEVEL=warning             or "error" for errors only
 */
type Level = 'warning' | 'error';

const ERROR_DELAY_MS = Number(process.env.ALERT_ERROR_DELAY_SECONDS || 60) * 1000;
const WARNING_DELAY_MS = Number(process.env.ALERT_WARNING_DELAY_MINUTES || 5) * 60_000;
const MIN_GAP_MS = 2 * 60_000; // at most one email per 2 minutes
const MAX_PER_EMAIL = 100;
const MAX_AGE_MS = 24 * 3600e3; // don't email about things older than a day

const mailer = new MailerService();
/** Entries that couldn't be stored (e.g. DB down at start-up) are kept here. */
const memoryQueue: (LogEntry & { level: Level; at: Date })[] = [];
let timer: NodeJS.Timeout | null = null;
let timerDue = 0;
let lastSent = 0;
let failures = 0;
let sending: Promise<void> | null = null;

const recipients = () =>
  (process.env.ALERT_EMAIL ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const levels = (): Level[] => (process.env.ALERT_MIN_LEVEL === 'error' ? ['error'] : ['warning', 'error']);
const isPostgres = () => AppDataSource.options.type === 'postgres';

const schedule = (delay: number) => {
  const due = Math.max(Date.now() + delay, lastSent + MIN_GAP_MS);
  if (timer && timerDue <= due) return; // an earlier flush is already planned
  if (timer) clearTimeout(timer);
  timerDue = due;
  timer = setTimeout(() => {
    timer = null;
    AlertService.flush().catch(() => {});
  }, due - Date.now());
  timer.unref?.(); // don't keep the process alive just for alerts
};

const fmtTime = (d: Date) =>
  new Date(d).toLocaleString('en-GB', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }) + ' UTC';

const detail = (meta: Record<string, unknown> = {}) =>
  ['error', 'reason', 'response', 'path', 'status', 'file']
    .filter((k) => meta[k] !== undefined && meta[k] !== '' && meta[k] !== null)
    .map((k) => `${k}: ${String(meta[k]).slice(0, 300)}`)
    .join(' · ');

interface DigestEntry {
  at: Date;
  level: Level;
  category: string;
  message: string;
  actorType?: string;
  actorEmail?: string;
  ip?: string;
  meta?: Record<string, unknown>;
}

/** Atomically marks pending rows as alerted and returns the ones this process claimed. */
async function claimPending(): Promise<ActivityLog[]> {
  if (!AppDataSource.isInitialized) return [];
  const repo = AppDataSource.getRepository(ActivityLog);
  const candidates = await repo.find({
    select: ['id'],
    where: { level: In(levels()), alertedAt: IsNull(), createdAt: MoreThan(new Date(Date.now() - MAX_AGE_MS)) },
    order: { id: 'ASC' },
    take: MAX_PER_EMAIL,
  });
  if (!candidates.length) return [];

  const ids = candidates.map((c) => c.id);
  const now = new Date();
  const qb = repo
    .createQueryBuilder()
    .update(ActivityLog)
    .set({ alertedAt: now })
    .where('id IN (:...ids)', { ids })
    .andWhere('alertedAt IS NULL');

  let claimed = ids;
  if (isPostgres()) {
    const res = await qb.returning(['id']).execute();
    claimed = (res.raw as { id: number }[]).map((r) => r.id);
  } else {
    await qb.execute(); // MySQL has no RETURNING; a rare duplicate is acceptable
  }
  return claimed.length ? repo.find({ where: { id: In(claimed) }, order: { id: 'ASC' } }) : [];
}

export const AlertService = {
  enabled: () => recipients().length > 0,

  /** Called after a warning/error is logged; schedules a digest. */
  notify(entry: LogEntry, stored: boolean) {
    const level = entry.level ?? 'info';
    if (!this.enabled() || !levels().includes(level as Level)) return;
    if (!stored) memoryQueue.push({ ...entry, level: level as Level, at: new Date() });
    schedule(level === 'error' ? ERROR_DELAY_MS : WARNING_DELAY_MS);
  },

  /** Sends anything left pending by a previous (stopped) process. */
  start() {
    if (!this.enabled()) return;
    schedule(30_000);
    // While the app is up, sweep periodically in case a timer was missed.
    setInterval(() => this.flush().catch(() => {}), 10 * 60_000).unref();
  },

  /** Sends everything pending as one digest email. */
  async flush(): Promise<void> {
    if (sending) return sending;
    if (!this.enabled()) return;

    sending = (async () => {
      const rows = await claimPending().catch(() => [] as ActivityLog[]);
      const fromMemory = memoryQueue.splice(0, MAX_PER_EMAIL);
      const batch: DigestEntry[] = [
        ...fromMemory.map((e) => ({
          at: e.at,
          level: e.level,
          category: e.category,
          message: e.message,
          actorType: e.actor?.type,
          actorEmail: e.actor?.email,
          ip: e.ip,
          meta: e.meta,
        })),
        ...rows.map((r) => ({
          at: r.createdAt,
          level: r.level as Level,
          category: r.category,
          message: r.message,
          actorType: r.actorType,
          actorEmail: r.actorEmail,
          ip: r.ip,
          meta: r.meta,
        })),
      ];
      if (!batch.length) return;

      const errors = batch.filter((e) => e.level === 'error').length;
      const warnings = batch.length - errors;
      const counts = [errors && `${errors} error${errors > 1 ? 's' : ''}`, warnings && `${warnings} warning${warnings > 1 ? 's' : ''}`]
        .filter(Boolean)
        .join(', ');

      try {
        await mailer.send({
          to: recipients(),
          subject: `[${site.SITE_NAME.replace(/\.$/, '')}] ${counts} on the platform`,
          templateName: 'alert-digest',
          internal: true,
          templateData: {
            siteName: site.SITE_NAME.replace(/\.$/, ''),
            counts,
            hasErrors: errors > 0,
            logsLink: `${site.SITE_LINK.replace(/\/$/, '')}/admin/logs`,
            entries: batch.map((e) => ({
              time: fmtTime(e.at),
              level: e.level === 'error' ? 'Error' : 'Warning',
              isError: e.level === 'error',
              category: e.category,
              message: e.message,
              who:
                e.actorType === 'admin' || e.actorType === 'visitor'
                  ? `${e.actorEmail || e.actorType}${e.ip ? ` (${e.ip})` : ''}`
                  : e.ip || 'System',
              detail: detail(e.meta),
            })),
          },
        });
        lastSent = Date.now();
        failures = 0;
        if (rows.length === MAX_PER_EMAIL || memoryQueue.length) schedule(MIN_GAP_MS); // more waiting
      } catch (err) {
        // Release the claim so the rows are retried; keep in-memory ones too.
        failures++;
        console.error(`❌ Alert email failed (attempt ${failures}):`, (err as Error).message);
        if (rows.length) {
          await AppDataSource.getRepository(ActivityLog)
            .update({ id: In(rows.map((r) => r.id)) }, { alertedAt: null })
            .catch(() => {});
        }
        if (failures <= 5) memoryQueue.unshift(...fromMemory);
        schedule(Math.min(failures, 5) * 5 * 60_000);
      }
    })().finally(() => {
      sending = null;
    });
    return sending;
  },
};
