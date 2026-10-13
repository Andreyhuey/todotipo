/**
 * One-off migration of the old static site into the CMS.
 *
 *   npm run import:legacy                # uses ../legacy-assets
 *   npm run import:legacy -- --dry-run   # report only, no uploads or writes
 *
 * Every image referenced by the legacy data is uploaded through FileService
 * (so it lands on the storage server and in the media library), then the
 * categories, products, design cases and page imagery are created from it.
 * Safe to re-run: uploaded files are matched by their legacy path, records
 * are upserted by slug, and settings fields that already hold a value are
 * left alone.
 */
import 'reflect-metadata';
import fs from 'fs';
import path from 'path';
import { AppDataSource, connectDatabase, disconnectDatabase } from '../config/database';
import { Media } from '../entity/Media';
import { Category } from '../entity/Category';
import { ContentBlock, Product } from '../entity/Product';
import { DesignCase } from '../entity/DesignCase';
import { FileService } from '../services/FileService';
import { SettingsService } from '../services/SettingsService';
import { toSlug } from '../helpers/http';
import { LogService } from '../services/LogService';
import { products as legacyProducts, productCategory } from './legacy/product.data';
import { designCases as legacyCases } from './legacy/design-case.data';
import { rebrand, TITLE_RENAMES } from './legacy/rebrand';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const assetsArg = args.indexOf('--assets');
const ASSETS_DIR = path.resolve(
  assetsArg >= 0 ? args[assetsArg + 1] : path.join(__dirname, '../../../legacy-assets')
);

const MIME: Record<string, string> = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
};

/** Renamed categories (typo fixes) — old slug -> new name. */
const CATEGORY_RENAMES: Record<string, string> = {
  'flutted-wall-panel': 'Fluted Wall Panels',
  'composite-doors': 'Composite Doors',
};

/**
 * Page imagery from the old site constants, keyed by settings path.
 * Note: about-image.svg is deliberately excluded — it shows the old Todotipo
 * signage.
 */
const SETTINGS_IMAGES: Record<string, string> = {
  'home.intro.image': '/assets/backyard1.svg',
  'home.cta.image': '/assets/backyard.svg',
  'about.hero.image': '/assets/homespace1.svg',
  'about.story.image': '/assets/workspace.svg',
  'about.sustainability.image': '/assets/person-working-wood.svg',
  'about.values.0.image': '/assets/sustainability.svg',
  'about.values.1.image': '/assets/view-board.svg',
  'about.values.2.image': '/assets/innovation.svg',
  'about.values.3.image': '/assets/jigsaw.svg',
  'about.values.4.image': '/assets/young-people.svg',
  'about.values.5.image': '/assets/customer-focus.svg',
  'pages.products.image': '/assets/productsbg.svg',
  'pages.designCases.image': '/assets/prestigious-residence.svg',
  'pages.contact.image': '/assets/green-haven.svg',
};
const HERO_SLIDES = [
  { path: '/assets/hero2.png', caption: 'HD Printing Wall Panel' },
  { path: '/assets/hero3.jpg', caption: 'WPC Wall Panels' },
  { path: '/assets/hero5.png', caption: 'Doors · Walls · Cabinets' },
  { path: '/assets/hero4.jpg', caption: 'SPC Background Wall' },
];

// ---- helpers ----------------------------------------------------------------

const arr = (v: string | string[] | undefined) => (v ? (Array.isArray(v) ? v : [v]) : []);

const folderFor = (p: string) => {
  if (/^\/assets\/(hero|about|person|productsbg|sustainab|view-board|innovation|jigsaw|young|customer)/.test(p)) {
    return 'pages';
  }
  return 'catalog';
};

/** Collects every /assets/... string anywhere inside a value. */
const collectPaths = (value: unknown, out: Set<string>) => {
  if (typeof value === 'string') {
    if (value.startsWith('/assets/') && path.extname(value)) out.add(value);
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectPaths(v, out));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach((v) => collectPaths(v, out));
  }
};

const setAtPath = (obj: Record<string, any>, dotted: string, value: unknown) => {
  const keys = dotted.split('.');
  let cur = obj;
  for (const k of keys.slice(0, -1)) cur = cur[k];
  const last = keys[keys.length - 1];
  if (!cur[last]) cur[last] = value; // never overwrite admin edits
};

