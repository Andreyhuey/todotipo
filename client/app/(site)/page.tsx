import Hero from '@/components/home/hero';
import {
  CategoryShowcase,
  CtaBanner,
  FeaturedCases,
  FeaturedProducts,
  Intro,
  Stats,
  Testimonials,
  WhyUs,
} from '@/components/home/sections';
import { getDesignCases, getProducts, getSite } from '@/lib/cms';

export default async function Home() {
  const [{ home, categories }, products, cases] = await Promise.all([
    getSite(),
    getProducts(),
    getDesignCases(),
  ]);

  const counts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});
  const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
  // Featured items first, topped up with the rest so the grids are always full.
  const byFeatured = <T extends { featured: boolean }>(list: T[], n: number) =>
    [...list.filter((x) => x.featured), ...list.filter((x) => !x.featured)].slice(0, n);

  return (
    <>
      <Hero hero={home.hero} />
      <Stats stats={home.stats} />
      <Intro intro={home.intro} />
      <CategoryShowcase categories={categories} counts={counts} />
      <FeaturedProducts
        products={byFeatured(products, 4)}
        categoryNames={categoryNames}
      />
      <WhyUs whyUs={home.whyUs} />
      <FeaturedCases cases={byFeatured(cases, 5)} />
      <Testimonials items={home.testimonials} />
      <CtaBanner cta={home.cta} />
    </>
  );
}
