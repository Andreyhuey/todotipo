import CmsImage from './cms-image';
import type { PageHero as PageHeroData } from '@/types/cms';

interface Props {
  hero: PageHeroData;
  children?: React.ReactNode;
}

/** Banner at the top of inner pages; image and copy come from the CMS. */
export default function PageHero({ hero, children }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-forest-900 pb-16 pt-36 md:pb-24 md:pt-44">
      <CmsImage
        src={hero.image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 animate-ken-burns object-cover opacity-55"
        placeholderClassName="-z-10 opacity-0"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900 via-forest-900/70 to-forest-900/30" />
      <div className="container">
        <div className="flex max-w-3xl animate-fade-up flex-col gap-5">
          {hero.eyebrow && <span className="eyebrow text-oak-300">{hero.eyebrow}</span>}
          <h1 className="display-1 text-balance text-linen">{hero.title}</h1>
          {hero.subtitle && <p className="lead max-w-2xl text-linen/75">{hero.subtitle}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
