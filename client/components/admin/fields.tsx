'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUp, FileVideo, ImagePlus, Plus, Trash2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { iconMap, iconNames } from '@/components/site/icon';
import { cn } from '@/lib/utils';
import MediaBrowser from './media-browser';
import type { SpecRow } from '@/types/cms';

// ---- layout ------------------------------------------------------------------

export function Card({
  title,
  description,
  children,
  className,
  actions,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className={cn('rounded-2xl border border-stone-200 bg-white', className)}>
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 border-b border-stone-100 px-6 py-4">
          <div>
            {title && <h2 className="font-medium text-ink">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-stone-500">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="flex flex-col gap-5 p-6">{children}</div>
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="text-xs text-stone-500">{hint}</span>}
    </div>
  );
}

export function TextField({
  label,
  hint,
  value,
  onChange,
  className,
  ...props
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
} & Omit<React.ComponentProps<'input'>, 'value' | 'onChange'>) {
  return (
    <Field label={label} hint={hint} className={className}>
      <Input value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="h-11" {...props} />
    </Field>
  );
}

export function TextAreaField({
  label,
  hint,
  value,
  onChange,
  rows = 4,
  className,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  className?: string;
}) {
  return (
    <Field label={label} hint={hint} className={className}>
      <Textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={rows} className="min-h-0" />
    </Field>
  );
}

export function Switch({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {hint && <span className="block text-xs text-stone-500">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-forest-600' : 'bg-stone-300'
        )}
      >
        <span
          className={cn(
            'absolute left-0 top-0.5 size-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          )}
        />
      </button>
    </label>
  );
}

export function IconSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {iconNames.map((name) => {
        const I = iconMap[name];
        return (
          <button
            key={name}
            type="button"
            title={name}
            onClick={() => onChange(name)}
            className={cn(
              'grid size-9 place-items-center rounded-lg border transition-colors',
              value === name ? 'border-forest-600 bg-forest-50 text-forest-700' : 'border-stone-200 text-stone-500 hover:border-stone-400'
            )}
          >
            <I className="size-4" strokeWidth={1.75} />
          </button>
        );
      })}
    </div>
  );
}

// ---- media -------------------------------------------------------------------

