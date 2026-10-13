import CmsImage from '@/components/site/cms-image';
import { cn } from '@/lib/utils';
import type { ContentBlock, SpecRow } from '@/types/cms';

const gridCols: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
  5: 'grid-cols-3 md:grid-cols-5',
  6: 'grid-cols-3 md:grid-cols-6',
};

export function SpecTable({ specs }: { specs: SpecRow[] }) {
  return (
    <dl className="overflow-hidden rounded-2xl border border-border">
      {specs.map((s, i) => (
        <div
          key={`${s.name}-${i}`}
          className="grid grid-cols-[minmax(120px,40%)_1fr] gap-4 border-b border-border px-5 py-4 last:border-0 odd:bg-linen/60"
        >
          <dt className="text-sm text-stone-500">{s.name}</dt>
          <dd className="text-sm font-medium text-ink">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function BlockTitle({ children }: { children?: string }) {
  if (!children) return null;
  return <h3 className="font-display text-2xl font-light text-ink md:text-3xl">{children}</h3>;
}

/** Renders a product's flexible content blocks (built in the admin). */
export default function ContentBlocks({ blocks, productTitle }: { blocks: ContentBlock[]; productTitle: string }) {
  return (
    <>
      {blocks.map((block, bi) => {
        const items = block.items ?? [];
        const key = `${block.type}-${bi}`;

        switch (block.type) {
          case 'gallery':
            if (!items.length) return null;
            return (
              <section key={key} className="flex flex-col gap-6">
                <BlockTitle>{block.title}</BlockTitle>
                <div className="flex flex-col gap-4">
                  {items.map((it, i) => (
                    <figure key={`${it.image}-${i}`} className="overflow-hidden rounded-2xl bg-linen-300">
                      <CmsImage
                        src={it.image}
                        alt={it.name || `${productTitle} — ${block.title || 'detail'} ${i + 1}`}
                        sizes="(min-width: 1024px) 66vw, 100vw"
                        className="h-auto w-full"
                      />
                      {it.name && <figcaption className="px-4 py-3 text-sm text-stone-500">{it.name}</figcaption>}
                    </figure>
                  ))}
                </div>
              </section>
            );

          case 'swatches':
            if (!items.length) return null;
            return (
              <section key={key} className="flex flex-col gap-6">
                <BlockTitle>{block.title}</BlockTitle>
                <div className={cn('grid gap-x-5 gap-y-8', gridCols[block.columns ?? 3] ?? gridCols[3])}>
                  {items.map((it, i) => (
                    <figure key={`${it.image}-${i}`} className="flex flex-col gap-3">
                      <div className="overflow-hidden rounded-xl bg-linen-300">
                        <CmsImage
                          src={it.image}
                          alt={it.name || `${block.title} ${i + 1}`}
                          sizes="(min-width: 768px) 25vw, 50vw"
                          className="h-auto w-full transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      {it.name && <figcaption className="text-center text-sm font-medium text-ink">{it.name}</figcaption>}
                    </figure>
                  ))}
                </div>
              </section>
            );

          case 'features':
            if (!items.length) return null;
            return (
              <section key={key} className="flex flex-col gap-6">
                <BlockTitle>{block.title}</BlockTitle>
                <div className={cn('grid gap-4', gridCols[block.columns ?? 4] ?? gridCols[4])}>
                  {items.map((it, i) => (
                    <div
                      key={`${it.image}-${i}`}
                      className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-6 text-center"
                    >
                      <div className="relative size-14">
                        <CmsImage src={it.image} alt="" fill sizes="56px" className="object-contain" />
                      </div>
                      <span className="text-sm font-medium text-ink">{it.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'specs':
            if (!block.specs?.length) return null;
            return (
              <section key={key} className="flex flex-col gap-6">
                <BlockTitle>{block.title}</BlockTitle>
                <SpecTable specs={block.specs} />
              </section>
            );

          default:
            return null;
        }
      })}
    </>
  );
}
