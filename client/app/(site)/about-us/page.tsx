import type { Metadata } from 'next';
import PageHero from '@/components/site/page-hero';
import CmsImage from '@/components/site/cms-image';
import Icon from '@/components/site/icon';
import SectionHeading from '@/components/site/section-heading';
import { CtaBanner } from '@/components/home/sections';
import { getSite } from '@/lib/cms';
import { buildMetadata } from '@/lib/seo';
import { routes } from '@/lib/routes';

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await getSite();
  return buildMetadata({
    title: 'About us',
    description: about.hero.subtitle,
    image: about.hero.image,
    path: routes.aboutUs(),
  });
}

export default async function AboutPage() {
  const { about, home } = await getSite();

  return (
    <>
      <PageHero hero={about.hero} />

      {/* Intro */}
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="eyebrow">Who we are</span>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-7">
            {about.intro.map((p, i) => (
              <p
                key={i}
                className={i === 0 ? 'font-display text-2xl font-light leading-relaxed text-ink md:text-3xl' : 'lead'}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="pb-20 md:pb-28">
        <div className="container grid gap-4 md:grid-cols-2">
          {[
            { title: 'Our mission', body: about.mission },
            { title: 'Our vision', body: about.vision },
          ].map((b, i) => (
            <div
              key={b.title}
              className={`flex flex-col gap-5 rounded-[28px] p-8 md:p-12 ${
                i === 0 ? 'bg-forest-800 text-linen' : 'bg-oak-100 text-ink'
              }`}
            >
              <span className={`text-[11px] font-semibold uppercase tracking-eyebrow ${i === 0 ? 'text-oak-300' : 'text-oak-700'}`}>
                {b.title}
              </span>
              <p className="font-display text-2xl font-light leading-snug md:text-[1.9rem]">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="section bg-linen">
        <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px]">
            <CmsImage src={about.story.image} alt={about.story.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col gap-6">
            <span className="eyebrow">Since day one</span>
            <h2 className="display-2">{about.story.title}</h2>
            {about.story.paragraphs.map((p, i) => (
              <p key={i} className="lead">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      {about.values.length > 0 && (
        <section className="section">
          <div className="container flex flex-col gap-14">
            <SectionHeading eyebrow="What we stand for" title="Our core values" align="center" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {about.values.map((v, i) => (
                <div key={`${v.title}-${i}`} className="group relative isolate flex min-h-[340px] flex-col justify-end overflow-hidden rounded-[24px] p-7">
                  <CmsImage
                    src={v.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
                    placeholderClassName="-z-10"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/10" />
                  <span className="mb-auto grid size-12 place-items-center rounded-2xl bg-white/15 text-linen backdrop-blur">
                    <Icon name={v.icon} className="size-6" />
                  </span>
                  <h3 className="font-display text-2xl font-light text-linen">{v.title}</h3>
                  <p className="mt-2 text-linen/75">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sustainability */}
      <section className="section bg-forest-800 text-linen">
        <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-6">
            <span className="eyebrow text-oak-300">Sustainability</span>
            <h2 className="display-2 text-linen">{about.sustainability.title}</h2>
            <p className="lead text-linen/70">{about.sustainability.body}</p>
            <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10">
              {about.sustainability.items.map((s, i) => (
                <div key={i} className="bg-forest-800 p-6">
                  <dt className="font-display text-3xl font-light text-oak-200">{s.value}</dt>
                  <dd className="mt-1 text-sm text-linen/65">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px]">
            <CmsImage
              src={about.sustainability.image}
              alt={about.sustainability.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              placeholderClassName="opacity-20"
            />
          </div>
        </div>
      </section>

      <CtaBanner cta={home.cta} />
    </>
  );
}
