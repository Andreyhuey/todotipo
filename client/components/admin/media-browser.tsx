'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { Check, Copy, FileVideo, Loader2, Search, Trash2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi, AdminApiError } from '@/lib/admin/api';
import { useAdminQuery } from '@/lib/admin/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Media, Pagination } from '@/types/cms';

interface MediaResponse {
  data: Media[];
  folders: { name: string; count: number }[];
  pagination: Pagination;
}

interface Props {
  mode: 'manage' | 'select';
  multiple?: boolean;
  kind?: 'image' | 'video';
  /** Folder new uploads go to (and the default filter in select mode). */
  defaultFolder?: string;
  selected?: string[];
  onSelectionChange?: (urls: string[]) => void;
}

const formatSize = (b: number) =>
  b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`;

export default function MediaBrowser({
  mode,
  multiple,
  kind,
  defaultFolder = 'general',
  selected = [],
  onSelectionChange,
}: Props) {
  const qc = useQueryClient();
  const [q, setQ] = useState('');
  const [folder, setFolder] = useState('');
  const [page, setPage] = useState(1);
  const [uploading, setUploading] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [active, setActive] = useState<Media | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const params = new URLSearchParams({ page: String(page), per_page: '40' });
  if (q) params.set('q', q);
  if (folder) params.set('folder', folder);
  if (kind) params.set('kind', kind);
  const { data, isLoading } = useAdminQuery<MediaResponse>(`/admin/media?${params}`, { full: true });

  const refresh = () => qc.invalidateQueries({ queryKey: ['admin'] });

  const upload = useCallback(
    async (files: File[]) => {
      const accepted = files.filter((f) => (kind ? f.type.startsWith(`${kind}/`) : /^(image|video)\//.test(f.type)));
      if (!accepted.length) {
        toast.error(kind === 'video' ? 'Please choose a video file' : 'Please choose image files');
        return;
      }
      setUploading(0);
      try {
        const res = await adminApi.upload(accepted, folder || defaultFolder, setUploading);
        toast.success(`${res.data.length} file${res.data.length > 1 ? 's' : ''} uploaded`);
        setPage(1);
        await refresh();
        if (mode === 'select') {
          const urls = res.data.map((m) => m.url);
          onSelectionChange?.(multiple ? [...selected, ...urls] : urls.slice(0, 1));
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [folder, defaultFolder, kind, mode, multiple, selected]
  );

  const toggle = (m: Media) => {
    if (mode === 'manage') return setActive(m);
    const has = selected.includes(m.url);
    if (multiple) onSelectionChange?.(has ? selected.filter((u) => u !== m.url) : [...selected, m.url]);
    else onSelectionChange?.(has ? [] : [m.url]);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search by file name or alt text"
            className="h-10 pl-10"
          />
        </div>
        <select
          value={folder}
          onChange={(e) => {
            setFolder(e.target.value);
            setPage(1);
          }}
          className="h-10 rounded-xl border border-input bg-white px-3 text-sm"
          aria-label="Folder"
        >
          <option value="">All folders</option>
          {data?.folders.map((f) => (
            <option key={f.name} value={f.name}>
              {f.name} ({f.count})
            </option>
          ))}
        </select>
        <Button type="button" onClick={() => fileInput.current?.click()} disabled={uploading !== null}>
          <UploadCloud /> Upload
        </Button>
        <input
          ref={fileInput}
          type="file"
          hidden
          multiple
          accept={kind ? `${kind}/*` : 'image/*,video/*'}
          onChange={(e) => {
            upload(Array.from(e.target.files ?? []));
            e.target.value = '';
          }}
        />
      </div>

      {/* Drop zone + grid */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          upload(Array.from(e.dataTransfer.files));
        }}
        className={cn(
          'relative min-h-[320px] rounded-2xl border-2 border-dashed p-3 transition-colors',
          dragOver ? 'border-oak-400 bg-oak-50' : 'border-transparent'
        )}
      >
        {uploading !== null && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/85 backdrop-blur-sm">
            <Loader2 className="size-8 animate-spin text-oak-500" />
            <p className="text-sm font-medium text-ink">
              {uploading < 100 ? `Uploading… ${uploading}%` : 'Optimising images…'}
            </p>
            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-stone-200">
              <div className="h-full bg-oak-500 transition-all" style={{ width: `${uploading}%` }} />
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid h-64 place-items-center">
            <Loader2 className="size-6 animate-spin text-stone-400" />
          </div>
        ) : !data?.data.length ? (
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-xl text-stone-500 hover:bg-stone-50"
          >
            <UploadCloud className="size-10 text-stone-300" />
            <span className="font-medium text-ink">Drop files here or click to upload</span>
            <span className="text-sm">JPG, PNG, WebP, SVG{kind !== 'image' ? ' or MP4' : ''} — images are optimised automatically</span>
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {data.data.map((m) => {
              const isSelected = selected.includes(m.url) || active?.id === m.id;
              const order = multiple ? selected.indexOf(m.url) + 1 : 0;
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => toggle(m)}
                  title={m.originalName}
                  className={cn(
                    'group relative aspect-square overflow-hidden rounded-xl bg-stone-100 ring-2 ring-offset-2 transition-all',
                    isSelected ? 'ring-oak-500' : 'ring-transparent hover:ring-stone-300'
                  )}
                >
                  {m.mimeType.startsWith('video/') ? (
                    <span className="flex h-full flex-col items-center justify-center gap-1 text-stone-500">
                      <FileVideo className="size-8" />
                      <span className="line-clamp-1 px-2 text-[11px]">{m.originalName}</span>
                    </span>
                  ) : (
                    <Image src={m.url} alt={m.alt} fill sizes="160px" className="object-cover" />
                  )}
                  {isSelected && mode === 'select' && (
                    <span className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-oak-500 text-xs font-semibold text-white">
                      {order > 0 ? order : <Check className="size-3.5" />}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {data && data.pagination.last_page > 1 && (
        <div className="flex items-center justify-center gap-3 text-sm">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-stone-500">
            Page {page} of {data.pagination.last_page}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= data.pagination.last_page}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {mode === 'manage' && active && (
        <MediaDetails media={active} onClose={() => setActive(null)} onChanged={refresh} />
      )}
    </div>
  );
}

function MediaDetails({ media, onClose, onChanged }: { media: Media; onClose: () => void; onChanged: () => void }) {
  const [alt, setAlt] = useState(media.alt);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [usage, setUsage] = useState<string[] | null>(null);

  const save = async () => {
    setSaving(true);
    try {
      await adminApi.patch(`/admin/media/${media.id}`, { alt });
      toast.success('Saved');
      onChanged();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (force = false) => {
    setDeleting(true);
    try {
      await adminApi.del(`/admin/media/${media.id}${force ? '?force=true' : ''}`);
      toast.success('Deleted');
      onChanged();
      onClose();
    } catch (err) {
      if (err instanceof AdminApiError && err.status === 409) {
        setUsage((err.data?.usage as string[]) ?? []);
      } else {
        toast.error((err as Error).message);
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-md animate-sheet-in flex-col gap-5 overflow-y-auto bg-white p-6 shadow-lift">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">File details</h2>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-100">
          {media.mimeType.startsWith('video/') ? (
            <video src={media.url} controls className="h-full w-full" />
          ) : (
            <Image src={media.url} alt={media.alt} fill sizes="400px" className="object-contain" />
          )}
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-stone-500">File</dt>
            <dd className="truncate">{media.originalName}</dd>
          </div>
          <div>
            <dt className="text-stone-500">Size</dt>
            <dd>{formatSize(media.size)}</dd>
          </div>
          {media.width && (
            <div>
              <dt className="text-stone-500">Dimensions</dt>
              <dd>
                {media.width} × {media.height}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-stone-500">Folder</dt>
            <dd>{media.folder}</dd>
          </div>
        </dl>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="alt">
            Alt text <span className="font-normal text-stone-500">(describes the image for SEO and accessibility)</span>
          </label>
          <Input id="alt" value={alt} onChange={(e) => setAlt(e.target.value)} />
          <Button size="sm" onClick={save} loading={saving} disabled={alt === media.alt} className="self-start">
            Save alt text
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => {
            navigator.clipboard.writeText(media.url);
            toast.success('URL copied');
          }}
        >
          <Copy /> Copy URL
        </Button>

        <div className="mt-auto rounded-xl border border-red-100 bg-red-50/60 p-4">
          {usage ? (
            <div className="flex flex-col gap-3 text-sm">
              <p className="font-medium text-red-800">This file is in use:</p>
              <ul className="list-inside list-disc text-red-700">
                {usage.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
              <p className="text-red-700">Deleting it will leave an empty image slot on those pages.</p>
              <div className="flex gap-2">
                <Button size="sm" variant="destructive" loading={deleting} onClick={() => remove(true)}>
                  Delete anyway
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setUsage(null)}>
                  Keep it
                </Button>
              </div>
            </div>
          ) : (
            <Button size="sm" variant="destructive" loading={deleting} onClick={() => remove()}>
              <Trash2 /> Delete file
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}
