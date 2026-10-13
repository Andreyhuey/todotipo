import type { Metadata } from 'next';
import LegalPage from '@/components/site/legal-page';
import { getSite } from '@/lib/cms';
import { buildMetadata } from '@/lib/seo';
import { routes } from '@/lib/routes';

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Terms & conditions', path: routes.terms() });
}

export default async function TermsPage() {
  const { legal } = await getSite();
  return <LegalPage title="Terms & conditions" body={legal.terms} updatedAt={legal.updatedAt} />;
}
