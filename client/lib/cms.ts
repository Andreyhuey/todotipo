import 'server-only';
import { cache } from 'react';
import { apiUrl } from '@/constants/config';
import type { DesignCase, Product, SiteData } from '@/types/cms';

/** Cache tag shared by every CMS read; admin saves revalidate it. */
export const CMS_TAG = 'cms';
const REVALIDATE_SECONDS = 300;

class CmsNotFound extends Error {}

const get = async <T>(path: string): Promise<T> => {
  const res = await fetch(apiUrl(path), {
    next: { revalidate: REVALIDATE_SECONDS, tags: [CMS_TAG] },
  });
  if (res.status === 404) throw new CmsNotFound(path);
  if (!res.ok) throw new Error(`CMS request failed (${res.status}): ${path}`);
  const json = await res.json();
  return json.data as T;
};

const orNull = async <T>(p: Promise<T>) => {
  try {
    return await p;
  } catch (err) {
    if (err instanceof CmsNotFound) return null;
    throw err;
  }
};

// React `cache` dedupes calls within one render (layout + page + metadata).
export const getSite = cache(() => get<SiteData>('/site'));

export const getProducts = cache((category?: string) =>
  get<Product[]>(`/products${category ? `?category=${encodeURIComponent(category)}` : ''}`)
);

export const getProduct = cache((slug: string) =>
  orNull(get<Product>(`/products/${encodeURIComponent(slug)}`))
);

export const getDesignCases = cache(() => get<DesignCase[]>('/design-cases'));

export const getDesignCase = cache((slug: string) =>
  orNull(get<DesignCase>(`/design-cases/${encodeURIComponent(slug)}`))
);
