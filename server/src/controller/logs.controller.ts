import { Request, Response } from 'express';
import { Brackets } from 'typeorm';
import { AppDataSource } from '../config/database';
import { ActivityLog } from '../entity/ActivityLog';
import { int, str } from '../helpers/http';

const logs = () => AppDataSource.getRepository(ActivityLog);

const RANGES: Record<string, number> = { '24h': 1, '7d': 7, '30d': 30, '90d': 90, all: 0 };

/** Builds the filtered query shared by the list and the CSV export. */
const filtered = (req: Request) => {
  const qb = logs().createQueryBuilder('l').orderBy('l.createdAt', 'DESC').addOrderBy('l.id', 'DESC');

  const days = RANGES[str(req.query.range)] ?? 7;
  if (days) qb.andWhere('l.createdAt >= :since', { since: new Date(Date.now() - days * 864e5) });

  const category = str(req.query.category);
  if (category) qb.andWhere('l.category = :category', { category });

  const level = str(req.query.level);
  if (level) qb.andWhere('l.level = :level', { level });

  const actor = str(req.query.actor);
  if (actor) qb.andWhere('l.actorType = :actor', { actor });

  const q = str(req.query.q).toLowerCase();
  if (q) {
    qb.andWhere(
      new Brackets((w) =>
        w
          .where('LOWER(l.message) LIKE :q')
          .orWhere('LOWER(l.actorEmail) LIKE :q')
          .orWhere('LOWER(l.targetLabel) LIKE :q')
          .orWhere('LOWER(l.action) LIKE :q')
          .orWhere('l.ip LIKE :q')
      ),
      { q: `%${q}%` }
    );
  }
  return { qb, days };
};

/** GET /api/admin/logs?range&category&level&actor&q&page */
export const listLogs = async (req: Request, res: Response) => {
  const page = Math.max(int(req.query.page, 1), 1);
  const perPage = 50;
  const { qb, days } = filtered(req);
  const [data, total] = await qb.skip((page - 1) * perPage).take(perPage).getManyAndCount();

  // Counts per category and level for the filter chips (same time range only).
  const facet = (col: 'category' | 'level') => {
    const f = logs().createQueryBuilder('l').select(`l.${col}`, 'name').addSelect('COUNT(*)', 'count').groupBy(`l.${col}`);
    if (days) f.where('l.createdAt >= :since', { since: new Date(Date.now() - days * 864e5) });
    return f.getRawMany<{ name: string; count: string }>();
  };
  const [categories, levels] = await Promise.all([facet('category'), facet('level')]);

  res.json({
    status: true,
    data,
    facets: {
      categories: categories.map((c) => ({ name: c.name, count: Number(c.count) })),
      levels: levels.map((l) => ({ name: l.name, count: Number(l.count) })),
    },
    pagination: { total, per_page: perPage, current_page: page, last_page: Math.max(Math.ceil(total / perPage), 1) },
  });
};

/** GET /api/admin/logs/export — the current filter as CSV (max 10,000 rows). */
export const exportLogs = async (req: Request, res: Response) => {
  const { qb } = filtered(req);
  const rows = await qb.take(10_000).getMany();
  const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const header = ['time', 'level', 'category', 'action', 'message', 'actor', 'actor_email', 'ip', 'target', 'details'];
  const csv = [header.join(',')]
    .concat(
      rows.map((r) =>
        [
          new Date(r.createdAt).toISOString(),
          r.level,
          r.category,
          r.action,
          r.message,
          r.actorType,
          r.actorEmail,
          r.ip,
          r.targetLabel,
          JSON.stringify(r.meta),
        ]
          .map(cell)
          .join(',')
      )
    )
    .join('\n');

  res.set('Content-Type', 'text/csv; charset=utf-8');
  res.set('Content-Disposition', `attachment; filename="activity-log-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(csv);
};

/** Latest entries for the dashboard. */
export const recentActivity = (take = 8) => logs().find({ order: { createdAt: 'DESC', id: 'DESC' }, take });
