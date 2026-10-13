import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/site/page-hero';
import ProductCard from '@/components/products/product-card';
import { getProducts, getSite } from '@/lib/cms';
import { buildMetadata } from '@/lib/seo';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';

interface Props {
  searchParams: { category?: string };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { categories, pages } = await getSite();
  const category = categories.find((c) => c.slug === searchParams.category);
  return buildMetadata({
    title: category ? category.name : 'Products',
    description: category?.description || pages.products.subtitle,
    path: category ? routes.productCategory(category.slug) : routes.products(),
  });
}

export default async function ProductsPage({ searchParams }: Props) {
  const [{ categories, pages }, products] = await Promise.all([getSite(), getProducts()]);
  const active = categories.find((c) => c.slug === searchParams.category);
  const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

  const groups = (active ? [active] : categories)
    .map((c) => ({ category: c, items: products.filter((p) => p.category === c.slug) }))
    .filter((g) => g.items.length);

  return (
    <>
      <PageHero
        hero={
          active
            ? { ...pages.products, title: active.name, subtitle: active.description || pages.products.subtitle, image: active.image || pages.products.image }
            : pages.products
        }
      />

      {/* Category filter */}
      <div className="sticky top-[76px] z-30 border-b border-border bg-background/90 backdrop-blur-xl">
        <nav className="container no-scrollbar flex gap-2 overflow-x-auto py-4" aria-label="Product categories">
          <FilterPill href={routes.products()} active={!active}>
            All products
          </FilterPill>
          {categories.map((c) => (
            <FilterPill key={c.id} href={routes.productCategory(c.slug)} active={active?.slug === c.slug}>
              {c.name}
            </FilterPill>
          ))}
        </nav>
      </div>

      <div className="section container flex flex-col gap-24 !pt-14">
        {groups.length === 0 && (
          <p className="py-20 text-center text-stone-500">No products in this category yet.</p>
        )}
        {groups.map(({ category, items }) => (
          <section key={category.id} id={category.slug} className="flex scroll-mt-40 flex-col gap-10">
            {!active && (
              <div className="flex items-end justify-between gap-6 border-b border-border pb-6">
                <div>
                  <h2 className="display-3">{category.name}</h2>
                  {category.description && <p className="mt-2 max-w-2xl text-stone-500">{category.description}</p>}
                </div>
                <Link
                  href={routes.productCategory(category.slug)}
                  className="hidden shrink-0 text-sm font-medium text-oak-700 hover:underline sm:block"
                >
                  View {items.length} →
                </Link>
              </div>
            )}
            <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} categoryName={active ? undefined : categoryNames[p.category]} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

function FilterPill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        'shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors',
        active ? 'border-ink bg-ink text-linen' : 'border-border text-stone-600 hover:border-ink hover:text-ink'
      )}
    >
      {children}
    </Link>
  );
}
