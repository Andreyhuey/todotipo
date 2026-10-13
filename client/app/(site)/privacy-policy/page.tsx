import type { Metadata } from 'next';
import LegalPage from '@/components/site/legal-page';
import { getSite } from '@/lib/cms';
import { buildMetadata } from '@/lib/seo';
import { routes } from '@/lib/routes';

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Privacy policy', path: routes.privacy() });
}

export default async function PrivacyPage() {
  const { legal } = await getSite();
  return <LegalPage title="Privacy policy" body={legal.privacy} updatedAt={legal.updatedAt} />;
}
