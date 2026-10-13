'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/shell';
import { ImageField, TextAreaField, TextField } from '@/components/admin/fields';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/admin/api';
import { useAdminMutation, useAdminQuery } from '@/lib/admin/hooks';
import type { Category, Product } from '@/types/cms';

type Draft = Pick<Category, 'name' | 'slug' | 'description' | 'image'> & { id?: number };

export default function CategoriesPage() {
  const { data: categories = [] } = useAdminQuery<Category[]>('/admin/categories');
  const { data: products = [] } = useAdminQuery<Product[]>('/admin/products');
  const [editing, setEditing] = useState<Draft | null>(null);

  const save = useAdminMutation(
    (c: Draft) => (c.id ? adminApi.put(`/admin/categories/${c.id}`, c) : adminApi.post('/admin/categories', c)),
    { success: 'Category saved' }
  );
  const remove = useAdminMutation((id: number) => adminApi.del(`/admin/categories/${id}`), { success: 'Category deleted' });
  const reorder = useAdminMutation((ids: number[]) => adminApi.put('/admin/categories/reorder', { ids }));

  const count = (slug: string) => products.filter((p) => p.category === slug).length;
  const move = (i: number, d: number) => {
    const ids = categories.map((c) => c.id);
    [ids[i], ids[i + d]] = [ids[i + d], ids[i]];
    reorder.mutate(ids);
  };

  return (
    <>
      <PageHeader
        title="Categories"
        description="Group products and power the navigation menu. Each category has a cover image."
        actions={
          <Button onClick={() => setEditing({ name: '', slug: '', description: '', image: '' })}>
            <Plus /> New category
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <div key={c.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="relative aspect-[16/10] bg-stone-100">
              {c.image && <Image src={c.image} alt="" fill sizes="400px" className="object-cover" />}
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{c.name}</p>
                <p className="text-sm text-stone-500">{count(c.slug)} products</p>
              </div>
              <Button size="icon" variant="ghost" aria-label="Move earlier" disabled={i === 0} onClick={() => move(i, -1)}>
                <ArrowUp />
              </Button>
              <Button size="icon" variant="ghost" aria-label="Move later" disabled={i === categories.length - 1} onClick={() => move(i, 1)}>
                <ArrowDown />
              </Button>
              <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEditing(c)}>
                <Pencil />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Delete"
                className="text-red-600 hover:bg-red-50"
                onClick={() => confirm(`Delete "${c.name}"?`) && remove.mutate(c.id)}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogTitle className="font-medium">{editing?.id ? 'Edit category' : 'New category'}</DialogTitle>
          {editing && (
            <div className="flex flex-col gap-4">
              <TextField label="Name" value={editing.name} onChange={(name) => setEditing({ ...editing, name })} />
              <TextField
                label="URL slug"
                hint="Leave empty to generate from the name."
                value={editing.slug}
                onChange={(slug) => setEditing({ ...editing, slug })}
              />
              <TextAreaField
                label="Description"
                rows={3}
                value={editing.description ?? ''}
                onChange={(description) => setEditing({ ...editing, description })}
              />
              <ImageField
                label="Cover image"
                folder="catalog"
                value={editing.image ?? ''}
                onChange={(image) => setEditing({ ...editing, image })}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button loading={save.isPending} onClick={() => save.mutate(editing, { onSuccess: () => setEditing(null) })}>
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
