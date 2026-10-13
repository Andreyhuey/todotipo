/**
 * Shared helpers for scheduled tasks (run by cron via cron/run-task.sh).
 */
import 'reflect-metadata';
import dotenv from 'dotenv';
import { Between } from 'typeorm';
import { AppDataSource, connectDatabase, disconnectDatabase } from '../config/database';
import { Visit } from '../entity/Visit';
import { SettingsService } from '../services/SettingsService';
import { site } from '../config/site';

dotenv.config();

/** Reports use the business's local day, not the server's UTC day. */
export const REPORT_TZ = process.env.REPORT_TIMEZONE || 'Africa/Lagos';

export const siteName = () => site.SITE_NAME.replace(/\.$/, '');
export const adminLink = (path = '') => `${site.SITE_LINK.replace(/\/$/, '')}/admin${path}`;

/** Connects, runs the task, waits for log writes, disconnects, sets the exit code. */
export async function runTask(name: string, fn: () => Promise<void>) {
  try {
    await connectDatabase();
    await fn();
  } catch (err) {
    console.error(`❌ Task ${name} failed:`, err);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase().catch(() => {});
  }
}

const csv = (v?: string) =>
  (v ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

/** Who gets business reports (weekly summary, enquiry reminders). */
export async function ownerRecipients() {
  const s = await SettingsService.get('site');
  const list = csv(process.env.REPORT_EMAIL);
  if (list.length) return list;
  return csv(s.notifyEmail || process.env.NOTIFY_EMAIL || s.email);
}

/** Who gets the daily visits email. */
export async function analyticsRecipients() {
  const list = csv(process.env.ANALYTICS_EMAIL);
  return list.length ? list : ownerRecipients();
}

// ---- time ----------------------------------------------------------------

/** Offset (ms) of a timezone from UTC at a given instant. */
const tzOffset = (at: Date, tz: string) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
      .formatToParts(at)
      .map((p) => [p.type, p.value])
  );
  const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return asUtc - Math.floor(at.getTime() / 1000) * 1000;
};

/** Start of the local day (in REPORT_TZ) that `daysAgo` days before today began. */
export function localDayStart(daysAgo: number, tz = REPORT_TZ) {
  const now = new Date();
  const local = new Date(now.getTime() + tzOffset(now, tz));
  const midnightLocalAsUtc = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() - daysAgo);
  const guess = new Date(midnightLocalAsUtc);
  return new Date(midnightLocalAsUtc - tzOffset(guess, tz));
}

export const fmtDay = (d: Date, opts: Intl.DateTimeFormatOptions = {}) =>
  d.toLocaleDateString('en-GB', { timeZone: REPORT_TZ, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', ...opts });

// ---- visit statistics ----------------------------------------------------------

export interface Count {
  name: string;
  count: number;
}

const top = (map: Map<string, Set<string> | number>, limit: number): Count[] =>
  [...map.entries()]
    .map(([name, v]) => ({ name, count: typeof v === 'number' ? v : v.size }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

/** Page views, visitors and breakdowns for visits in [start, end). */
export async function visitStats(start: Date, end: Date) {
  const rows = await AppDataSource.getRepository(Visit).find({
    select: ['visitorId', 'sessionId', 'path', 'referrerHost', 'country', 'countryCode', 'city', 'device', 'duration'],
    where: { createdAt: Between(start, new Date(end.getTime() - 1)) },
  });

  const countries = new Map<string, Set<string>>();
  const cities = new Map<string, Set<string>>();
  const pages = new Map<string, number>();
  const sources = new Map<string, number>();
  const devices = new Map<string, Set<string>>();
  const sessions = new Map<string, number>();
  const add = (m: Map<string, Set<string>>, k: string, v: string) => m.set(k, (m.get(k) ?? new Set()).add(v));

  for (const r of rows) {
    add(countries, r.country || 'Unknown location', r.visitorId);
    if (r.city) add(cities, `${r.city}, ${r.country}`, r.visitorId);
    pages.set(r.path, (pages.get(r.path) ?? 0) + 1);
    if (r.referrerHost) sources.set(r.referrerHost, (sources.get(r.referrerHost) ?? 0) + 1);
    add(devices, r.device || 'unknown', r.visitorId);
    sessions.set(r.sessionId, (sessions.get(r.sessionId) ?? 0) + 1);
  }
  const durations = rows.map((r) => r.duration).filter((d): d is number => !!d && d > 0);

  return {
    pageViews: rows.length,
    visitors: new Set(rows.map((r) => r.visitorId)).size,
    sessions: sessions.size,
    avgDuration: durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0,
    countries: top(countries, 15),
    cities: top(cities, 10),
    pages: top(pages, 8),
    sources: top(sources, 6),
    directVisits: rows.filter((r) => !r.referrerHost).length,
    devices: top(devices, 3),
  };
}

/** "▲ 12%" / "▼ 5%" / "—" compared with a previous value. */
export const change = (now: number, before: number) => {
  if (!before) return now ? 'new' : '—';
  const pct = Math.round(((now - before) / before) * 100);
  return pct === 0 ? 'no change' : `${pct > 0 ? '▲' : '▼'} ${Math.abs(pct)}% vs previous`;
};

export const fmtDuration = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`);
