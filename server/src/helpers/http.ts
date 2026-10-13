import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ObjectLiteral, Repository } from 'typeorm';

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Wraps an async route so thrown errors reach the error middleware. */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  res.locals.errorMessage = err instanceof Error ? err.message : String(err);
  if (err instanceof HttpError) {
    res.status(err.status).json({ status: false, message: err.message });
    return;
  }
  const message = err instanceof Error ? err.message : 'Server error';
  if (/LIMIT_FILE_SIZE/.test(String((err as { code?: string })?.code))) {
    res.status(413).json({ status: false, message: 'File is too large' });
    return;
  }
  console.error('❌ Unhandled error:', err);
  // Admin requests are already logged by the audit trail.
  if (!_req.originalUrl.startsWith('/api/admin')) {
    import('../services/LogService').then(({ LogService }) =>
      LogService.system('server.error', `Unexpected error on ${_req.method} ${_req.originalUrl.split('?')[0]}`, 'error', {
        error: message,
        stack: err instanceof Error ? err.stack?.split('\n').slice(0, 5).join('\n') : undefined,
      })
    );
  }
  res.status(500).json({ status: false, message: process.env.NODE_ENV === 'production' ? 'Server error' : message });
};

export const toSlug = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]+/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

/** Returns `base`, or `base-2`, `base-3`… if taken by another row. */
export const uniqueSlug = async <T extends ObjectLiteral & { id: number; slug: string }>(
  repo: Repository<T>,
  source: string,
  excludeId?: number
) => {
  const base = toSlug(source) || 'item';
  let slug = base;
  for (let i = 2; ; i++) {
    const existing = await repo.findOne({ where: { slug } as never });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${i}`;
  }
};

// ---- lightweight input coercion -------------------------------------------

export const str = (v: unknown, fallback = '') =>
  typeof v === 'string' ? v.trim() : v == null ? fallback : String(v);

export const bool = (v: unknown, fallback = false) =>
  typeof v === 'boolean' ? v : v === 'true' ? true : v === 'false' ? false : fallback;

export const int = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
};

export const strArray = (v: unknown) =>
  Array.isArray(v) ? v.map((x) => str(x)).filter(Boolean) : [];

export const idParam = (req: Request) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) throw new HttpError(400, 'Invalid id');
  return id;
};

/** Real client IP: Cloudflare header, else Express (honours trust proxy). */
export const clientIp = (req: Request) => {
  const raw = (req.headers['cf-connecting-ip'] as string) || req.ip || req.socket.remoteAddress || '';
  return raw.replace(/^::ffff:/, '').slice(0, 64);
};
