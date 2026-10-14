import { Request, Response } from 'express';
import { Between, In, MoreThanOrEqual } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Visit } from '../entity/Visit';
import { IpGeo } from '../entity/IpGeo';
import { GeoService } from '../services/GeoService';
import { VisitNotifier } from '../services/VisitNotifier';
import { parseUserAgent } from '../helpers/user-agent';
import { HttpError, clientIp, int, str } from '../helpers/http';

const visits = () => AppDataSource.getRepository(Visit);

const ID_RE = /^[a-zA-Z0-9_-]{8,64}$/;

// ---- public tracking -------------------------------------------------------

/** POST /api/track — records a page view; geolocation runs afterwards. */
export const trackVisit = async (req: Request, res: Response) => {
  const ua = String(req.headers['user-agent'] ?? '');
  const parsed = parseUserAgent(ua);
  const visitorId = str(req.body.visitorId);
  const sessionId = str(req.body.sessionId);
  const path = str(req.body.path).slice(0, 512);

  if (parsed.isBot || !ID_RE.test(visitorId) || !ID_RE.test(sessionId) || !path.startsWith('/')) {
    res.status(202).json({ status: true }); // silently ignore bots / junk
    return;
  }
  if (path.startsWith('/admin')) {
    res.status(202).json({ status: true });
    return;
  }

  const referrer = str(req.body.referrer).slice(0, 1024);
  let referrerHost = '';
  try {
    const host = referrer ? new URL(referrer).hostname.replace(/^www\./, '') : '';
    const own = new URL(String(req.headers.origin || 'http://x')).hostname.replace(/^www\./, '');
    referrerHost = host === own ? '' : host;
  } catch {
    // malformed referrer — treat as direct
  }

  const ip = clientIp(req);
  const visit = await visits().save(
    visits().create({
      visitorId,
      sessionId,
      path,
      title: str(req.body.title).slice(0, 255),
      referrer,
      referrerHost: referrerHost.slice(0, 255),
      ip,
      userAgent: ua.slice(0, 512),
      browser: parsed.browser,
      os: parsed.os,
      device: parsed.device,
      screen: str(req.body.screen).slice(0, 20),
      language: str(req.body.language).slice(0, 20),
    })
  );

  res.status(201).json({ status: true, id: visit.id });

  VisitNotifier.queue(visit);
  GeoService.enrichVisit(visit.id, ip).catch((err) => console.warn('⚠️  Visit enrichment failed:', err.message));
};

/** POST /api/track/leave — time on page, sent via sendBeacon (text/plain). */
export const trackLeave = async (req: Request, res: Response) => {
  let body: Record<string, unknown> = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  const id = int(body.id, 0);
  const duration = Math.min(Math.max(int(body.duration, 0), 0), 6 * 3600);
  const visitorId = str(body.visitorId);
  if (id && ID_RE.test(visitorId)) {
    await visits().update({ id, visitorId }, { duration });
  }
  res.status(204).end();
};

// ---- admin -----------------------------------------------------------------

const RANGES: Record<string, number> = { '24h': 1, '7d': 7, '30d': 30, '90d': 90 };

const rangeOf = (req: Request) => {
  const key = str(req.query.range) in RANGES ? str(req.query.range) : '7d';
  const days = RANGES[key];
  const end = new Date();
  const start = new Date(end.getTime() - days * 864e5);
  const prevStart = new Date(start.getTime() - days * 864e5);
  return { key, days, start, end, prevStart };
};

type Row = Pick<
  Visit,
  'visitorId' | 'sessionId' | 'path' | 'title' | 'referrerHost' | 'country' | 'countryCode' | 'city' | 'device' | 'browser' | 'os' | 'duration' | 'createdAt'
>;

