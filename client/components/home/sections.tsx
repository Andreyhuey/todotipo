import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CmsImage from '@/components/site/cms-image';
import Icon from '@/components/site/icon';
import SectionHeading from '@/components/site/section-heading';
import ProductCard from '@/components/products/product-card';
import { routes } from '@/lib/routes';
import type { Category, DesignCase, HomeSettings, Product } from '@/types/cms';

export function Stats({ stats }: { stats: HomeSettings['stats'] }) {
  if (!stats.length) return null;
  return (
    <section className="border-b border-border bg-linen">
      <div className="container grid grid-cols-2 gap-y-8 py-10 lg:grid-cols-4 lg:divide-x lg:divide-border">
        {stats.map((s, i) => (
          <div key={`${s.label}-${i}`} className="flex flex-col gap-1 lg:px-8 lg:first:pl-0">
            <span className="font-display text-4xl font-light text-ink md:text-5xl">{s.value}</span>
            <span className="text-sm text-stone-500">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Intro({ intro }: { intro: HomeSettings['intro'] }) {
  return (
    <section className="section bg-linen">
      <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] lg:order-2">
          <CmsImage src={intro.image} alt={intro.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col gap-6">
          {intro.eyebrow && <span className="eyebrow">{intro.eyebrow}</span>}
          <h2 className="display-2 text-balance">{intro.title}</h2>
          <p className="lead">{intro.body}</p>
          <div className="pt-2">
            <Button asChild variant="outline" size="lg">
              <Link href={routes.aboutUs()}>
                Our story <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CategoryShowcase({
  categories,
  counts,
}: {
  categories: Category[];
  counts: Record<string, number>;
}) {
  if (!categories.length) return null;
  return (
    <section className="section">
      <div className="container flex flex-col gap-14">
        <SectionHeading
          eyebrow="The collection"
          title="Materials for every surface"
          subtitle="From gap-free decking to sculptural wall panels — engineered composites designed to outlast timber."
          action={
            <Button asChild variant="outline">
              <Link href={routes.products()}>
                View all products <ArrowRight />
              </Link>
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              href={routes.productCategory(c.slug)}
              className={`group relative isolate flex min-h-[320px] flex-col justify-end overflow-hidden rounded-[24px] p-6 md:min-h-[400px] ${
                // 3 wide + 2 wider rows on desktop for a curated rhythm
                i % 5 < 3 ? 'lg:col-span-2' : 'lg:col-span-3'
              }`}
            >
              <CmsImage
                src={c.image}
                alt={c.name}
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
                className="-z-10 object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                placeholderClassName="-z-10"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-linen/70">
                    {counts[c.slug] ?? 0} product{counts[c.slug] === 1 ? '' : 's'}
                  </p>
                  <h3 className="font-display text-3xl font-light text-linen">{c.name}</h3>
                </div>
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-linen/40 text-linen transition-all duration-500 group-hover:border-linen group-hover:bg-linen group-hover:text-ink">
                  <ArrowUpRight className="size-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedProducts({
  products,
  categoryNames,
}: {
  products: Product[];
  categoryNames: Record<string, string>;
}) {
  if (!products.length) return null;
  return (
    <section className="section bg-linen">
      <div className="container flex flex-col gap-14">
        <SectionHeading
          eyebrow="Featured"
          title="Best-loved by builders and designers"
        />
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} categoryName={categoryNames[p.category]} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyUs({ whyUs }: { whyUs: HomeSettings['whyUs'] }) {
  if (!whyUs.items.length) return null;
  return (
    <section className="section relative overflow-hidden bg-forest-800 text-linen">
      <div className="container flex flex-col gap-16">
        <SectionHeading eyebrow="Why choose us" title={whyUs.title} subtitle={whyUs.subtitle} tone="light" />
        <div className="grid gap-px overflow-hidden rounded-[24px] bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.items.map((item, i) => (
            <div key={`${item.title}-${i}`} className="flex flex-col gap-5 bg-forest-800 p-8 md:p-10">
              <span className="grid size-14 place-items-center rounded-2xl bg-white/5 text-oak-300">
                <Icon name={item.icon} className="size-7" />
              </span>
              <h3 className="font-display text-2xl font-light text-linen">{item.title}</h3>
              <p className="leading-relaxed text-linen/65">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedCases({ cases }: { cases: DesignCase[] }) {
  if (!cases.length) return null;
  const [lead, ...rest] = cases;
  return (
    <section className="section">
      <div className="container flex flex-col gap-14">
        <SectionHeading
          eyebrow="Design cases"
          title="Spaces transformed by our materials"
          action={
            <Button asChild variant="outline">
              <Link href={routes.designCase()}>
                All projects <ArrowRight />
              </Link>
            </Button>
          }
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <CaseTile item={lead} large />
          <div className="grid gap-6 sm:grid-cols-2">
            {rest.slice(0, 4).map((c) => (
              <CaseTile key={c.id} item={c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CaseTile({ item, large }: { item: DesignCase; large?: boolean }) {
  return (
    <Link
      href={routes.designCaseDetails(item.slug)}
      className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-[24px] p-6 ${
        large ? 'min-h-[420px] lg:min-h-full lg:p-10' : 'min-h-[260px]'
      }`}
    >
      <CmsImage
        src={item.coverImage}
        alt={item.name}
        fill
        sizes={large ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'}
        className="-z-10 object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
        placeholderClassName="-z-10"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
      <div className="flex flex-wrap gap-2 pb-3">
        {item.tags.slice(0, large ? 3 : 2).map((t) => (
          <span key={t} className="rounded-full bg-white/15 px-3 py-1 text-xs text-linen backdrop-blur">
            {t}
          </span>
        ))}
      </div>
      <h3 className={`font-display font-light text-linen ${large ? 'text-4xl' : 'text-2xl'}`}>{item.name}</h3>
      {large && item.overview && <p className="mt-2 max-w-md text-linen/75">{item.overview}</p>}
    </Link>
  );
}

export function Testimonials({ items }: { items: HomeSettings['testimonials'] }) {
  const list = items.filter((t) => t.quote);
  if (!list.length) return null;
  return (
    <section className="section bg-linen">
      <div className="container flex flex-col gap-14">
        <SectionHeading eyebrow="Testimonials" title="What our clients say" align="center" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((t, i) => (
            <figure key={i} className="flex flex-col gap-6 rounded-[24px] bg-white p-8 shadow-xs">
              <Quote className="size-8 text-oak-400" strokeWidth={1.25} />
              <blockquote className="font-display text-xl font-light leading-relaxed text-ink">
                {t.quote}
              </blockquote>
              <figcaption className="mt-auto text-sm">
                <span className="font-medium text-ink">{t.author}</span>
                {t.role && <span className="text-stone-500"> · {t.role}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBanner({ cta }: { cta: HomeSettings['cta'] }) {
  return (
    <section className="section">
      <div className="container">
        <div className="relative isolate overflow-hidden rounded-[32px] bg-forest-800 px-6 py-20 text-center md:px-16 md:py-28">
          <CmsImage
            src={cta.image}
            alt=""
            fill
            sizes="100vw"
            className="-z-10 object-cover opacity-40"
            placeholderClassName="-z-10 opacity-0"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-900/40 to-forest-900/80" />
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
            <h2 className="display-2 text-balance text-linen">{cta.title}</h2>
            <p className="lead text-linen/75">{cta.body}</p>
            <Button asChild size="lg" variant="oak" className="mt-2">
              <Link href={routes.contactUs()}>
                {cta.buttonLabel || 'Get in touch'} <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
