'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { ArrowLeft, ExternalLink, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/shell';
import BlocksEditor from '@/components/admin/blocks-editor';
import {
  Card,
  Field,
  GalleryField,
  ImageField,
  SaveBar,
  SpecsField,
  StringListField,
  Switch,
  TextAreaField,
  TextField,
} from '@/components/admin/fields';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/admin/api';
import { useAdminMutation, useAdminQuery, useDraft, useUnsavedGuard } from '@/lib/admin/hooks';
import { routes } from '@/lib/routes';
import type { Category, Product } from '@/types/cms';

const emptyProduct = (): Product => ({
  id: 0,
  title: '',
  slug: '',
  category: '',
  summary: '',
  brand: 'Oaken',
  model: '',
  code: '',
  image: '',
  seoImage: '',
  gallery: [],
  description: [''],
  video: '',
  specifications: [],
  blocks: [],
  featured: false,
  published: true,
  sortOrder: 0,
});

export default function ProductEditor({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNew = params.id === 'new';
  const { data: product, isLoading } = useAdminQuery<Product>(isNew ? null : `/admin/products/${params.id}`);
  const { data: categories = [] } = useAdminQuery<Category[]>('/admin/categories');
  const initial = useMemo(() => (isNew ? emptyProduct() : product), [isNew, product]);
  const { draft, update, dirty, reset } = useDraft(initial);
  useUnsavedGuard(dirty);

  const save = useAdminMutation(
    async (p: Product) => {
      const body = { ...p, description: p.description.filter((d) => d.trim()) };
      return isNew
        ? adminApi.post<{ data: Product }>('/admin/products', body)
        : adminApi.put<{ data: Product }>(`/admin/products/${p.id}`, body);
    },
    { success: 'Product saved' }
  );
  const remove = useAdminMutation(() => adminApi.del(`/admin/products/${params.id}`), { success: 'Product deleted' });

  if (!draft || (isLoading && !isNew)) return <p className="text-stone-500">Loading…</p>;

  const onSave = () =>
    save.mutate(draft, {
      onSuccess: (res) => {
        reset(res.data);
        if (isNew) router.replace(routes.admin.product(res.data.id));
      },
    });

  return (
    <>
      <Link href={routes.admin.products()} className="mb-4 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-ink">
        <ArrowLeft className="size-4" /> Products
      </Link>
      <PageHeader
        title={isNew ? 'New product' : draft.title || 'Untitled product'}
        actions={
          !isNew && (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href={routes.productDetails(draft.category, draft.slug)} target="_blank">
                  View <ExternalLink />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                loading={remove.isPending}
                onClick={() => {
                  if (confirm(`Delete "${draft.title}"? This cannot be undone.`)) {
                    remove.mutate(undefined, { onSuccess: () => router.replace(routes.admin.products()) });
                  }
                }}
              >
                <Trash2 /> Delete
              </Button>
            </>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card title="Basics">
            <TextField label="Title" value={draft.title} onChange={(v) => update((d) => void (d.title = v))} required />
            <TextAreaField
              label="Summary"
              hint="One or two sentences shown on product cards and under the title."
              rows={2}
              value={draft.summary}
              onChange={(v) => update((d) => void (d.summary = v))}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <TextField label="Brand" value={draft.brand} onChange={(v) => update((d) => void (d.brand = v))} />
              <TextField label="Model" value={draft.model} onChange={(v) => update((d) => void (d.model = v))} />
              <TextField label="Code" value={draft.code} onChange={(v) => update((d) => void (d.code = v))} />
            </div>
          </Card>

          <Card title="Images" description="The first gallery image is the main product photo.">
            <GalleryField
              label="Gallery"
              folder="catalog"
              value={draft.gallery}
              onChange={(v) => update((d) => void (d.gallery = v))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <ImageField
                label="Card image"
                hint="Shown in product grids. Falls back to the first gallery image."
                folder="catalog"
                aspect="aspect-[4/5]"
                value={draft.image}
                onChange={(v) => update((d) => void (d.image = v))}
              />
              <ImageField
                label="Social share image"
                hint="Used when the page is shared (1200×630 works best)."
                folder="catalog"
                aspect="aspect-[1200/630]"
                value={draft.seoImage}
                onChange={(v) => update((d) => void (d.seoImage = v))}
              />
            </div>
          </Card>

          <Card title="Description">
            <StringListField
              label="Paragraphs"
              multiline
              addLabel="Add paragraph"
              value={draft.description}
              onChange={(v) => update((d) => void (d.description = v))}
            />
            <ImageField
              label="Video"
              kind="video"
              folder="catalog"
              value={draft.video}
              onChange={(v) => update((d) => void (d.video = v))}
            />
          </Card>

          <Card title="Specifications">
            <SpecsField label="Rows" value={draft.specifications} onChange={(v) => update((d) => void (d.specifications = v))} />
          </Card>

          <Card title="Content blocks" description="Extra sections below the description — colours, finishes, technical drawings and more.">
            <BlocksEditor value={draft.blocks} onChange={(v) => update((d) => void (d.blocks = v))} />
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <Card title="Publishing">
            <Switch
              label="Published"
              hint="Hidden products are not shown on the site."
              checked={draft.published}
              onChange={(v) => update((d) => void (d.published = v))}
            />
            <Switch
              label="Featured"
              hint="Show in the home page highlights."
              checked={draft.featured}
              onChange={(v) => update((d) => void (d.featured = v))}
            />
          </Card>
          <Card title="Organisation">
            <Field label="Category">
              <select
                value={draft.category}
                onChange={(e) => update((d) => void (d.category = e.target.value))}
                className="h-11 rounded-xl border border-input bg-white px-3 text-sm"
              >
                <option value="">Choose…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <TextField
              label="URL slug"
              hint="Leave empty to generate from the title."
              value={draft.slug}
              onChange={(v) => update((d) => void (d.slug = v))}
            />
          </Card>
        </div>
      </div>

      <SaveBar dirty={dirty || isNew} saving={save.isPending} onSave={onSave} onDiscard={initial && !isNew ? () => reset(initial) : undefined} />
    </>
  );
}
