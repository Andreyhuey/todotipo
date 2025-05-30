'use client';

import {
  productCategory,
  ProductCategoryValue,
} from '@/constants/product.data';
import { routes } from '@/lib/routes';
import Link from 'next/link';

type ProductCategorySelectorProps = {
  selected: ProductCategoryValue;
  onSelect: (value: ProductCategoryValue) => void;
};

export default function ProductCategorySelector({
  selected,
  onSelect,
}: ProductCategorySelectorProps) {
  return (
    <div className="text-[#333333] lg:sticky lg:top-20">
      <div className="bg-[#00000033] body1 px-8 py-6">Product Category</div>
      {productCategory.map((item, index) => (
        <Link
          key={`category-${index}`}
          href={`${routes.products()}#${item.value}`}
        >
          <button
            onClick={() => onSelect(item.value)}
            className={`border-x border-b border-[#EBEBEB] px-8 py-4 body2 w-full text-left cursor-pointer ${
              selected === item.value ? 'bg-[#f4f4f4]' : ''
            }`}
          >
            {item.name}
          </button>
        </Link>
      ))}
    </div>
  );
}
