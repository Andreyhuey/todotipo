'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CmsImage from '@/components/site/cms-image';
import { cn } from '@/lib/utils';

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const go = (d: number) => setIndex((i) => (i + d + count) % count);

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-[4/3] overflow-hidden rounded-[24px] bg-linen-300">
        {count === 0 && <CmsImage src="" alt="" fill />}
        {images.map((src, i) => (
          <div
            key={src}
            className={cn('absolute inset-0 transition-opacity duration-500', i === index ? 'opacity-100' : 'opacity-0')}
            aria-hidden={i !== index}
          >
            <CmsImage
              src={src}
              alt={`${title} — image ${i + 1}`}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-linen/90 text-ink opacity-0 shadow-soft transition-opacity hover:bg-white group-hover:opacity-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-linen/90 text-ink opacity-0 shadow-soft transition-opacity hover:bg-white group-hover:opacity-100"
            >
              <ChevronRight className="size-5" />
            </button>
            <span className="absolute bottom-4 right-4 rounded-full bg-ink/60 px-3 py-1 text-xs text-linen backdrop-blur">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              className={cn(
                'relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-background transition-all md:w-24',
                i === index ? 'ring-ink' : 'ring-transparent opacity-60 hover:opacity-100'
              )}
            >
              <CmsImage src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
