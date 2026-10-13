import type { MetadataRoute } from 'next';
import { baseUrl } from '@/constants/config';
import { getDesignCases, getProducts } from '@/lib/cms';
import { routes, staticPages } from '@/lib/routes';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, cases] = await Promise.all([
    getProducts().catch(() => []),
    getDesignCases().catch(() => []),
  ]);

  return [
    ...staticPages.map((path) => ({
      url: `${baseUrl}${path}`,
      changeFrequency: 'weekly' as const,
      priority: path === '/' ? 1 : 0.8,
    })),
    ...products.map((p) => ({
      url: `${baseUrl}${routes.productDetails(p.category, p.slug)}`,
      lastModified: p.updatedAt,
      priority: 0.7,
    })),
    ...cases.map((c) => ({
      url: `${baseUrl}${routes.designCaseDetails(c.slug)}`,
      lastModified: c.updatedAt,
      priority: 0.6,
    })),
  ];
}
