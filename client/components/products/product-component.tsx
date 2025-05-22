'use client';

import {
  productCategory,
  ProductCategoryValue,
  products,
} from '@/constants/product.data';
import { useState } from 'react';
import ProductCard from '../product-card';

export default function ProductComponent() {
  const [category, setCategory] = useState<ProductCategoryValue>('all');

  const groupedProducts = productCategory
    .filter((cat) => category === 'all' || cat.value === category)
    .map((cat) => ({
      category: cat,
      items: products.filter((p) => p.category === cat.value),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="section container">
      <div className="flex flex-col lg:flex-row gap-7 w-full">
        <div className="w-full  lg:w-3/12">
          <div className="text-[#333333] lg:sticky lg:top-20">
            <div className="bg-[#00000033] body1 px-8 py-6">
              Product Category
            </div>
            {productCategory.map((item, index) => (
              <button
                key={` sdndf${index}jvnkefv`}
                onClick={() => setCategory(item.value)}
                className="border-x border-b border-[#EBEBEB] px-8 py-4 body2 w-full text-left"
              >
                <p>{item.name}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-9/12">
          <div className="flex flex-col gap-[30px] lg:gap-[60px] w-full">
            {groupedProducts.map((group) => (
              <div key={group.category.value} className="flex flex-col gap-6">
                <h4 className="h5 md:h4 text-neutral-head font-medium bg-[#F4F4F4] py-3 px-8 border border-[#ebebeb] w-full">
                  {group.category.name}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {group.items.map((product, index) => (
                    <ProductCard
                      product={product}
                      key={` dd${index}fvdfvnkd`}
                      info
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
