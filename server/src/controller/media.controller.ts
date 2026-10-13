import { Request, Response } from 'express';
import { EntityTarget, ObjectLiteral } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Media } from '../entity/Media';
import { Product } from '../entity/Product';
import { DesignCase } from '../entity/DesignCase';
import { Category } from '../entity/Category';
import { Setting } from '../entity/Setting';
import { FileService } from '../services/FileService';
import { HttpError, idParam, int, str } from '../helpers/http';
import { changedFields } from '../services/LogService';

const files = new FileService();
const repo = () => AppDataSource.getRepository(Media);

export const listMedia = async (req: Request, res: Response) => {
  const page = Math.max(int(req.query.page, 1), 1);
  const perPage = Math.min(Math.max(int(req.query.per_page, 48), 1), 200);
  const folder = str(req.query.folder);
  const q = str(req.query.q);
  const kind = str(req.query.kind); // "image" | "video"

  const qb = repo().createQueryBuilder('m').orderBy('m.createdAt', 'DESC');
  if (folder) qb.andWhere('m.folder = :folder', { folder });
  if (kind) qb.andWhere('m.mimeType LIKE :kind', { kind: `${kind}/%` });
  if (q) {
    qb.andWhere('(LOWER(m.originalName) LIKE :q OR LOWER(m.alt) LIKE :q)', {
      q: `%${q.toLowerCase()}%`,
    });
  }

  const [data, total] = await qb
    .skip((page - 1) * perPage)
    .take(perPage)
    .getManyAndCount();

  const folders = await repo()
    .createQueryBuilder('m')
    .select('m.folder', 'folder')
    .addSelect('COUNT(*)', 'count')
    .groupBy('m.folder')
    .getRawMany<{ folder: string; count: string }>();

  res.json({
    status: true,
    data,
    folders: folders.map((f) => ({ name: f.folder, count: Number(f.count) })),
    pagination: {
      total,
      per_page: perPage,
      current_page: page,
      last_page: Math.max(Math.ceil(total / perPage), 1),
    },
  });
};

export const uploadMedia = async (req: Request, res: Response) => {
  const uploaded = (req.files as Express.Multer.File[] | undefined) ?? [];
  if (!uploaded.length) throw new HttpError(400, 'No files received');

  const folder = str(req.body.folder) || 'general';
  const stored = await files.saveFiles(
    uploaded.map((f) => ({
      buffer: f.buffer,
      originalName: f.originalname,
      mimeType: f.mimetype,
    })),
    folder
  );

  const rows = await repo().save(
    stored.map((s, i) =>
      repo().create({
        ...s,
        originalName: uploaded[i].originalname,
        alt: str(req.body.alt) || uploaded[i].originalname.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
        folder,
      })
    )
  );

  res.locals.audit = {
    label: rows.length === 1 ? `“${rows[0].originalName}”` : `${rows.length} files`,
    meta: { files: rows.map((r) => r.originalName), folder },
  };
  res.status(201).json({ status: true, message: 'Uploaded', data: rows });
};

export const updateMedia = async (req: Request, res: Response) => {
  const media = await repo().findOneBy({ id: idParam(req) });
  if (!media) throw new HttpError(404, 'Media not found');

  const before = { alt: media.alt, folder: media.folder };
  if (req.body.alt !== undefined) media.alt = str(req.body.alt);
  if (req.body.folder !== undefined) media.folder = str(req.body.folder) || 'general';
  res.locals.audit = { id: media.id, label: media.originalName, meta: { changed: changedFields(before, media, ['alt', 'folder']) } };
  res.json({ status: true, data: await repo().save(media) });
};

/** Where on the site a media URL is referenced. */
const findUsage = async (url: string) => {
  const ds = AppDataSource;
  // Query builder (not find options) so the LIKE parameter isn't JSON-encoded
  // for simple-json columns.
  const matching = <T extends ObjectLiteral>(
    entity: EntityTarget<T>,
    columns: string[]
  ) =>
    ds
      .getRepository(entity)
      .createQueryBuilder('e')
      .where(columns.map((c) => `e.${c} LIKE :q`).join(' OR '), { q: `%${url}%` })
      .getMany();

  const [products, cases, categories, settings] = await Promise.all([
    matching(Product, ['image', 'seoImage', 'video', 'gallery', 'blocks']),
    matching(DesignCase, ['coverImage', 'seoImage', 'images']),
    matching(Category, ['image']),
    matching(Setting, ['value']),
  ]);

  return [
    ...products.map((p) => `Product: ${p.title}`),
    ...cases.map((c) => `Design case: ${c.name}`),
    ...categories.map((c) => `Category: ${c.name}`),
    ...settings.map((s) => `Settings: ${s.key}`),
  ];
};

export const mediaUsage = async (req: Request, res: Response) => {
  const media = await repo().findOneBy({ id: idParam(req) });
  if (!media) throw new HttpError(404, 'Media not found');
  res.json({ status: true, data: await findUsage(media.url) });
};

export const deleteMedia = async (req: Request, res: Response) => {
  const media = await repo().findOneBy({ id: idParam(req) });
  if (!media) throw new HttpError(404, 'Media not found');

  res.locals.audit = { id: media.id, label: media.originalName, meta: { forced: req.query.force === 'true' } };
  if (req.query.force !== 'true') {
    const usage = await findUsage(media.url);
    if (usage.length) {
      res.locals.errorMessage = `still used by ${usage.join(', ')}`;
      res.status(409).json({
        status: false,
        message: 'This file is still used on the site',
        usage,
      });
      return;
    }
  }

  await files.removeFiles([media.fileName]);
  await repo().remove(media);
  res.json({ status: true, message: 'Deleted' });
};
