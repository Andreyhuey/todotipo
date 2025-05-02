import Hero from '@/components/home/hero';
import FreeQuote from '@/components/free-quote';
import WhyUs from '@/components/home/why-us';
import DesignCases from '@/components/home/design-cases';
import Quote from '@/components/home/quote';
import Products from '@/components/home/products';

export default function Home() {
  return (
    <>
      <Hero />
      <Quote />
      <Products />
      <WhyUs />
      <DesignCases />
      <FreeQuote />
    </>
  );
}
