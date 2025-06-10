import AboutHero from '@/components/about/hero';
import Story from '@/components/about/story';
import FreeQuote from '@/components/free-quote';
import { getMetadata } from '@/lib/get-metadata';
import { routes } from '@/lib/routes';
import { Metadata } from 'next';

export function generateMetadata(): Metadata {
  return getMetadata(routes.aboutUs());
}

export default function page() {
  return (
    <>
      <AboutHero />
      <Story />
      <FreeQuote />
    </>
  );
}
