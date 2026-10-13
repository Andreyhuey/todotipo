'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/admin/shell';
import CatalogList from '@/components/admin/catalog-list';
import { Button } from '@/components/ui/button';
import { useAdminQuery } from '@/lib/admin/hooks';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import type { Category, Product } from '@/types/cms';

export default function ProductsAdminPage() {
  const [category, setCategory] = useState('');
  const { data: products = [], isLoading } = useAdminQuery<Product[]>('/admin/products');
  const { data: categories = [] } = useAdminQuery<Category[]>('/admin/categories');
  const names = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
  const rows = products.filter((p) => !category || p.category === category);

  return (
    <>
      <PageHeader
        title="Products"
        description="Star a product to feature it on the home page. Order here is the order on the site."
        actions={
          <Button asChild>
            <Link href={routes.admin.product('new')}>
              <Plus /> New product
            </Link>
          </Button>
        }
      />
      <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
        {[{ slug: '', name: 'All' }, ...categories].map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setCategory(c.slug)}
            className={cn(
              'shrink-0 rounded-full border px-4 py-1.5 text-sm',
              category === c.slug ? 'border-ink bg-ink text-white' : 'border-stone-200 bg-white text-stone-600'
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
      {isLoading ? (
        <p className="text-stone-500">Loading…</p>
      ) : (
        <CatalogList
          endpoint="/admin/products"
          editHref={routes.admin.product}
          reorderable={!category}
          rows={rows.map((p) => ({
            id: p.id,
            title: p.title,
            subtitle: names[p.category] ?? p.category,
            image: p.image || p.gallery[0],
            published: p.published,
            featured: p.featured,
          }))}
        />
      )}
    </>
  );
}
