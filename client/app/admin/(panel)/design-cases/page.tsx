'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/admin/shell';
import CatalogList from '@/components/admin/catalog-list';
import { Button } from '@/components/ui/button';
import { useAdminQuery } from '@/lib/admin/hooks';
import { routes } from '@/lib/routes';
import type { DesignCase } from '@/types/cms';

export default function DesignCasesAdminPage() {
  const { data = [], isLoading } = useAdminQuery<DesignCase[]>('/admin/design-cases');

  return (
    <>
      <PageHeader
        title="Design cases"
        description="Showcase projects. Starred cases appear on the home page."
        actions={
          <Button asChild>
            <Link href={routes.admin.designCase('new')}>
              <Plus /> New design case
            </Link>
          </Button>
        }
      />
      {isLoading ? (
        <p className="text-stone-500">Loading…</p>
      ) : (
        <CatalogList
          endpoint="/admin/design-cases"
          editHref={routes.admin.designCase}
          rows={data.map((c) => ({
            id: c.id,
            title: c.name,
            subtitle: c.tags.join(' · '),
            image: c.coverImage,
            published: c.published,
            featured: c.featured,
          }))}
        />
      )}
    </>
  );
}
