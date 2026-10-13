import type { Metadata } from 'next';
import Navbar from '@/components/site/navbar';
import Footer from '@/components/site/footer';
import GoogleAnalytics from '@/components/google-analytics';
import VisitTracker from '@/components/site/visit-tracker';
import { getSite } from '@/lib/cms';
import { buildMetadata } from '@/lib/seo';

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: '/' });
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { site, categories } = await getSite();

  return (
    <>
      <Navbar site={site} categories={categories} />
      <main id="main">{children}</main>
      <Footer site={site} categories={categories} />
      <VisitTracker />
      {process.env.NODE_ENV === 'production' && <GoogleAnalytics />}
    </>
  );
}
