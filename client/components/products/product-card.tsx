'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight } from 'lucide-react';
import { routes } from '@/lib/routes';

type ProductCard = {
  id: string | number;
  image: string;
  title: string;
  category: string;
};

export default function ProductCard({
  product,
  info = false,
}: {
  product: ProductCard;
  info?: boolean;
}) {
  return (
    <Link
      href={routes.productDetails(product.category, product.id, product.title)}
      className="relative group w-full overflow-hidden"
    >
      <Image
        src={product.image}
        alt={product.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        height={100}
        width={100}
        unoptimized
      />
      <div
        className={`absolute bottom-0 left-0 right-0 ${
          info ? 'bg-[#00000080]' : 'bg-black/20'
        } text-white text-center px-4 ${
          info ? 'py-4' : 'py-2'
        } transition-all duration-500 ease-in-out
          ${
            info
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-5 group-hover:translate-y-0 group-hover:opacity-100'
          }
        `}
      >
        <div className="flex items-center justify-between">
          <p className={info ? 'caption1' : 'body2'}>{product.title}</p>
          {!info && (
            <div className="p-2 flex items-center rounded-full border border-white">
              <ArrowDownRight />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
