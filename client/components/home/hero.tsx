'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CmsImage from '@/components/site/cms-image';
import { cn } from '@/lib/utils';
import type { HomeSettings } from '@/types/cms';

const SLIDE_MS = 6500;

export default function Hero({ hero }: { hero: HomeSettings['hero'] }) {
  const slides = hero.slides.filter((s) => s.image);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [active, slides.length]);

  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-forest-900 pb-14 pt-32 md:pb-20">
      {/* Slides */}
      <div className="absolute inset-0 -z-10">
        {slides.length === 0 && (
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_20%,#3B6046_0%,#14221A_70%)]" />
        )}
        {slides.map((s, i) => (
          <div
            key={s.image}
            className={cn(
              'absolute inset-0 transition-opacity duration-[1400ms] ease-out',
              i === active ? 'opacity-100' : 'opacity-0'
            )}
          >
            <CmsImage
              src={s.image}
              alt={s.caption || ''}
              fill
              priority={i === 0}
              sizes="100vw"
              className={cn('object-cover', i === active && 'animate-ken-burns')}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/45 to-forest-900/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/60 to-transparent" />
      </div>

      <div className="container">
        <div className="grid items-end gap-12 lg:grid-cols-[1fr_auto]">
          <div className="flex max-w-4xl flex-col gap-7">
            {hero.eyebrow && (
              <span className="eyebrow animate-fade-up text-oak-200 [animation-delay:100ms]">{hero.eyebrow}</span>
            )}
            <h1 className="display-1 animate-fade-up text-balance text-linen [animation-delay:200ms]">{hero.title}</h1>
            {hero.subtitle && (
              <p className="lead max-w-2xl animate-fade-up text-linen/80 [animation-delay:300ms]">{hero.subtitle}</p>
            )}
            <div className="flex animate-fade-up flex-wrap gap-3 pt-2 [animation-delay:400ms]">
              {hero.primaryCta?.label && (
                <Button asChild size="lg" variant="oak">
                  <Link href={hero.primaryCta.href || '/contact-us'}>
                    {hero.primaryCta.label} <ArrowRight />
                  </Link>
                </Button>
              )}
              {hero.secondaryCta?.label && (
                <Button asChild size="lg" variant="outlineLight">
                  <Link href={hero.secondaryCta.href || '/products'}>{hero.secondaryCta.label}</Link>
                </Button>
              )}
            </div>
          </div>

          {slides.length > 1 && (
            <div className="flex animate-fade-up flex-col gap-4 [animation-delay:500ms] lg:w-72">
              <p className="min-h-[1.5em] text-sm font-medium uppercase tracking-eyebrow text-linen/80">
                {slides[active]?.caption}
              </p>
              <div className="flex gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s.image}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show slide ${i + 1}`}
                    className="group h-8 flex-1"
                  >
                    <span className="block h-0.5 overflow-hidden rounded bg-linen/25">
                      <span
                        key={`${i}-${active}`}
                        className={cn(
                          'block h-full bg-linen',
                          i < active && 'w-full',
                          i > active && 'w-0',
                          i === active && 'animate-progress'
                        )}
                        style={{ animationDuration: `${SLIDE_MS}ms` }}
                      />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