export function MediaPickerDialog({
  open,
  onOpenChange,
  multiple,
  kind = 'image',
  folder,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  multiple?: boolean;
  kind?: 'image' | 'video';
  folder?: string;
  onConfirm: (urls: string[]) => void;
}) {
  const [selection, setSelection] = useState<string[]>([]);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setSelection([]);
        onOpenChange(o);
      }}
    >
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 rounded-2xl p-0 sm:max-w-5xl">
        <div className="border-b border-stone-100 px-6 py-4">
          <DialogTitle className="font-medium">
            {multiple ? 'Choose images' : kind === 'video' ? 'Choose a video' : 'Choose an image'}
          </DialogTitle>
          <p className="text-sm text-stone-500">Pick from the library or upload new files.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <MediaBrowser
            mode="select"
            multiple={multiple}
            kind={kind}
            defaultFolder={folder}
            selected={selection}
            onSelectionChange={setSelection}
          />
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-stone-100 px-6 py-4">
          <span className="text-sm text-stone-500">{selection.length} selected</span>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              disabled={!selection.length}
              onClick={() => {
                onConfirm(selection);
                setSelection([]);
                onOpenChange(false);
              }}
            >
              {multiple ? `Add ${selection.length || ''}` : 'Use this file'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** A single image (or video) slot, filled from the media library. */
export function ImageField({
  label,
  hint,
  value,
  onChange,
  folder,
  kind = 'image',
  aspect = 'aspect-video',
  className,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  kind?: 'image' | 'video';
  aspect?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Field label={label} hint={hint} className={className}>
      <div className={cn('group relative overflow-hidden rounded-xl border border-stone-200 bg-stone-50', aspect)}>
        {value ? (
          <>
            {kind === 'video' ? (
              <video src={value} className="h-full w-full object-cover" muted />
            ) : (
              <Image src={value} alt="" fill sizes="400px" className="object-cover" />
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/50 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <Button type="button" size="sm" variant="light" onClick={() => setOpen(true)}>
                Replace
              </Button>
              <Button type="button" size="sm" variant="destructive" onClick={() => onChange('')} aria-label="Remove">
                <X />
              </Button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-ink"
          >
            {kind === 'video' ? <FileVideo className="size-6" /> : <ImagePlus className="size-6" />}
            <span className="text-sm">{kind === 'video' ? 'Add video' : 'Add image'}</span>
          </button>
        )}
      </div>
      <MediaPickerDialog open={open} onOpenChange={setOpen} kind={kind} folder={folder} onConfirm={(urls) => onChange(urls[0])} />
    </Field>
  );
}

/** An ordered list of images from the media library. */
export function GalleryField({
  label,
  hint,
  value,
  onChange,
  folder,
}: {
  label: string;
  hint?: string;
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
}) {
  const [open, setOpen] = useState(false);
  const move = (i: number, d: number) => {
    const next = [...value];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };

  return (
    <Field label={label} hint={hint}>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {value.map((url, i) => (
          <div key={`${url}-${i}`} className="group relative aspect-square overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
            <Image src={url} alt="" fill sizes="160px" className="object-cover" />
            {i === 0 && (
              <span className="absolute left-1.5 top-1.5 rounded-md bg-ink/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                Main
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-gradient-to-t from-ink/70 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <IconBtn label="Move left" disabled={i === 0} onClick={() => move(i, -1)}>
                <ArrowUp className="-rotate-90" />
              </IconBtn>
              <IconBtn label="Move right" disabled={i === value.length - 1} onClick={() => move(i, 1)}>
                <ArrowDown className="-rotate-90" />
              </IconBtn>
              <IconBtn label="Remove" onClick={() => onChange(value.filter((_, j) => j !== i))}>
                <Trash2 />
              </IconBtn>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-stone-200 text-stone-500 transition-colors hover:border-stone-400 hover:text-ink"
        >
          <ImagePlus className="size-5" />
          <span className="text-xs">Add images</span>
        </button>
      </div>
      <MediaPickerDialog
        open={open}
        onOpenChange={setOpen}
        multiple
        folder={folder}
        onConfirm={(urls) => onChange([...value, ...urls])}
      />
    </Field>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-7 place-items-center rounded-md bg-white/90 text-ink hover:bg-white disabled:opacity-30 [&_svg]:size-3.5"
    >
      {children}
    </button>
  );
}

// ---- lists -------------------------------------------------------------------

/**
 * Generic ordered list editor. `render` draws one item's fields; reorder,
 * remove and add controls are provided.
 */
export function Repeater<T>({
  label,
  hint,
  items,
  onChange,
  create,
  render,
  addLabel = 'Add item',
  itemLabel,
  hideAdd,
}: {
  label?: string;
  hint?: string;
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  render: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  addLabel?: string;
  itemLabel?: (item: T, index: number) => string;
  hideAdd?: boolean;
}) {
  const update = (i: number, patch: Partial<T>) =>
    onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const move = (i: number, d: number) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <div>
          <span className="text-sm font-medium text-ink">{label}</span>
          {hint && <p className="text-xs text-stone-500">{hint}</p>}
        </div>
      )}
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-stone-200 bg-stone-50/60">
          <div className="flex items-center justify-between gap-2 border-b border-stone-200 px-4 py-2">
            <span className="truncate text-xs font-medium uppercase tracking-wider text-stone-500">
              {itemLabel?.(item, i) || `#${i + 1}`}
            </span>
            <div className="flex gap-1">
              <SmallBtn label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                <ArrowUp />
              </SmallBtn>
              <SmallBtn label="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                <ArrowDown />
              </SmallBtn>
              <SmallBtn label="Remove" onClick={() => onChange(items.filter((_, j) => j !== i))}>
                <Trash2 />
              </SmallBtn>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-4">{render(item, (p) => update(i, p), i)}</div>
        </div>
      ))}
      {!hideAdd && (
        <Button type="button" variant="outline" size="sm" className="self-start" onClick={() => onChange([...items, create()])}>
          <Plus /> {addLabel}
        </Button>
      )}
    </div>
  );
}

function SmallBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-7 place-items-center rounded-md text-stone-500 hover:bg-white hover:text-ink disabled:opacity-30 [&_svg]:size-3.5"
    >
      {children}
    </button>
  );
}

