'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Star } from 'lucide-react';
import { adminApi } from '@/lib/admin/api';
import { useAdminMutation } from '@/lib/admin/hooks';
import { cn } from '@/lib/utils';

export interface ListRow {
  id: number;
  title: string;
  subtitle?: string;
  image?: string;
  published: boolean;
  featured: boolean;
}

/**
 * Shared table for products and design cases: thumbnail, quick publish /
 * feature toggles and up/down ordering (persisted via the reorder endpoint).
 */
export default function CatalogList({
  rows,
  endpoint,
  editHref,
  reorderable = true,
}: {
  rows: ListRow[];
  endpoint: string;
  editHref: (id: number) => string;
  reorderable?: boolean;
}) {
  const patch = useAdminMutation(async ({ id, body }: { id: number; body: Record<string, unknown> }) => {
    const { data } = await adminApi.get<{ data: Record<string, unknown> }>(`${endpoint}/${id}`);
    return adminApi.put(`${endpoint}/${id}`, { ...data, ...body });
  });
  const reorder = useAdminMutation((ids: number[]) => adminApi.put(`${endpoint}/reorder`, { ids }), {
    success: 'Order saved',
  });

  const move = (i: number, d: number) => {
    const ids = rows.map((r) => r.id);
    [ids[i], ids[i + d]] = [ids[i + d], ids[i]];
    reorder.mutate(ids);
  };

  if (!rows.length) {
    return <p className="rounded-2xl border border-dashed border-stone-300 p-10 text-center text-stone-500">Nothing here yet.</p>;
  }

  return (
    <ul className="divide-y divide-stone-100 overflow-hidden rounded-2xl border border-stone-200 bg-white">
      {rows.map((r, i) => (
        <li key={r.id} className="flex items-center gap-4 px-4 py-3">
          {reorderable && (
            <div className="flex flex-col">
              <button
                type="button"
                aria-label="Move up"
                disabled={i === 0 || reorder.isPending}
                onClick={() => move(i, -1)}
                className="text-stone-400 hover:text-ink disabled:opacity-20"
              >
                <ArrowUp className="size-3.5" />
              </button>
              <button
                type="button"
                aria-label="Move down"
                disabled={i === rows.length - 1 || reorder.isPending}
                onClick={() => move(i, 1)}
                className="text-stone-400 hover:text-ink disabled:opacity-20"
              >
                <ArrowDown className="size-3.5" />
              </button>
            </div>
          )}
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-stone-100">
            {r.image && <Image src={r.image} alt="" fill sizes="56px" className="object-cover" />}
          </div>
          <Link href={editHref(r.id)} className="min-w-0 flex-1">
            <p className="truncate font-medium text-ink hover:underline">{r.title}</p>
            {r.subtitle && <p className="truncate text-sm text-stone-500">{r.subtitle}</p>}
          </Link>
          <button
            type="button"
            title={r.featured ? 'Featured on home page' : 'Not featured'}
            onClick={() => patch.mutate({ id: r.id, body: { featured: !r.featured } })}
            className={cn('grid size-9 place-items-center rounded-lg hover:bg-stone-100', r.featured ? 'text-oak-500' : 'text-stone-300')}
          >
            <Star className={cn('size-4', r.featured && 'fill-current')} />
          </button>
          <button
            type="button"
            title={r.published ? 'Published — click to hide' : 'Hidden — click to publish'}
            onClick={() => patch.mutate({ id: r.id, body: { published: !r.published } })}
            className={cn(
              'hidden items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium sm:flex',
              r.published ? 'bg-forest-50 text-forest-700' : 'bg-stone-100 text-stone-500'
            )}
          >
            {r.published ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
            {r.published ? 'Live' : 'Hidden'}
          </button>
          <Link href={editHref(r.id)} className="grid size-9 place-items-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-ink" aria-label="Edit">
            <Pencil className="size-4" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
