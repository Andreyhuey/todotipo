import { Request } from 'express';
import { LessThan } from 'typeorm';
import { AppDataSource } from '../config/database';
import { ActivityLog, ActorType, LogCategory, LogLevel } from '../entity/ActivityLog';
import { clientIp } from '../helpers/http';

export interface LogEntry {
  category: LogCategory;
  action: string;
  message: string;
  level?: LogLevel;
  actor?: { type: ActorType; id?: number | null; email?: string };
  ip?: string;
  userAgent?: string;
  target?: { type: string; id?: string | number; label?: string };
  meta?: Record<string, unknown>;
}

const RETENTION_DAYS = Number(process.env.LOG_RETENTION_DAYS || 180);

/** Who/where a request came from, for log entries made inside a request. */
export const requestContext = (req: Request): Pick<LogEntry, 'actor' | 'ip' | 'userAgent'> => ({
  actor: req.user
    ? { type: 'admin', id: req.user.id, email: req.user.email }
    : { type: 'visitor' },
  ip: clientIp(req),
  userAgent: String(req.headers['user-agent'] ?? '').slice(0, 512),
});

export const LogService = {
  /**
   * Records an entry. Never throws and never blocks the caller — logging must
   * not be able to break the action being logged.
   */
  record(entry: LogEntry): void {
    if (!AppDataSource.isInitialized) return;
    const repo = AppDataSource.getRepository(ActivityLog);
    repo
      .save(
        repo.create({
          level: entry.level ?? 'info',
          category: entry.category,
          action: entry.action.slice(0, 60),
          message: entry.message.slice(0, 500),
          actorType: entry.actor?.type ?? 'system',
          actorId: entry.actor?.id ?? null,
          actorEmail: (entry.actor?.email ?? '').slice(0, 255),
          ip: (entry.ip ?? '').slice(0, 64),
          userAgent: (entry.userAgent ?? '').slice(0, 512),
          targetType: (entry.target?.type ?? '').slice(0, 40),
          targetId: String(entry.target?.id ?? '').slice(0, 64),
          targetLabel: (entry.target?.label ?? '').slice(0, 255),
          meta: entry.meta ?? {},
        })
      )
      .catch((err) => console.warn('⚠️  Could not write activity log:', err.message));
  },

  /** Shorthand for system events (no request/actor). */
  system(action: string, message: string, level: LogLevel = 'info', meta: Record<string, unknown> = {}) {
    this.record({ category: 'system', action, message, level, meta });
  },

  /** Deletes entries older than LOG_RETENTION_DAYS. */
  async prune() {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 864e5);
    const res = await AppDataSource.getRepository(ActivityLog).delete({ createdAt: LessThan(cutoff) });
    if (res.affected) console.log(`🧹 Pruned ${res.affected} activity log entries older than ${RETENTION_DAYS} days`);
  },
};

/** Field names whose values differ between two objects (for "changed" summaries). */
export const changedFields = (before: object | null | undefined, after: object, keys = Object.keys(after)) =>
  keys.filter(
    (k) => JSON.stringify((before as Record<string, unknown> | undefined)?.[k]) !== JSON.stringify((after as Record<string, unknown>)[k])
  );
