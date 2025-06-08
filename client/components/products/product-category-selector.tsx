'use client';

import { productCategory } from '@/constants/product.data';
import { routes } from '@/lib/routes';
import Link from 'next/link';

export default function ProductCategorySelector() {
  return (
    <div className="text-[#333333] lg:sticky lg:top-20">
      <div className="bg-[#00000033] body1 px-8 py-4">Product Category</div>
      {productCategory.map((item, index) => (
        <Link
          key={`category-${index}`}
          href={`${routes.products()}#${item.value}`}
          className={`block border-x border-b border-[#EBEBEB] px-8 py-4 body2 text-left cursor-pointer`}
          role="button"
          tabIndex={0}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
