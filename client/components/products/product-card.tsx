import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { routes } from '@/lib/routes';
import CmsImage from '@/components/site/cms-image';
import type { Product } from '@/types/cms';

interface Props {
  product: Product;
  categoryName?: string;
}

export default function ProductCard({ product, categoryName }: Props) {
  return (
    <Link
      href={routes.productDetails(product.category, product.slug)}
      className="group flex flex-col gap-4"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-linen-300">
        <CmsImage
          src={product.image || product.gallery[0]}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute right-4 top-4 grid size-11 translate-y-1 place-items-center rounded-full bg-linen text-ink opacity-0 shadow-soft transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-5" />
        </span>
      </div>
      <div className="flex flex-col gap-1.5 px-1">
        {categoryName && categoryName !== product.title && (
          <span className="text-[11px] font-semibold uppercase tracking-eyebrow text-oak-600">
            {categoryName}
          </span>
        )}
        <h3 className="font-display text-xl font-normal leading-snug text-ink transition-colors group-hover:text-oak-700">
          {product.title}
        </h3>
        {product.summary && <p className="line-clamp-2 text-[15px] text-stone-500">{product.summary}</p>}
      </div>
    </Link>
  );
}
