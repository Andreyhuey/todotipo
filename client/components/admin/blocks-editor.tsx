'use client';

import { GalleryHorizontal, Grid3x3, ListChecks, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, GalleryField, ImageField, Repeater, SpecsField, TextField } from './fields';
import type { BlockType, ContentBlock } from '@/types/cms';

const BLOCKS: { type: BlockType; label: string; hint: string; icon: React.ElementType }[] = [
  { type: 'gallery', label: 'Image gallery', hint: 'Full-width images, stacked', icon: GalleryHorizontal },
  { type: 'swatches', label: 'Swatches', hint: 'Captioned image grid — colours, finishes, styles', icon: Grid3x3 },
  { type: 'features', label: 'Feature icons', hint: 'Small icon + label tiles', icon: ListChecks },
  { type: 'specs', label: 'Spec table', hint: 'Name / value rows', icon: Table },
];

const labelFor = (t: BlockType) => BLOCKS.find((b) => b.type === t)?.label ?? t;

export default function BlocksEditor({
  value,
  onChange,
}: {
  value: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}) {
  const add = (type: BlockType) =>
    onChange([
      ...value,
      { type, title: '', columns: type === 'features' ? 4 : 3, items: [], specs: type === 'specs' ? [{ name: '', value: '' }] : [] },
    ]);

  return (
    <div className="flex flex-col gap-4">
      {value.length > 0 && (
        <Repeater
          items={value}
          onChange={onChange}
          create={(): ContentBlock => ({ type: 'gallery', items: [] })}
          itemLabel={(b) => `${labelFor(b.type)}${b.title ? ` — ${b.title}` : ''}`}
          hideAdd
          render={(block, update) => (
            <>
              <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
                <TextField label="Heading" value={block.title ?? ''} onChange={(title) => update({ title })} placeholder="Optional" />
                {(block.type === 'swatches' || block.type === 'features') && (
                  <Field label="Columns">
                    <select
                      value={block.columns ?? 3}
                      onChange={(e) => update({ columns: Number(e.target.value) })}
                      className="h-11 rounded-xl border border-input bg-white px-3 text-sm"
                    >
                      {[2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
              </div>

              {block.type === 'gallery' && (
                <GalleryField
                  label="Images"
                  folder="catalog"
                  value={(block.items ?? []).map((i) => i.image)}
                  onChange={(urls) => update({ items: urls.map((image) => ({ image })) })}
                />
              )}

              {(block.type === 'swatches' || block.type === 'features') && (
                <Repeater
                  label={block.type === 'features' ? 'Features' : 'Swatches'}
                  items={block.items ?? []}
                  onChange={(items) => update({ items })}
                  create={() => ({ image: '', name: '' })}
                  addLabel={block.type === 'features' ? 'Add feature' : 'Add swatch'}
                  itemLabel={(it, i) => it.name || `Item ${i + 1}`}
                  render={(it, upd) => (
                    <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
                      <ImageField
                        label={block.type === 'features' ? 'Icon' : 'Image'}
                        value={it.image}
                        onChange={(image) => upd({ image })}
                        folder="catalog"
                        aspect="aspect-square"
                      />
                      <TextField label="Caption" value={it.name ?? ''} onChange={(name) => upd({ name })} />
                    </div>
                  )}
                />
              )}

              {block.type === 'specs' && (
                <SpecsField label="Rows" value={block.specs ?? []} onChange={(specs) => update({ specs })} />
              )}
            </>
          )}
        />
      )}

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {BLOCKS.map(({ type, label, hint, icon: I }) => (
          <Button
            key={type}
            type="button"
            variant="outline"
            onClick={() => add(type)}
            className="h-auto flex-col items-start gap-1 whitespace-normal rounded-xl px-4 py-3 text-left"
          >
            <span className="flex items-center gap-2 font-medium">
              <I /> {label}
            </span>
            <span className="text-xs font-normal opacity-70">{hint}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
