import React, { useState } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import {
  productCategory,
  ProductCategoryValue,
  products,
} from '@/constants/product.data';
import { ArrowDownRight } from 'lucide-react';
import { routes } from '@/lib/routes';
import Link from 'next/link';

export default function ProductCategory() {
  const [category, setCategory] = useState<ProductCategoryValue | 'all'>('all');
  const [isFading, setIsFading] = useState(false);

  const setProductType = (index: ProductCategoryValue | 'all') => {
    setIsFading(true); // start fade-out
    setTimeout(() => {
      setCategory(index); // change category after fade-out
      setIsFading(false); // fade-in
    }, 300); // match transition duration in ms
  };

  const displayedProducts =
    category === 'all'
      ? products // show all products ungrouped
      : products.filter((p) => p.category === category);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3 w-full md:w-fit p-3 rounded-md md:rounded-[200px] border border-[#EBEBEB] shadow overflow-x-auto">
        {[{ name: 'All', value: 'all' }, ...productCategory].map((item, i) => (
          <Button
            variant={category === item.value ? 'default' : 'ghost'}
            key={`btn-${i}`}
            onClick={() =>
              setProductType(item.value as ProductCategoryValue | 'all')
            }
            className={`${
              category !== item.value && 'text-[#A1A3B0]'
            } body3 transition-colors duration-300 ease-in-out rounded-[29px]`}
          >
            {item.name}
          </Button>
        ))}
      </div>
      <div
        className={`grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 transition-opacity duration-300 ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {displayedProducts.slice(0, 4).map((item, index) => (
          <Link
            href={routes.productDetails(item.category, item.id, item.title)}
            key={index}
            className="relative group w-full overflow-hidden shadow h-full"
          >
            <Image
              src={item.image}
              alt={`premium image ${index + 1}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              height={100}
              width={100}
              unoptimized
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/20 text-white text-center px-4 py-3 opacity-0 translate-y-5 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
              <div className="flex items-center justify-between">
                <p className="body2">{item.title}</p>
                <div className="p-2 flex items-center rounded-full border border-white">
                  <ArrowDownRight />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
