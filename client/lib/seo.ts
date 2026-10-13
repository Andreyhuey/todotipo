import type { Metadata } from 'next';
import { getSite } from './cms';

interface PageMeta {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  keywords?: string[];
}

/**
 * Builds page metadata from CMS settings, so titles, descriptions, social
 * images and the favicon are all editable from the admin.
 */
export async function buildMetadata(page: PageMeta = {}): Promise<Metadata> {
  const { site, seo } = await getSite();
  const title = page.title ? `${page.title} | ${site.name}` : seo.title || site.name;
  const description = page.description || seo.description;
  const image = page.image || site.ogImage;

  return {
    title,
    description,
    keywords: page.keywords ?? seo.keywords,
    alternates: page.path ? { canonical: page.path } : undefined,
    icons: site.favicon ? { icon: site.favicon, apple: site.favicon } : undefined,
    openGraph: {
      title,
      description,
      siteName: site.name,
      type: 'website',
      url: page.path,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: { index: true, follow: true },
  };
}
