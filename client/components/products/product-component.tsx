'use client';

import {
  productCategory,
  ProductCategoryValue,
  products,
} from '@/constants/product.data';
import { useEffect, useState } from 'react';
import ProductCard from './product-card';
import ProductCategorySelector from './product-category-selector';
import { smoothScrollTo } from '@/lib/smooth-scroll';

export default function ProductComponent() {
  const getInitialCategory = (): ProductCategoryValue => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      // Validate the hash value against productCategory list or 'all'
      if (hash === 'all' || productCategory.some((cat) => cat.value === hash)) {
        return hash as ProductCategoryValue;
      }
    }
    return 'all';
  };

  const [category, setCategory] =
    useState<ProductCategoryValue>(getInitialCategory);

  const groupedProducts = productCategory
    .filter((cat) => category === 'all' || cat.value === category)
    .map((cat) => ({
      category: cat,
      items: products.filter((p) => p.category === cat.value),
    }))
    .filter((group) => group.items.length > 0);

  useEffect(() => {
    const targetCategory = category === 'all' ? 'decking' : category;

    const scrollToCategory = () => {
      const el = document.getElementById(targetCategory);
      if (el) {
        const yOffset = -80; // adjust based on your navbar height
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        smoothScrollTo(y, 600);
      }
    };

    const timeout = setTimeout(scrollToCategory, 100); // delay ensures DOM is ready
    return () => clearTimeout(timeout);
  }, [category]);

  return (
    <div className="section container">
      <div className="flex flex-col lg:flex-row gap-7 w-full">
        <div className="w-full  lg:w-3/12">
          <ProductCategorySelector selected={category} onSelect={setCategory} />
        </div>
        <div className="w-full lg:w-9/12">
          <div className="flex flex-col gap-[30px] lg:gap-[60px] w-full">
            {groupedProducts.map((group) => (
              <div
                key={group.category.value}
                className="flex flex-col gap-6"
                id={group.category.value}
              >
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
