/**
 * One-off content fix for data already imported into the CMS.
 *
 *   npm run fix:content                # apply
 *   npm run fix:content -- --dry-run   # report only, no writes
 *
 * Re-syncs the copy that was corrected in ./legacy (the Metal, Stone and Wood
 * Grain wall panel descriptions and specs, and the design case overviews,
 * descriptions and tags) and removes "cladding" from stored settings text,
 * since there is no cladding category. Images, featured flags and every other
 * field are left as they are, so admin edits elsewhere are kept.
 */
import 'reflect-metadata';
import { AppDataSource, connectDatabase, disconnectDatabase } from '../config/database';
import { Product } from '../entity/Product';
import { DesignCase } from '../entity/DesignCase';
import { Setting } from '../entity/Setting';
import { toSlug } from '../helpers/http';
import { products as legacyProducts } from './legacy/product.data';
import { designCases as legacyCases } from './legacy/design-case.data';
import { rebrand, TITLE_RENAMES } from './legacy/rebrand';

const DRY_RUN = process.argv.includes('--dry-run');

const PRODUCTS = ['Metal Series wall panel', 'Stone Series Wall Panel', 'Wood Grain Series Wall Panel'];

const SETTINGS_REPLACEMENTS: [string, string][] = [
  ['decking, cladding, wall panels and doors', 'decking, wall panels, doors and fencing'],
  ['wall panels, cladding, doors and fencing', 'wall panels, doors and fencing'],
  ['composite cladding', 'composite wall panels'],
  ['innovative cladding', 'innovative wall panels'],
];

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

const main = async () => {
  console.log(`🛠  Fixing content${DRY_RUN ? '  (dry run)' : ''}`);
  await connectDatabase();

  // 1. Wall panel copy and specs.
  const productRepo = AppDataSource.getRepository(Product);
  for (const legacy of legacyProducts.filter((p) => PRODUCTS.includes(p.title))) {
    const slug = toSlug(TITLE_RENAMES[legacy.title] ?? rebrand(legacy.title));
    const product = await productRepo.findOneBy({ slug });
    if (!product) {
      console.warn(`⚠️  Product not found: ${slug}`);
      continue;
    }
    const description = (legacy.desc ?? []).map(rebrand);
    const specsByTitle = new Map(
      (legacy.case ?? []).map((c) => [`${rebrand(c.name)} — specifications`, c.specification ?? []])
    );
    const blocks = product.blocks.map((b) =>
      b.type === 'specs' && b.title && specsByTitle.has(b.title) ? { ...b, specs: specsByTitle.get(b.title) } : b
    );
    const next = {
      description,
      summary: (description[0] ?? '').split(/(?<=\.)\s/)[0].slice(0, 280),
      blocks,
    };
    const changed = (Object.keys(next) as (keyof typeof next)[]).filter((k) => !same(product[k], next[k]));
    console.log(`📦 ${product.title}: ${changed.length ? changed.join(', ') : 'already up to date'}`);
    if (changed.length && !DRY_RUN) await productRepo.save(productRepo.merge(product, next));
  }

  // 2. Design case copy and tags.
  const caseRepo = AppDataSource.getRepository(DesignCase);
  for (const legacy of legacyCases) {
    const item = await caseRepo.findOneBy({ slug: toSlug(legacy.name) });
    if (!item) {
      console.warn(`⚠️  Design case not found: ${legacy.name}`);
      continue;
    }
    const next = {
      overview: rebrand(legacy.overview.trim()),
      description: rebrand(legacy.description),
      tags: legacy.settings.map((s) => s.trim()),
    };
    const changed = (Object.keys(next) as (keyof typeof next)[]).filter((k) => !same(item[k], next[k]));
    console.log(`🏡 ${item.name}: ${changed.length ? changed.join(', ') : 'already up to date'}`);
    if (changed.length && !DRY_RUN) await caseRepo.save(caseRepo.merge(item, next));
  }

  // 3. Stored settings text (defaults are already fixed in SettingsService).
  const settingRepo = AppDataSource.getRepository(Setting);
  for (const row of await settingRepo.find()) {
    let json = JSON.stringify(row.value);
    for (const [from, to] of SETTINGS_REPLACEMENTS) json = json.split(from).join(to);
    const value = JSON.parse(json);
    const dirty = !same(row.value, value);
    console.log(`⚙️  settings.${row.key}: ${dirty ? 'cladding removed' : 'already up to date'}`);
    if (dirty && !DRY_RUN) await settingRepo.save({ ...row, value });
  }

  console.log(DRY_RUN ? '✅ Dry run complete, nothing written' : '✅ Content fixed');
};

main()
  .catch((err) => {
    console.error('\n❌', err);
    process.exitCode = 1;
  })
  .finally(disconnectDatabase);
