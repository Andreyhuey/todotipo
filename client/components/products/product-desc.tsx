'use client';

import ProductCategorySelector from '@/components/products/product-category-selector';
import ShowView from '@/components/show-view';
import { ProductCategoryValue, Products } from '@/constants/product.data';
import Image from 'next/image';
import { useState } from 'react';
import ProductHero from './product-hero';

export default function ProductDesc({
  product,
  productCategory,
}: {
  product: Products;
  productCategory: ProductCategoryValue;
}) {
  const [category, setCategory] =
    useState<ProductCategoryValue>(productCategory);

  return (
    <div className="min-h-screen">
      <ProductHero />
      <div className="section container h-full">
        <div className="flex flex-col lg:flex-row gap-7 w-full">
          <div className="w-full lg:w-3/12 ">
            <ProductCategorySelector
              selected={category}
              onSelect={setCategory}
            />
          </div>
          <div className="w-full lg:w-9/12 h-full">
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <Image
              src={product.image}
              alt={product.title}
              width={100}
              height={100}
              className="w-full h-full"
            />
            <ShowView when={!!product.desc}>
              <div className="mt-4">
                {product?.desc?.map((paragraph, index) => (
                  <p key={index} className="mb-2">
                    {paragraph}
                  </p>
                ))}
              </div>
            </ShowView>
            <ShowView when={!!product.specification}>
              <div className="flex flex-col mt-6">
                {product?.specification?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-x border"
                  >
                    <div className="flex-1 w-1/2 border-r p-3">
                      <strong>{item.name}</strong>
                    </div>
                    <div className="flex-1 w-1/2">{item.value}</div>
                  </div>
                ))}
              </div>
            </ShowView>
          </div>
        </div>
      </div>
    </div>
  );
}
