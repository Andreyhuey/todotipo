import { MoreThanOrEqual } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Visit } from '../entity/Visit';
import { MailerService } from './MailService';
import { site } from '../config/site';

/**
 * Emails one summary per visitor (bots and /admin are filtered out upstream),
 * listing every page they viewed. Page views are batched per visitor id — not
 * per session, which is per tab — and the email goes out once the visitor has
 * been idle for VISIT_EMAIL_IDLE_MINUTES (capped at VISIT_EMAIL_MAX_MINUTES
 * after their first page), so geolocation has long finished by then.
 *
 *   VISIT_EMAIL=analytics@example.com   comma-separated; falls back to ANALYTICS_EMAIL
 *   VISIT_EMAIL=off                     disables visitor emails
 *   VISIT_EMAIL_IDLE_MINUTES=15         quiet time before a visitor's email is sent
 *   VISIT_EMAIL_MAX_MINUTES=20         longest a visitor's email is held back
 *
 * Pending batches live in memory, so a restart drops visitors still browsing.
 */
const mailer = new MailerService();

const recipients = () => {
  const raw = (process.env.VISIT_EMAIL ?? process.env.ANALYTICS_EMAIL ?? '').trim();
  if (raw.toLowerCase() === 'off') return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

const minutes = (name: string, fallback: number) => {
  const n = Number(process.env[name]);
  return (Number.isFinite(n) && n > 0 ? n : fallback) * 60_000;
};

const siteName = () => site.SITE_NAME.replace(/\.$/, '');

const MAX_PAGES = 100;

const formatDuration = (s: number | null) => {
  if (!s) return '';
  const m = Math.floor(s / 60);
  return m ? `${m}m ${s % 60}s` : `${s}s`;
};

const formatTime = (d: Date) => new Date(d).toUTCString().replace(/^\w+, /, '').replace(/ GMT$/, ' UTC');

/** visitorId → first page view in the batch, when it started, and the pending timer. */
const pending = new Map<string, { since: Date; startedAt: number; timer: NodeJS.Timeout }>();

async function flush(visitorId: string, since: Date) {
  pending.delete(visitorId);
  const to = recipients();
  if (!to.length) return;

  const views = await AppDataSource.getRepository(Visit).find({
    where: { visitorId, createdAt: MoreThanOrEqual(since) },
    order: { createdAt: 'ASC' },
    take: MAX_PAGES,
  });
  if (!views.length) return;

  // Visitor details come from the latest geolocated view.
  const v = [...views].reverse().find((x) => x.country) ?? views[0];
  const first = views[0];
  const location = [v.city, v.region, v.country].filter(Boolean).join(', ') || 'Unknown location';
  const uniquePages = new Set(views.map((x) => x.path)).size;
  const pageWord = (n: number) => `${n} page${n === 1 ? '' : 's'}`;
  const row = (label: string, value: string) => (value ? [{ label, value }] : []);

  try {
    // internal: a failure must not be logged as an error (that would trigger
    // an alert email per failed visit email).
    await mailer.send({
      to,
      subject: `Visitor:${pageWord(uniquePages)} — ${location}`,
      templateName: 'report',
      internal: true,
      templateData: {
        siteName: siteName(),
        kicker: 'New visitor',
        heading: `${pageWord(views.length)} viewed from ${location}`,
        intro: `Someone from ${location} landed on ${first.path} and viewed ${pageWord(uniquePages)}${
          views.length > uniquePages ? ` (${views.length} views)` : ''
        }.`,
        sections: [
          {
            title: 'Pages visited',
            rows: views.map((x) => ({
              label: x.path,
              sub: [x.title, formatDuration(x.duration)].filter(Boolean).join(' · '),
              value: formatTime(x.createdAt),
            })),
          },
          {
            title: 'Visit',
            rows: [
              ...row('Landing page', first.path),
              ...row('First seen', formatTime(first.createdAt)),
              ...row('Last seen', formatTime(views[views.length - 1].createdAt)),
              ...row('Referrer', first.referrer || 'Direct'),
            ],
          },
          {
            title: 'Visitor',
            rows: [
              ...row('Location', location),
              ...row('IP', v.ip),
              ...row('ISP', v.isp),
              ...row('Device', [v.device, v.os, v.browser].filter(Boolean).join(' · ')),
              ...row('Screen', v.screen),
              ...row('Language', v.language),
              ...row('Visitor id', v.visitorId),
            ],
          },
        ],
        cta: { label: 'Open analytics', href: `${site.SITE_LINK.replace(/\/$/, '')}/admin/analytics` },
        footnote: 'Locations are estimated from IP addresses and are usually accurate to the city.',
      },
    });
  } catch (err) {
    console.warn('⚠️  Visit email failed:', (err as Error).message);
  }
}

export const VisitNotifier = {
  enabled: () => recipients().length > 0,

  /** Adds a page view to the visitor's batch and (re)starts its idle timer. */
  queue(visit: Pick<Visit, 'visitorId' | 'createdAt'>) {
    if (!recipients().length) return;
    const idle = minutes('VISIT_EMAIL_IDLE_MINUTES', 15);
    const max = minutes('VISIT_EMAIL_MAX_MINUTES', 20);
    const now = Date.now();

    const existing = pending.get(visit.visitorId);
    if (existing) clearTimeout(existing.timer);
    const since = existing?.since ?? new Date(visit.createdAt);
    const startedAt = existing?.startedAt ?? now;
    const delay = Math.max(Math.min(idle, startedAt + max - now), 0);

    const timer = setTimeout(() => {
      flush(visit.visitorId, since).catch((err) => console.warn('⚠️  Visit email failed:', err.message));
    }, delay);
    timer.unref?.();
    pending.set(visit.visitorId, { since, startedAt, timer });
  },
};