const top = <T extends string>(rows: Row[], key: (r: Row) => T, limit = 10, unique = false) => {
  const counts = new Map<T, Set<string> | number>();
  for (const r of rows) {
    const k = key(r);
    if (!k) continue;
    if (unique) {
      const s = (counts.get(k) as Set<string>) ?? new Set<string>();
      s.add(r.visitorId);
      counts.set(k, s);
    } else counts.set(k, ((counts.get(k) as number) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, v]) => ({ name, count: typeof v === 'number' ? v : v.size }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

const kpis = (rows: Pick<Row, 'visitorId' | 'sessionId' | 'duration'>[]) => {
  const sessions = new Map<string, number>();
  for (const r of rows) sessions.set(r.sessionId, (sessions.get(r.sessionId) ?? 0) + 1);
  const durations = rows.map((r) => r.duration).filter((d): d is number => d !== null && d > 0);
  return {
    pageViews: rows.length,
    visitors: new Set(rows.map((r) => r.visitorId)).size,
    sessions: sessions.size,
    bounceRate: sessions.size ? Math.round(([...sessions.values()].filter((n) => n === 1).length / sessions.size) * 100) : 0,
    avgDuration: durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0,
  };
};

/**
 * GET /api/admin/analytics?range=7d&tz=<minutes offset>
 * Aggregates in memory — fine for tens of thousands of views per range.
 */
export const analyticsSummary = async (req: Request, res: Response) => {
  const { key, days, start, end, prevStart } = rangeOf(req);
  const tzOffset = Math.max(Math.min(int(req.query.tz, 0), 840), -840); // minutes, as from getTimezoneOffset()

  const select: (keyof Row)[] = ['visitorId', 'sessionId', 'path', 'title', 'referrerHost', 'country', 'countryCode', 'city', 'device', 'browser', 'os', 'duration', 'createdAt'];
  const [rows, prevRows, live] = await Promise.all([
    visits().find({ select, where: { createdAt: Between(start, end) } }) as Promise<Row[]>,
    visits().find({ select: ['visitorId', 'sessionId', 'duration'], where: { createdAt: Between(prevStart, start) } }),
    visits()
      .createQueryBuilder('v')
      .select('COUNT(DISTINCT v.visitorId)', 'n')
      .where('v.createdAt >= :t', { t: new Date(Date.now() - 5 * 60_000) })
      .getRawOne<{ n: string }>(),
  ]);

  // Time series: hourly for 24h, daily otherwise, in the admin's local time.
  const hourly = days === 1;
  const step = hourly ? 3600e3 : 864e5;
  const local = (d: Date) => new Date(d.getTime() - tzOffset * 60e3);
  const bucketStart = (d: Date) => {
    const l = local(d);
    if (hourly) l.setUTCMinutes(0, 0, 0);
    else l.setUTCHours(0, 0, 0, 0);
    return l.getTime();
  };
  const buckets = new Map<number, { views: number; visitors: Set<string> }>();
  for (let t = bucketStart(start); t <= bucketStart(end); t += step) {
    buckets.set(t, { views: 0, visitors: new Set() });
  }
  for (const r of rows) {
    const b = buckets.get(bucketStart(new Date(r.createdAt)));
    if (b) {
      b.views++;
      b.visitors.add(r.visitorId);
    }
  }

  const countryNames = new Map(rows.map((r) => [r.countryCode, r.country]));

  res.json({
    status: true,
    data: {
      range: key,
      granularity: hourly ? 'hour' : 'day',
      live: Number(live?.n ?? 0),
      totals: kpis(rows),
      previous: kpis(prevRows),
      series: [...buckets.entries()].map(([t, b]) => ({
        // ISO string of the local bucket start (no timezone suffix)
        t: new Date(t).toISOString().slice(0, hourly ? 13 : 10),
        views: b.views,
        visitors: b.visitors.size,
      })),
      pages: top(rows, (r) => r.path),
      countries: top(rows, (r) => r.countryCode, 10, true).map((c) => ({ ...c, label: countryNames.get(c.name) || c.name })),
      cities: top(rows, (r) => (r.city ? `${r.city}|${r.countryCode}` : ''), 10, true),
      referrers: top(rows, (r) => r.referrerHost || 'Direct'),
      devices: top(rows, (r) => r.device, 5, true),
      browsers: top(rows, (r) => r.browser, 8, true),
      os: top(rows, (r) => r.os, 8, true),
      unlocated: rows.filter((r) => !r.countryCode).length,
    },
  });
};

/**
 * GET /api/admin/analytics/visitors?page&range&country&q
 * One row per visitor, most recently active first. A visitor matches the
 * filters if any of their page views in the range does.
 */
export const listVisitors = async (req: Request, res: Response) => {
  const { start } = rangeOf(req);
  const page = Math.max(int(req.query.page, 1), 1);
  const perPage = 30;

  const filtered = () => {
    const qb = visits().createQueryBuilder('v').where('v.createdAt >= :start', { start });
    const country = str(req.query.country).toUpperCase();
    if (country) qb.andWhere('v.countryCode = :country', { country });
    const q = str(req.query.q).toLowerCase();
    if (q) {
      qb.andWhere('(LOWER(v.path) LIKE :q OR LOWER(v.city) LIKE :q OR LOWER(v.country) LIKE :q OR v.ip LIKE :q)', {
        q: `%${q}%`,
      });
    }
    return qb;
  };

  const [groups, count] = await Promise.all([
    filtered()
      .select('v.visitorId', 'visitorId')
      .addSelect('MIN(v.id)', 'firstId')
      .addSelect('MAX(v.id)', 'lastId')
      .addSelect('COUNT(*)', 'views')
      .addSelect('COUNT(DISTINCT v.path)', 'pages')
      .addSelect('MIN(v.createdAt)', 'firstSeen')
      .addSelect('MAX(v.createdAt)', 'lastSeen')
      .addSelect('SUM(COALESCE(v.duration, 0))', 'duration')
      .groupBy('v.visitorId')
      .orderBy('MAX(v.createdAt)', 'DESC')
      .offset((page - 1) * perPage)
      .limit(perPage)
      .getRawMany<{
        visitorId: string;
        firstId: number;
        lastId: number;
        views: string;
        pages: string;
        firstSeen: Date;
        lastSeen: Date;
        duration: string;
      }>(),
    filtered().select('COUNT(DISTINCT v.visitorId)', 'n').getRawOne<{ n: string }>(),
  ]);

  // Landing details come from the first view, location/device from the latest.
  const ids = groups.flatMap((g) => [Number(g.firstId), Number(g.lastId)]);
  const rows = ids.length ? await visits().findBy({ id: In(ids) }) : [];
  const byId = new Map(rows.map((r) => [r.id, r]));

  const data = groups.map((g) => {
    const first = byId.get(Number(g.firstId))!;
    const last = byId.get(Number(g.lastId))!;
    return {
      visitorId: g.visitorId,
      views: Number(g.views),
      pages: Number(g.pages),
      duration: Number(g.duration),
      firstSeen: g.firstSeen,
      lastSeen: g.lastSeen,
      landingPage: first.path,
      referrerHost: first.referrerHost,
      city: last.city,
      region: last.region,
      country: last.country,
      countryCode: last.countryCode,
      device: last.device,
      browser: last.browser,
      os: last.os,
    };
  });

  const total = Number(count?.n ?? 0);
  res.json({
    status: true,
    data,
    pagination: { total, per_page: perPage, current_page: page, last_page: Math.max(Math.ceil(total / perPage), 1) },
  });
};

/**
 * GET /api/admin/analytics/visitors/:visitorId?range — the visitor's details
 * (from their latest page view, incl. raw geo data) and every page they viewed
 * in the range.
 */
export const getVisitor = async (req: Request, res: Response) => {
  const { start } = rangeOf(req);
  const visitorId = str(req.params.visitorId);
  if (!ID_RE.test(visitorId)) throw new HttpError(404, 'Visitor not found');

  const [pages, visitorTotal] = await Promise.all([
    visits().find({ where: { visitorId, createdAt: MoreThanOrEqual(start) }, order: { createdAt: 'ASC' }, take: 500 }),
    visits().countBy({ visitorId }),
  ]);
  if (!pages.length) throw new HttpError(404, 'Visitor not found');

  const visit = [...pages].reverse().find((p) => p.countryCode) ?? pages[pages.length - 1];
  const geo = await AppDataSource.getRepository(IpGeo).findOneBy({ ip: visit.ip });

  res.json({
    status: true,
    data: {
      visit,
      geo: geo?.data?.error ? null : geo?.data ?? null,
      pages: pages.map(({ id, sessionId, path, title, referrerHost, createdAt, duration }) => ({
        id,
        sessionId,
        path,
        title,
        referrerHost,
        createdAt,
        duration,
      })),
      visitorTotal,
    },
  });
};

/** Today's numbers for the dashboard cards. */
export const visitsToday = async () => {
  const since = new Date(Date.now() - 864e5);
  const rows = await visits().find({ select: ['visitorId'], where: { createdAt: MoreThanOrEqual(since) } });
  return { pageViews: rows.length, visitors: new Set(rows.map((r) => r.visitorId)).size };
};
