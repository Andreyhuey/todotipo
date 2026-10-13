import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import PageHero from '@/components/site/page-hero';
import CmsImage from '@/components/site/cms-image';
import { CtaBanner } from '@/components/home/sections';
import { getDesignCases, getSite } from '@/lib/cms';
import { buildMetadata } from '@/lib/seo';
import { routes } from '@/lib/routes';

export async function generateMetadata(): Promise<Metadata> {
  const { pages } = await getSite();
  return buildMetadata({
    title: 'Design cases',
    description: pages.designCases.subtitle,
    path: routes.designCase(),
  });
}

export default async function DesignCasesPage() {
  const [{ pages, home }, cases] = await Promise.all([getSite(), getDesignCases()]);

  return (
    <>
      <PageHero hero={pages.designCases} />

      <section className="section">
        <div className="container flex flex-col gap-24 md:gap-32">
          {cases.length === 0 && <p className="text-center text-stone-500">Projects are coming soon.</p>}
          {cases.map((c, i) => (
            <article key={c.id} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
              <Link
                href={routes.designCaseDetails(c.slug)}
                className={`group relative block aspect-[4/3] overflow-hidden rounded-[28px] lg:col-span-7 ${
                  i % 2 ? 'lg:order-2' : ''
                }`}
              >
                <CmsImage
                  src={c.coverImage}
                  alt={c.name}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-col gap-6 lg:col-span-5">
                <span className="font-display text-6xl font-light text-oak-300">{String(i + 1).padStart(2, '0')}</span>
                <div className="flex flex-wrap gap-2">
                  {c.tags.slice(0, 4).map((t) => (
                    <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-stone-600">
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="display-3">{c.name}</h2>
                <p className="lead">{c.overview}</p>
                <p className="line-clamp-3 leading-relaxed text-stone-500">{c.description}</p>
                <Link
                  href={routes.designCaseDetails(c.slug)}
                  className="group inline-flex w-fit items-center gap-2 border-b border-ink pb-1 font-medium text-ink"
                >
                  View project
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBanner cta={home.cta} />
    </>
  );
}
