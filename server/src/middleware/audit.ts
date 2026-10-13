import { NextFunction, Request, Response } from 'express';
import { LogCategory } from '../entity/ActivityLog';
import { LogService, requestContext } from '../services/LogService';

/**
 * Extra context a controller can attach for the audit entry:
 *   res.locals.audit = { label: 'Solid Decking Board', id: 12, meta: { changed: [...] } }
 */
export interface AuditContext {
  label?: string;
  id?: string | number;
  meta?: Record<string, unknown>;
}

interface Rule {
  category: LogCategory;
  action: string;
  target?: string;
  /** Summary for a successful request. */
  message: (a: AuditContext, req: Request) => string;
}

const q = (s?: string) => (s ? (s.startsWith('#') ? s : `“${s}”`) : '');

/** 'Updated product “X”' -> 'Couldn't update product “X”' for failure messages. */
const VERBS: Record<string, string> = {
  Created: 'create', Updated: 'update', Deleted: 'delete', Reordered: 'reorder', Uploaded: 'upload',
  Edited: 'edit', Marked: 'mark', Removed: 'remove', Added: 'add', Changed: 'change',
};
const failed = (summary: string) => {
  const [first, ...rest] = summary.split(' ');
  return VERBS[first] ? `Couldn't ${VERBS[first]} ${rest.join(' ')}` : `Failed: ${summary}`;
};
const changed = (a: AuditContext) => {
  const fields = (a.meta?.changed as string[] | undefined) ?? [];
  return fields.length ? ` (${fields.join(', ')})` : '';
};

/** Keyed by "<METHOD> <mounted route>". */
const RULES: Record<string, Rule> = {
  'POST /api/admin/products': { category: 'content', action: 'product.created', target: 'product', message: (a) => `Created product ${q(a.label)}` },
  'PUT /api/admin/products/reorder': { category: 'content', action: 'product.reordered', message: () => 'Reordered products' },
  'PUT /api/admin/products/:id': { category: 'content', action: 'product.updated', target: 'product', message: (a) => `Updated product ${q(a.label)}${changed(a)}` },
  'DELETE /api/admin/products/:id': { category: 'content', action: 'product.deleted', target: 'product', message: (a) => `Deleted product ${q(a.label)}` },

  'POST /api/admin/categories': { category: 'content', action: 'category.created', target: 'category', message: (a) => `Created category ${q(a.label)}` },
  'PUT /api/admin/categories/reorder': { category: 'content', action: 'category.reordered', message: () => 'Reordered categories' },
  'PUT /api/admin/categories/:id': { category: 'content', action: 'category.updated', target: 'category', message: (a) => `Updated category ${q(a.label)}${changed(a)}` },
  'DELETE /api/admin/categories/:id': { category: 'content', action: 'category.deleted', target: 'category', message: (a) => `Deleted category ${q(a.label)}` },

  'POST /api/admin/design-cases': { category: 'content', action: 'design_case.created', target: 'design_case', message: (a) => `Created design case ${q(a.label)}` },
  'PUT /api/admin/design-cases/reorder': { category: 'content', action: 'design_case.reordered', message: () => 'Reordered design cases' },
  'PUT /api/admin/design-cases/:id': { category: 'content', action: 'design_case.updated', target: 'design_case', message: (a) => `Updated design case ${q(a.label)}${changed(a)}` },
  'DELETE /api/admin/design-cases/:id': { category: 'content', action: 'design_case.deleted', target: 'design_case', message: (a) => `Deleted design case ${q(a.label)}` },

  'POST /api/admin/media': { category: 'media', action: 'media.uploaded', target: 'media', message: (a) => `Uploaded ${a.label ?? 'files'}` },
  'PATCH /api/admin/media/:id': { category: 'media', action: 'media.updated', target: 'media', message: (a) => `Edited ${q(a.label)}${changed(a)}` },
  'DELETE /api/admin/media/:id': { category: 'media', action: 'media.deleted', target: 'media', message: (a) => `Deleted file ${q(a.label)}` },

  'PUT /api/admin/settings/:key': { category: 'settings', action: 'settings.updated', target: 'settings', message: (a) => `Updated ${a.label ?? 'site'} settings${changed(a)}` },

  'PATCH /api/admin/inquiries/:id': { category: 'inbox', action: 'inquiry.marked', target: 'inquiry', message: (a) => `Marked message from ${a.label ?? 'a visitor'} as ${a.meta?.isRead ? 'read' : 'unread'}` },
  'DELETE /api/admin/inquiries/:id': { category: 'inbox', action: 'inquiry.deleted', target: 'inquiry', message: (a) => `Deleted message from ${a.label ?? 'a visitor'}` },
  'DELETE /api/admin/subscribers/:id': { category: 'inbox', action: 'subscriber.removed', target: 'subscriber', message: (a) => `Removed subscriber ${a.label ?? ''}` },

  'POST /api/admin/users': { category: 'users', action: 'user.created', target: 'user', message: (a) => `Added admin ${a.label ?? ''}` },
  'DELETE /api/admin/users/:id': { category: 'users', action: 'user.deleted', target: 'user', message: (a) => `Removed admin ${a.label ?? ''}` },

  'PUT /api/auth/password': { category: 'security', action: 'auth.password_changed', message: () => 'Changed their password' },
};

/** Compiled once: method + path regex. ':id' / ':key' match one path segment. */
const COMPILED = Object.entries(RULES).map(([key, rule]) => {
  const [method, pattern] = key.split(' ');
  const re = new RegExp(`^${pattern.replace(/:[a-z]+/gi, '[^/]+')}/?$`);
  return { method, re, rule };
});

const findRule = (method: string, path: string) =>
  COMPILED.find((r) => r.method === method && r.re.test(path))?.rule;

/** Writes an activity log entry for every state-changing admin request once it completes. */
export const auditTrail = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();

  res.on('finish', () => {
    const path = req.originalUrl.split('?')[0];
    const rule = findRule(req.method, path);
    const audit: AuditContext = { ...res.locals.audit };
    // Errors thrown before the controller identified the item: fall back to its id.
    const lastSegment = path.split('/').pop() ?? '';
    if (!audit.label && /^\d+$/.test(lastSegment)) audit.label = `#${lastSegment}`;
    const ok = res.statusCode < 400;

    // Unauthenticated 401s are covered by sign-in logging.
    if (res.statusCode === 401 && !req.user) return;
    // Requests without a rule (e.g. login, which logs itself) only matter if they crashed.
    if (!rule && res.statusCode < 500) return;

    const summary = rule ? rule.message(audit, req) : `${req.method} ${path}`;
    const reason = res.locals.errorMessage ?? `HTTP ${res.statusCode}`;
    LogService.record({
      ...requestContext(req),
      category: rule?.category ?? 'system',
      action: rule ? (ok ? rule.action : `${rule.action}.failed`) : 'request',
      level: ok ? 'info' : res.statusCode >= 500 ? 'error' : 'warning',
      message: ok ? summary : `${failed(summary)} — ${reason}`,
      target: rule?.target ? { type: rule.target, id: audit.id ?? path.split('/').pop(), label: audit.label } : undefined,
      meta: { ...audit.meta, method: req.method, path, status: res.statusCode },
    });
  });
  next();
};

