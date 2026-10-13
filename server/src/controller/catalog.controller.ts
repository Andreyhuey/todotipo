import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Category } from '../entity/Category';
import { BlockItem, ContentBlock, Product, SpecRow } from '../entity/Product';
import { DesignCase } from '../entity/DesignCase';
import { changedFields } from '../services/LogService';
import {
  HttpError,
  bool,
  idParam,
  int,
  str,
  strArray,
  toSlug,
  uniqueSlug,
} from '../helpers/http';

const categories = () => AppDataSource.getRepository(Category);
const products = () => AppDataSource.getRepository(Product);
const cases = () => AppDataSource.getRepository(DesignCase);

const order = { sortOrder: 'ASC', id: 'ASC' } as const;

// ---- sanitizers ------------------------------------------------------------

const specRows = (v: unknown): SpecRow[] =>
  Array.isArray(v)
    ? v
        .map((r) => ({ name: str(r?.name), value: str(r?.value) }))
        .filter((r) => r.name || r.value)
    : [];

const blockItems = (v: unknown): BlockItem[] =>
  Array.isArray(v)
    ? v
        .map((i) => ({ image: str(i?.image), name: str(i?.name) }))
        .filter((i) => i.image)
    : [];

const BLOCK_TYPES = ['gallery', 'swatches', 'features', 'specs'] as const;

const contentBlocks = (v: unknown): ContentBlock[] =>
  Array.isArray(v)
    ? v
        .filter((b) => BLOCK_TYPES.includes(b?.type))
        .map((b) => ({
          type: b.type,
          title: str(b.title),
          columns: Math.min(Math.max(int(b.columns, 3), 1), 6),
          items: blockItems(b.items),
          specs: specRows(b.specs),
        }))
    : [];

const productInput = (body: Record<string, unknown>) => ({
  title: str(body.title),
  category: toSlug(str(body.category)),
  summary: str(body.summary),
  brand: str(body.brand),
  model: str(body.model),
  code: str(body.code),
  image: str(body.image),
  seoImage: str(body.seoImage),
  gallery: strArray(body.gallery),
  description: strArray(body.description),
  video: str(body.video),
  specifications: specRows(body.specifications),
  blocks: contentBlocks(body.blocks),
  featured: bool(body.featured),
  published: bool(body.published, true),
  sortOrder: int(body.sortOrder),
});

const caseInput = (body: Record<string, unknown>) => ({
  name: str(body.name),
  overview: str(body.overview),
  description: str(body.description),
  location: str(body.location),
  tags: strArray(body.tags),
  highlights: strArray(body.highlights),
  audience: strArray(body.audience),
  coverImage: str(body.coverImage),
  images: strArray(body.images),
  seoImage: str(body.seoImage),
  featured: bool(body.featured),
  published: bool(body.published, true),
  sortOrder: int(body.sortOrder),
});

/** Accepts either a numeric id or a slug. */
const byIdOrSlug = (param: string) =>
  /^\d+$/.test(param) ? { id: Number(param) } : { slug: param };

// ---- categories ------------------------------------------------------------

export const listCategories = async (_req: Request, res: Response) => {
  res.json({ status: true, data: await categories().find({ order }) });
};

export const saveCategory = async (req: Request, res: Response) => {
  const id = req.params.id ? idParam(req) : undefined;
  const existing = id ? await categories().findOneBy({ id }) : null;
  if (id && !existing) throw new HttpError(404, 'Category not found');

  const name = str(req.body.name);
  if (!name) throw new HttpError(400, 'Name is required');

  const oldSlug = existing?.slug;
  const before = existing ? { ...existing } : null;
  const category = categories().merge(existing ?? categories().create(), {
    name,
    description: str(req.body.description) || null,
    image: str(req.body.image) || null,
    sortOrder: int(req.body.sortOrder),
    slug: await uniqueSlug(categories(), str(req.body.slug) || name, id),
  });
  const saved = await categories().save(category);

  // Keep products attached when a category slug is renamed.
  if (oldSlug && oldSlug !== saved.slug) {
    await products().update({ category: oldSlug }, { category: saved.slug });
  }

  res.locals.audit = {
    id: saved.id,
    label: saved.name,
    meta: before ? { changed: changedFields(before, saved, ['name', 'slug', 'description', 'image', 'sortOrder']) } : {},
  };
  res.status(id ? 200 : 201).json({ status: true, data: saved });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const category = await categories().findOneBy({ id: idParam(req) });
  if (!category) throw new HttpError(404, 'Category not found');

  const inUse = await products().countBy({ category: category.slug });
  if (inUse) {
    throw new HttpError(
      409,
      `Move or delete the ${inUse} product(s) in this category first`
    );
  }
  res.locals.audit = { id: category.id, label: category.name };
  await categories().remove(category);
  res.json({ status: true, message: 'Category deleted' });
};

