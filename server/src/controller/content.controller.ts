import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Category } from '../entity/Category';
import { Product } from '../entity/Product';
import { DesignCase } from '../entity/DesignCase';
import { Inquiry } from '../entity/Inquiry';
import { Media } from '../entity/Media';
import { NewsletterSubscriber } from '../entity/Mail';
import { SettingsService, SettingsKey, settingsKeys } from '../services/SettingsService';
import { HttpError, idParam, int, str } from '../helpers/http';
import { visitsToday } from './analytics.controller';
import { recentActivity } from './logs.controller';
import { changedFields } from '../services/LogService';

// ---- public ----------------------------------------------------------------

/**
 * Everything the public layout needs in one request: site settings, page
 * content and the category list (for navigation and footer).
 */
export const getSite = async (_req: Request, res: Response) => {
  const [settings, categories] = await Promise.all([
    SettingsService.getAll(),
    AppDataSource.getRepository(Category).find({
      order: { sortOrder: 'ASC', id: 'ASC' },
    }),
  ]);
  // notifyEmail is internal routing, not for the public site.
  const { notifyEmail: _hidden, ...site } = settings.site;
  res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
  res.json({ status: true, data: { ...settings, site, categories } });
};

// ---- settings (admin) ------------------------------------------------------

const assertKey = (key: string): SettingsKey => {
  if (!settingsKeys.includes(key as SettingsKey)) {
    throw new HttpError(404, 'Unknown settings section');
  }
  return key as SettingsKey;
};

export const getAllSettings = async (_req: Request, res: Response) => {
  res.json({ status: true, data: await SettingsService.getAll() });
};

export const updateSettings = async (req: Request, res: Response) => {
  const key = assertKey(req.params.key);
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    throw new HttpError(400, 'Settings must be an object');
  }
  const before = await SettingsService.get(key);
  const saved = await SettingsService.set(key, req.body);
  res.locals.audit = { id: key, label: key, meta: { changed: changedFields(before, saved) } };
  res.json({ status: true, message: 'Saved', data: saved });
};

// ---- inquiries -------------------------------------------------------------

const inquiries = () => AppDataSource.getRepository(Inquiry);

export const listInquiries = async (req: Request, res: Response) => {
  const page = Math.max(int(req.query.page, 1), 1);
  const perPage = 25;
  const type = str(req.query.type);

  const [data, total] = await inquiries().findAndCount({
    where: type ? { type: type as Inquiry['type'] } : {},
    order: { createdAt: 'DESC' },
    skip: (page - 1) * perPage,
    take: perPage,
  });

  res.json({
    status: true,
    data,
    unread: await inquiries().countBy({ isRead: false }),
    pagination: {
      total,
      per_page: perPage,
      current_page: page,
      last_page: Math.max(Math.ceil(total / perPage), 1),
    },
  });
};

export const markInquiry = async (req: Request, res: Response) => {
  const item = await inquiries().findOne({ where: { id: idParam(req) }, select: ['id', 'name', 'email'] });
  res.locals.audit = { id: item?.id, label: item ? `${item.name} <${item.email}>` : undefined, meta: { isRead: req.body.isRead !== false } };
  await inquiries().update(idParam(req), { isRead: req.body.isRead !== false });
  res.json({ status: true });
};

export const deleteInquiry = async (req: Request, res: Response) => {
  const item = await inquiries().findOne({ where: { id: idParam(req) }, select: ['id', 'name', 'email', 'subject'] });
  res.locals.audit = { id: item?.id, label: item ? `${item.name} <${item.email}>` : undefined, meta: { subject: item?.subject } };
  await inquiries().delete(idParam(req));
  res.json({ status: true, message: 'Deleted' });
};

// ---- subscribers -----------------------------------------------------------

const subscribers = () => AppDataSource.getRepository(NewsletterSubscriber);

export const listSubscribers = async (req: Request, res: Response) => {
  const data = await subscribers().find({ order: { createdAt: 'DESC' } });

  if (req.query.format === 'csv') {
    const csv = ['email,subscribed_at']
      .concat(data.map((s) => `${s.email},${new Date(s.createdAt).toISOString()}`))
      .join('\n');
    res.set('Content-Type', 'text/csv');
    res.set('Content-Disposition', 'attachment; filename="subscribers.csv"');
    res.send(csv);
    return;
  }

  res.json({ status: true, data });
};

export const deleteSubscriber = async (req: Request, res: Response) => {
  const sub = await subscribers().findOneBy({ id: idParam(req) });
  res.locals.audit = { id: sub?.id, label: sub?.email };
  await subscribers().delete(idParam(req));
  res.json({ status: true, message: 'Removed' });
};

// ---- dashboard -------------------------------------------------------------

export const dashboard = async (_req: Request, res: Response) => {
  const ds = AppDataSource;
  const [productCount, caseCount, mediaCount, subscriberCount, unread, recent, today, activity] =
    await Promise.all([
      ds.getRepository(Product).count(),
      ds.getRepository(DesignCase).count(),
      ds.getRepository(Media).count(),
      subscribers().count(),
      inquiries().countBy({ isRead: false }),
      inquiries().find({ order: { createdAt: 'DESC' }, take: 6 }),
      visitsToday(),
      recentActivity(),
    ]);

  res.json({
    status: true,
    data: {
      counts: {
        products: productCount,
        designCases: caseCount,
        media: mediaCount,
        subscribers: subscriberCount,
        unreadInquiries: unread,
        visitorsToday: today.visitors,
        pageViewsToday: today.pageViews,
      },
      recentInquiries: recent,
      recentActivity: activity,
    },
  });
};