/** List of plain strings (paragraphs, tags, highlights). */
export function StringListField({
  label,
  hint,
  value,
  onChange,
  multiline,
  addLabel = 'Add',
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string[];
  onChange: (v: string[]) => void;
  multiline?: boolean;
  addLabel?: string;
  placeholder?: string;
}) {
  const set = (i: number, v: string) => onChange(value.map((x, j) => (j === i ? v : x)));
  const move = (i: number, d: number) => {
    const next = [...value];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };

  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-col gap-2">
        {value.map((v, i) => (
          <div key={i} className="flex items-start gap-2">
            {multiline ? (
              <Textarea value={v} onChange={(e) => set(i, e.target.value)} rows={3} placeholder={placeholder} className="min-h-0" />
            ) : (
              <Input value={v} onChange={(e) => set(i, e.target.value)} placeholder={placeholder} className="h-10" />
            )}
            <div className={cn('flex shrink-0', multiline ? 'flex-col' : 'flex-row')}>
              <SmallBtn label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                <ArrowUp />
              </SmallBtn>
              <SmallBtn label="Move down" disabled={i === value.length - 1} onClick={() => move(i, 1)}>
                <ArrowDown />
              </SmallBtn>
              <SmallBtn label="Remove" onClick={() => onChange(value.filter((_, j) => j !== i))}>
                <Trash2 />
              </SmallBtn>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="self-start" onClick={() => onChange([...value, ''])}>
          <Plus /> {addLabel}
        </Button>
      </div>
    </Field>
  );
}

/** Two-column name/value rows (specifications). */
export function SpecsField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: SpecRow[];
  onChange: (v: SpecRow[]) => void;
}) {
  const set = (i: number, patch: Partial<SpecRow>) => onChange(value.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  return (
    <Field label={label}>
      <div className="flex flex-col gap-2">
        {value.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_1.4fr_auto] gap-2">
            <Input value={row.name} onChange={(e) => set(i, { name: e.target.value })} placeholder="e.g. Size" className="h-10" />
            <Input value={row.value} onChange={(e) => set(i, { value: e.target.value })} placeholder="e.g. 145 × 22 mm" className="h-10" />
            <SmallBtn label="Remove" onClick={() => onChange(value.filter((_, j) => j !== i))}>
              <Trash2 />
            </SmallBtn>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => onChange([...value, { name: '', value: '' }])}
        >
          <Plus /> Add row
        </Button>
      </div>
    </Field>
  );
}

// ---- save bar ----------------------------------------------------------------

export function SaveBar({
  dirty,
  saving,
  onSave,
  onDiscard,
  extra,
}: {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard?: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="sticky bottom-4 z-20 mt-8 flex items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white/95 px-5 py-3 shadow-soft backdrop-blur">
      <span className="flex items-center gap-2 text-sm text-stone-500">
        <span className={cn('size-2 rounded-full', dirty ? 'bg-oak-500' : 'bg-forest-400')} />
        {dirty ? 'Unsaved changes' : 'All changes saved'}
      </span>
      <div className="flex gap-2">
        {extra}
        {onDiscard && dirty && (
          <Button type="button" variant="ghost" onClick={onDiscard}>
            Discard
          </Button>
        )}
        <Button type="button" onClick={onSave} loading={saving} disabled={!dirty}>
          Save changes
        </Button>
      </div>
    </div>
  );
}
