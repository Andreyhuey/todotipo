import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import CmsImage from '@/components/site/cms-image';
import { Button } from '@/components/ui/button';
import { getDesignCase, getDesignCases } from '@/lib/cms';
import { buildMetadata } from '@/lib/seo';
import { routes } from '@/lib/routes';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getDesignCase(params.slug);
  if (!item) return {};
  return buildMetadata({
    title: item.name,
    description: item.overview || item.description.slice(0, 160),
    image: item.seoImage || item.coverImage,
    path: routes.designCaseDetails(item.slug),
  });
}

export default async function DesignCasePage({ params }: Props) {
  const [item, all] = await Promise.all([getDesignCase(params.slug), getDesignCases()]);
  if (!item) notFound();

  const index = all.findIndex((c) => c.id === item.id);
  const next = all.length > 1 ? all[(index + 1) % all.length] : null;
  const images = item.images.filter((src) => src !== item.coverImage);

  return (
    <>
      <section className="relative isolate flex min-h-[85svh] items-end overflow-hidden bg-forest-900 pb-16 pt-36">
        <CmsImage
          src={item.coverImage}
          alt={item.name}
          fill
          priority
          sizes="100vw"
          className="-z-10 animate-ken-burns object-cover"
          placeholderClassName="-z-10"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900 via-forest-900/40 to-forest-900/20" />
        <div className="container flex animate-fade-up flex-col gap-5">
          <Link href={routes.designCase()} className="eyebrow text-oak-200 hover:text-oak-100">
            Design cases
          </Link>
          <h1 className="display-1 max-w-4xl text-balance text-linen">{item.name}</h1>
          {item.overview && <p className="lead max-w-2xl text-linen/80">{item.overview}</p>}
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-14 lg:grid-cols-[1fr_360px] lg:gap-20">
          <div className="flex flex-col gap-10">
            <p className="font-display text-2xl font-light leading-relaxed text-ink md:text-[1.75rem]">
              {item.description}
            </p>
            {item.highlights.length > 0 && (
              <div className="flex flex-col gap-5">
                <h2 className="text-[11px] font-semibold uppercase tracking-eyebrow text-oak-600">Highlights</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {item.highlights.map((h) => (
                    <li key={h} className="flex gap-3 rounded-2xl bg-linen p-5 text-ink">
                      <Check className="mt-0.5 size-5 shrink-0 text-forest-500" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="flex flex-col divide-y divide-border self-start rounded-2xl border border-border">
            {item.location && <Meta label="Location">{item.location}</Meta>}
            {item.tags.length > 0 && (
              <Meta label="Setting">
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((t) => (
                    <span key={t} className="rounded-full bg-linen px-3 py-1 text-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </Meta>
            )}
            {item.audience.length > 0 && <Meta label="Ideal for">{item.audience.join(', ')}</Meta>}
            <div className="p-6">
              <Button asChild className="w-full">
                <Link href={routes.contactUs()}>Start a similar project</Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>

      {images.length > 0 && (
        <section className="pb-20 md:pb-28">
          <div className="container grid gap-4 md:grid-cols-2">
            {images.map((src, i) => (
              <div
                key={src}
                className={`relative overflow-hidden rounded-[24px] bg-linen-300 ${
                  i % 3 === 0 ? 'aspect-[16/9] md:col-span-2' : 'aspect-[4/3]'
                }`}
              >
                <CmsImage
                  src={src}
                  alt={`${item.name} — photo ${i + 1}`}
                  fill
                  sizes={i % 3 === 0 ? '100vw' : '50vw'}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {next && next.id !== item.id && (
        <Link
          href={routes.designCaseDetails(next.slug)}
          className="group relative isolate block overflow-hidden bg-forest-900 py-24 text-center md:py-32"
        >
          <CmsImage
            src={next.coverImage}
            alt=""
            fill
            sizes="100vw"
            className="-z-10 object-cover opacity-30 transition-all duration-700 group-hover:scale-105 group-hover:opacity-40"
            placeholderClassName="-z-10 opacity-0"
          />
          <span className="eyebrow justify-center text-oak-200">Next project</span>
          <span className="mt-4 flex items-center justify-center gap-4 font-display text-4xl font-light text-linen md:text-6xl">
            {next.name}
            <ArrowRight className="size-8 transition-transform group-hover:translate-x-2" strokeWidth={1.25} />
          </span>
        </Link>
      )}
    </>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 p-6">
      <span className="text-xs uppercase tracking-wider text-stone-500">{label}</span>
      <div className="text-ink">{children}</div>
    </div>
  );
}
