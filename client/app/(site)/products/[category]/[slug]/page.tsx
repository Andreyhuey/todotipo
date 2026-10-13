import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, MessageCircle } from 'lucide-react';
import ProductGallery from '@/components/products/product-gallery';
import ContentBlocks, { SpecTable } from '@/components/products/content-blocks';
import QuoteDialog from '@/components/products/quote-dialog';
import ProductCard from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { getProduct, getProducts, getSite } from '@/lib/cms';
import { buildMetadata } from '@/lib/seo';
import { routes } from '@/lib/routes';
import { baseUrl } from '@/constants/config';
import { serializeJsonLd } from '@/lib/utils';

interface Props {
  params: { category: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};
  return buildMetadata({
    title: product.title,
    description: product.summary || product.description[0]?.slice(0, 160),
    image: product.seoImage || product.image || product.gallery[0],
    path: routes.productDetails(product.category, product.slug),
  });
}

export default async function ProductPage({ params }: Props) {
  const [product, { categories, site }, all] = await Promise.all([
    getProduct(params.slug),
    getSite(),
    getProducts(),
  ]);
  if (!product) notFound();
  if (params.category !== product.category) {
    redirect(routes.productDetails(product.category, product.slug));
  }

  const category = categories.find((c) => c.slug === product.category);
  const siblings = all.filter((p) => p.category === product.category);
  const index = siblings.findIndex((p) => p.id === product.id);
  const prev = index > 0 ? siblings[index - 1] : null;
  const next = index < siblings.length - 1 ? siblings[index + 1] : null;
  const related = siblings.filter((p) => p.id !== product.id).slice(0, 3);
  const gallery = product.gallery.length ? product.gallery : [product.image].filter(Boolean);
  const meta = [
    { name: 'Brand', value: product.brand },
    { name: 'Model', value: product.model },
    { name: 'Code', value: product.code },
  ].filter((m) => m.value);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.summary || product.description[0],
    image: gallery,
    brand: { '@type': 'Brand', name: product.brand || site.name },
    sku: product.model || undefined,
    category: category?.name,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />

      {/* Spacer behind the fixed navbar (dark so the transparent nav reads) */}
      <div className="h-[76px] bg-forest-900" />

      <div className="container pt-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
          <Link href={routes.products()} className="hover:text-ink">
            Products
          </Link>
          <span>/</span>
          {category && (
            <>
              <Link href={routes.productCategory(category.slug)} className="hover:text-ink">
                {category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-ink">{product.title}</span>
        </nav>
      </div>

      <section className="container grid gap-10 pb-20 pt-8 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <ProductGallery images={gallery} title={product.title} />

        <div className="flex flex-col gap-7 lg:sticky lg:top-28 lg:self-start">
          {category && <span className="eyebrow">{category.name}</span>}
          <h1 className="display-2 text-balance">{product.title}</h1>
          {product.summary && <p className="lead">{product.summary}</p>}

          {meta.length > 0 && (
            <dl className="grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-white">
              {meta.map((m) => (
                <div key={m.name} className="px-4 py-4">
                  <dt className="text-xs uppercase tracking-wider text-stone-500">{m.name}</dt>
                  <dd className="mt-1 truncate font-medium text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <ul className="flex flex-col gap-2.5 text-[15px] text-stone-600">
            {['Free, no-obligation quotes', 'Samples available on request', 'Expert installation guidance'].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <Check className="size-4 text-forest-500" /> {t}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row">
            <QuoteDialog
              productName={product.title}
              link={`${baseUrl}${routes.productDetails(product.category, product.slug)}`}
            />
            <Button asChild size="lg" variant="outline">
              <Link href={routes.contactUs()}>
                <MessageCircle /> Ask a question
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="border-t border-border bg-white">
        <div className="container grid gap-16 py-20 lg:grid-cols-[1fr_340px]">
          <div className="flex min-w-0 flex-col gap-16">
            {product.description.length > 0 && (
              <section className="flex flex-col gap-6">
                <h2 className="display-3">Overview</h2>
                <div className="prose-oaken max-w-3xl text-[17px]">
                  {product.description.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            )}

            {product.video && (
              <video
                controls
                preload="metadata"
                className="aspect-video w-full rounded-2xl bg-ink"
                src={product.video}
                poster={gallery[0]}
              />
            )}

            <ContentBlocks blocks={product.blocks} productTitle={product.title} />
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            {product.specifications.length > 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="font-display text-2xl font-light">Specifications</h2>
                <SpecTable specs={product.specifications} />
              </div>
            )}
            <div className="flex flex-col gap-4 rounded-2xl bg-forest-800 p-6 text-linen">
              <p className="font-display text-xl font-light">Planning a project with {product.title}?</p>
              <p className="text-sm text-linen/70">
                Share your dimensions and we&apos;ll recommend quantities, finishes and accessories.
              </p>
              <QuoteDialog
                productName={product.title}
                link={`${baseUrl}${routes.productDetails(product.category, product.slug)}`}
                trigger={<Button variant="oak">Get a quote</Button>}
              />
            </div>
          </aside>
        </div>
      </div>

      {(prev || next) && (
        <nav className="border-y border-border" aria-label="More products">
          <div className="container grid sm:grid-cols-2">
            {prev ? (
              <Link href={routes.productDetails(prev.category, prev.slug)} className="group flex flex-col gap-1 py-8 sm:pr-8">
                <span className="flex items-center gap-2 text-sm text-stone-500">
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /> Previous
                </span>
                <span className="font-display text-xl">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={routes.productDetails(next.category, next.slug)}
                className="group flex flex-col items-end gap-1 border-t border-border py-8 text-right sm:border-l sm:border-t-0 sm:pl-8"
              >
                <span className="flex items-center gap-2 text-sm text-stone-500">
                  Next <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="font-display text-xl">{next.title}</span>
              </Link>
            )}
          </div>
        </nav>
      )}

      {related.length > 0 && (
        <section className="section bg-linen">
          <div className="container flex flex-col gap-12">
            <h2 className="display-3">More from {category?.name ?? 'this collection'}</h2>
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