// ---- main -------------------------------------------------------------------

const main = async () => {
  if (!fs.existsSync(ASSETS_DIR)) throw new Error(`Assets folder not found: ${ASSETS_DIR}`);
  console.log(`📁 Assets: ${ASSETS_DIR}${DRY_RUN ? '  (dry run)' : ''}`);

  await connectDatabase();
  const mediaRepo = AppDataSource.getRepository(Media);
  const files = new FileService();

  // 1. Upload every referenced asset once.
  const paths = new Set<string>();
  collectPaths(legacyProducts, paths);
  collectPaths(legacyCases, paths);
  Object.values(SETTINGS_IMAGES).forEach((p) => paths.add(p));
  HERO_SLIDES.forEach((s) => paths.add(s.path));

  const urlFor = new Map<string, string>();
  for (const m of await mediaRepo.find()) if (m.legacyPath) urlFor.set(m.legacyPath, m.url);

  const pending = [...paths].filter((p) => {
    if (urlFor.has(p)) return false;
    if (!fs.existsSync(path.join(ASSETS_DIR, path.basename(p)))) {
      console.warn(`⚠️  Missing asset, skipped: ${p}`);
      return false;
    }
    return true;
  });
  console.log(`🖼  ${paths.size} assets referenced, ${pending.length} to upload`);

  if (!DRY_RUN) {
    let done = 0;
    for (const p of pending) {
      const local = path.join(ASSETS_DIR, path.basename(p));
      const ext = path.extname(p).toLowerCase();
      const [stored] = await files.saveFiles(
        [{ buffer: fs.readFileSync(local), originalName: path.basename(p), mimeType: MIME[ext] || 'application/octet-stream' }],
        folderFor(p)
      );
      await mediaRepo.save(
        mediaRepo.create({
          ...stored,
          originalName: path.basename(p),
          alt: path.basename(p, ext).replace(/[-_]+/g, ' '),
          folder: folderFor(p),
          legacyPath: p,
        })
      );
      urlFor.set(p, stored.url);
      done++;
      process.stdout.write(`\r   uploaded ${done}/${pending.length}`);
    }
    if (pending.length) process.stdout.write('\n');
  }

  const url = (p?: string) => (p ? urlFor.get(p) ?? '' : '');
  const urls = (v: string | string[] | undefined) => arr(v).map(url).filter(Boolean);

  // 2. Categories.
  const catRepo = AppDataSource.getRepository(Category);
  for (const [i, c] of productCategory.entries()) {
    const name = CATEGORY_RENAMES[c.value] ?? c.name;
    const slug = toSlug(rebrand(c.value));
    const first = legacyProducts.find((p) => p.category === c.value);
    const existing = await catRepo.findOneBy({ slug });
    if (!DRY_RUN) {
      await catRepo.save(
        catRepo.merge(existing ?? catRepo.create(), {
          name,
          slug,
          sortOrder: i,
          image: existing?.image || url(first?.image) || null,
        })
      );
    }
  }
  console.log(`🗂  ${productCategory.length} categories`);

  // 3. Products.
  const productRepo = AppDataSource.getRepository(Product);
  for (const [i, p] of legacyProducts.entries()) {
    const blocks: ContentBlock[] = [];
    const gallery = (title: string, imgs: string | string[] | undefined) => {
      const items = urls(imgs).map((image) => ({ image }));
      if (items.length) blocks.push({ type: 'gallery', title, items });
    };
    const swatches = (
      type: 'swatches' | 'features',
      title: string,
      list: { name: string; image: string | string[] }[] | undefined,
      columns: number
    ) => {
      const items = (list ?? [])
        .map((x) => ({ name: rebrand(x.name), image: url(arr(x.image)[0]) }))
        .filter((x) => x.image);
      if (items.length) blocks.push({ type, title, columns, items });
    };

    swatches('features', 'Key features', p.addOns, 4);
    gallery('', p.descImages);
    for (const c of p.case ?? []) {
      gallery(rebrand(c.name), c.image);
      if (c.specification?.length) {
        blocks.push({ type: 'specs', title: `${rebrand(c.name)} — specifications`, specs: c.specification });
      }
    }
    for (const plate of p.plate ?? []) gallery(rebrand(plate.name), plate.image);
    for (const color of p.color ?? []) gallery(rebrand(color.name), color.image);
    swatches('swatches', 'Optional colours', p.optionalColors, 3);
    swatches('swatches', 'Surface treatment', p.surfaceTreatment, 2);
    swatches('swatches', 'Product performance', p.productPerformance, 3);
    for (const col of p.collection ?? []) {
      gallery(rebrand(col.name), col.image);
      const styleItems = urls(col.styles.image).map((image) => ({ image }));
      if (styleItems.length) {
        blocks.push({ type: 'swatches', title: rebrand(col.styles.name), columns: 3, items: styleItems });
      }
      for (const d of col.details ?? []) swatches('swatches', rebrand(d.name), d.types, 3);
    }
    gallery('Design sketches', p.designSketches);

    const title = TITLE_RENAMES[p.title] ?? rebrand(p.title);
    const slug = toSlug(title);
    const description = (p.desc ?? []).map(rebrand);
    const existing = await productRepo.findOneBy({ slug });

    if (!DRY_RUN) {
      await productRepo.save(
        productRepo.merge(existing ?? productRepo.create(), {
          title,
          slug,
          category: toSlug(rebrand(p.category)),
          summary: (description[0] ?? '').split(/(?<=\.)\s/)[0].slice(0, 280),
          brand: 'Oaken',
          model: p.model,
          code: p.code,
          image: url(p.image),
          seoImage: url(p.seoImage),
          gallery: urls(p.heroImage),
          description,
          video: url(p.video),
          specifications: (p.specification ?? []).map((s) => ({ name: s.name, value: rebrand(s.value) })),
          blocks,
          featured: existing?.featured ?? i % 3 === 0,
          published: existing?.published ?? true,
          sortOrder: i,
        })
      );
    }
    console.log(`📦 ${title} (${blocks.length} content blocks)`);
  }

  // 4. Design cases.
  const caseRepo = AppDataSource.getRepository(DesignCase);
  for (const [i, c] of legacyCases.entries()) {
    const slug = toSlug(c.name);
    const images = urls(c.image);
    const existing = await caseRepo.findOneBy({ slug });
    if (!DRY_RUN) {
      await caseRepo.save(
        caseRepo.merge(existing ?? caseRepo.create(), {
          name: c.name,
          slug,
          overview: rebrand(c.overview.trim()),
          description: rebrand(c.description),
          tags: c.settings.map((s) => s.trim()),
          highlights: c.highlights.map(rebrand),
          audience: c.audience,
          coverImage: images[0] ?? '',
          images,
          seoImage: url(c.seoImage),
          featured: existing?.featured ?? i < 4,
          published: existing?.published ?? true,
          sortOrder: i,
        })
      );
    }
  }
  console.log(`🏡 ${legacyCases.length} design cases`);

  // 5. Page imagery (only fills empty fields).
  if (!DRY_RUN) {
    const all = (await SettingsService.getAll()) as Record<string, any>;
    for (const [dotted, p] of Object.entries(SETTINGS_IMAGES)) setAtPath(all, dotted, url(p));
    if (!all.home.hero.slides?.length) {
      all.home.hero.slides = HERO_SLIDES.map((s) => ({ image: url(s.path), caption: s.caption })).filter(
        (s) => s.image
      );
    }
    for (const key of ['home', 'about', 'pages'] as const) await SettingsService.set(key, all[key]);
  }
  console.log('⚙️  Page imagery and hero slides set');
  if (!DRY_RUN) {
    LogService.system('import.completed', `Legacy content import completed (${pending.length} files uploaded)`, 'info', {
      products: legacyProducts.length,
      designCases: legacyCases.length,
    });
    await new Promise((r) => setTimeout(r, 500)); // let the log write flush
  }
  console.log('✅ Import complete');
};

main()
  .catch((err) => {
    console.error('\n❌', err);
    process.exitCode = 1;
  })
  .finally(disconnectDatabase);
