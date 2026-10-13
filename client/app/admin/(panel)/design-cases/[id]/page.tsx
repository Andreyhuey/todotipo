'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { ArrowLeft, ExternalLink, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/shell';
import {
  Card,
  GalleryField,
  ImageField,
  SaveBar,
  StringListField,
  Switch,
  TextAreaField,
  TextField,
} from '@/components/admin/fields';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/admin/api';
import { useAdminMutation, useAdminQuery, useDraft, useUnsavedGuard } from '@/lib/admin/hooks';
import { routes } from '@/lib/routes';
import type { DesignCase } from '@/types/cms';

const emptyCase = (): DesignCase => ({
  id: 0,
  name: '',
  slug: '',
  overview: '',
  description: '',
  location: '',
  tags: [],
  highlights: [],
  audience: [],
  coverImage: '',
  images: [],
  seoImage: '',
  featured: false,
  published: true,
  sortOrder: 0,
});

export default function DesignCaseEditor({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNew = params.id === 'new';
  const { data, isLoading } = useAdminQuery<DesignCase>(isNew ? null : `/admin/design-cases/${params.id}`);
  const initial = useMemo(() => (isNew ? emptyCase() : data), [isNew, data]);
  const { draft, update, dirty, reset } = useDraft(initial);
  useUnsavedGuard(dirty);

  const save = useAdminMutation(
    (c: DesignCase) =>
      isNew
        ? adminApi.post<{ data: DesignCase }>('/admin/design-cases', c)
        : adminApi.put<{ data: DesignCase }>(`/admin/design-cases/${c.id}`, c),
    { success: 'Design case saved' }
  );
  const remove = useAdminMutation(() => adminApi.del(`/admin/design-cases/${params.id}`), { success: 'Deleted' });

  if (!draft || (isLoading && !isNew)) return <p className="text-stone-500">Loading…</p>;

  const onSave = () =>
    save.mutate(draft, {
      onSuccess: (res) => {
        reset(res.data);
        if (isNew) router.replace(routes.admin.designCase(res.data.id));
      },
    });

  return (
    <>
      <Link href={routes.admin.designCases()} className="mb-4 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-ink">
        <ArrowLeft className="size-4" /> Design cases
      </Link>
      <PageHeader
        title={isNew ? 'New design case' : draft.name || 'Untitled'}
        actions={
          !isNew && (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href={routes.designCaseDetails(draft.slug)} target="_blank">
                  View <ExternalLink />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                loading={remove.isPending}
                onClick={() =>
                  confirm(`Delete "${draft.name}"?`) &&
                  remove.mutate(undefined, { onSuccess: () => router.replace(routes.admin.designCases()) })
                }
              >
                <Trash2 /> Delete
              </Button>
            </>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card title="Story">
            <TextField label="Project name" value={draft.name} onChange={(v) => update((d) => void (d.name = v))} />
            <TextField
              label="Overview"
              hint="A short tagline shown under the title."
              value={draft.overview}
              onChange={(v) => update((d) => void (d.overview = v))}
            />
            <TextAreaField label="Description" rows={6} value={draft.description} onChange={(v) => update((d) => void (d.description = v))} />
            <StringListField
              label="Highlights"
              addLabel="Add highlight"
              value={draft.highlights}
              onChange={(v) => update((d) => void (d.highlights = v))}
            />
          </Card>
          <Card title="Images">
            <ImageField
              label="Cover image"
              folder="projects"
              aspect="aspect-[16/9]"
              value={draft.coverImage}
              onChange={(v) => update((d) => void (d.coverImage = v))}
            />
            <GalleryField
              label="Project gallery"
              folder="projects"
              value={draft.images}
              onChange={(v) => update((d) => void (d.images = v))}
            />
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <Card title="Publishing">
            <Switch label="Published" checked={draft.published} onChange={(v) => update((d) => void (d.published = v))} />
            <Switch
              label="Featured"
              hint="Show on the home page."
              checked={draft.featured}
              onChange={(v) => update((d) => void (d.featured = v))}
            />
          </Card>
          <Card title="Details">
            <TextField label="Location" value={draft.location} onChange={(v) => update((d) => void (d.location = v))} />
            <StringListField label="Tags" addLabel="Add tag" value={draft.tags} onChange={(v) => update((d) => void (d.tags = v))} />
            <StringListField
              label="Ideal for"
              addLabel="Add audience"
              value={draft.audience}
              onChange={(v) => update((d) => void (d.audience = v))}
            />
            <TextField
              label="URL slug"
              hint="Leave empty to generate from the name."
              value={draft.slug}
              onChange={(v) => update((d) => void (d.slug = v))}
            />
            <ImageField
              label="Social share image"
              folder="projects"
              aspect="aspect-[1200/630]"
              value={draft.seoImage}
              onChange={(v) => update((d) => void (d.seoImage = v))}
            />
          </Card>
        </div>
      </div>

      <SaveBar dirty={dirty || isNew} saving={save.isPending} onSave={onSave} onDiscard={initial && !isNew ? () => reset(initial) : undefined} />
    </>
  );
}
