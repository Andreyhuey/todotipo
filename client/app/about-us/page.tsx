import Commit from '@/components/about/commit';
import AboutHero from '@/components/about/hero';
import Story from '@/components/about/story';
import FreeQuote from '@/components/free-quote';

export default function page() {
  return (
    <>
      <AboutHero />
      <Commit />
      <Story />
      <FreeQuote />
    </>
  );
}