// ---- products --------------------------------------------------------------

export const listProducts = (admin: boolean) => async (req: Request, res: Response) => {
  const where: Record<string, unknown> = {};
  if (!admin) where.published = true;
  if (req.query.category) where.category = str(req.query.category);
  if (req.query.featured === 'true') where.featured = true;

  const data = await products().find({ where, order });
  res.json({ status: true, data });
};

export const getProduct = (admin: boolean) => async (req: Request, res: Response) => {
  const product = await products().findOneBy(byIdOrSlug(req.params.id));
  if (!product || (!admin && !product.published)) {
    throw new HttpError(404, 'Product not found');
  }
  res.json({ status: true, data: product });
};

export const saveProduct = async (req: Request, res: Response) => {
  const id = req.params.id ? idParam(req) : undefined;
  const existing = id ? await products().findOneBy({ id }) : null;
  if (id && !existing) throw new HttpError(404, 'Product not found');
  // Snapshot before merge(), which mutates `existing` in place.
  const before = existing ? structuredClone(existing) : null;

  const input = productInput(req.body);
  if (!input.title) throw new HttpError(400, 'Title is required');
  if (!input.category || !(await categories().findOneBy({ slug: input.category }))) {
    throw new HttpError(400, 'Choose a valid category');
  }

  const product = products().merge(existing ?? products().create(), {
    ...input,
    slug: await uniqueSlug(products(), str(req.body.slug) || input.title, id),
  });
  const saved = await products().save(product);
  res.locals.audit = {
    id: saved.id,
    label: saved.title,
    meta: before
      ? { changed: changedFields({ ...productInput(before as never), slug: before.slug }, { ...input, slug: saved.slug }) }
      : {},
  };
  res.status(id ? 200 : 201).json({ status: true, data: saved });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const target = await products().findOne({ where: { id: idParam(req) }, select: ['id', 'title'] });
  res.locals.audit = { id: target?.id, label: target?.title };
  const result = await products().delete(idParam(req));
  if (!result.affected) throw new HttpError(404, 'Product not found');
  res.json({ status: true, message: 'Product deleted' });
};

// ---- design cases ----------------------------------------------------------

export const listCases = (admin: boolean) => async (req: Request, res: Response) => {
  const where: Record<string, unknown> = {};
  if (!admin) where.published = true;
  if (req.query.featured === 'true') where.featured = true;
  res.json({ status: true, data: await cases().find({ where, order }) });
};

export const getCase = (admin: boolean) => async (req: Request, res: Response) => {
  const item = await cases().findOneBy(byIdOrSlug(req.params.id));
  if (!item || (!admin && !item.published)) {
    throw new HttpError(404, 'Design case not found');
  }
  res.json({ status: true, data: item });
};

export const saveCase = async (req: Request, res: Response) => {
  const id = req.params.id ? idParam(req) : undefined;
  const existing = id ? await cases().findOneBy({ id }) : null;
  if (id && !existing) throw new HttpError(404, 'Design case not found');
  const before = existing ? structuredClone(existing) : null;

  const input = caseInput(req.body);
  if (!input.name) throw new HttpError(400, 'Name is required');

  const item = cases().merge(existing ?? cases().create(), {
    ...input,
    slug: await uniqueSlug(cases(), str(req.body.slug) || input.name, id),
  });
  const saved = await cases().save(item);
  res.locals.audit = {
    id: saved.id,
    label: saved.name,
    meta: before
      ? { changed: changedFields({ ...caseInput(before as never), slug: before.slug }, { ...input, slug: saved.slug }) }
      : {},
  };
  res.status(id ? 200 : 201).json({ status: true, data: saved });
};

export const deleteCase = async (req: Request, res: Response) => {
  const target = await cases().findOne({ where: { id: idParam(req) }, select: ['id', 'name'] });
  res.locals.audit = { id: target?.id, label: target?.name };
  const result = await cases().delete(idParam(req));
  if (!result.affected) throw new HttpError(404, 'Design case not found');
  res.json({ status: true, message: 'Design case deleted' });
};

/** Persists a drag-and-drop order: body = { ids: number[] }. */
export const reorder =
  (entity: typeof Product | typeof DesignCase | typeof Category) =>
  async (req: Request, res: Response) => {
    const ids: number[] = Array.isArray(req.body.ids) ? req.body.ids.map(Number) : [];
    const repo = AppDataSource.getRepository(entity);
    await AppDataSource.transaction(async (m) => {
      for (const [index, id] of ids.entries()) {
        await m.getRepository(entity).update(id, { sortOrder: index });
      }
    });
    res.json({ status: true, data: await repo.find({ order }) });
  };
