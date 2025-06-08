'use client';

import { productCategory, products } from '@/constants/product.data';
import ProductCard from './product-card';
import ProductCategorySelector from './product-category-selector';

export default function ProductComponent() {
  const groupedProducts = productCategory
    .map((cat) => ({
      category: cat,
      items: products.filter((p) => p.category === cat.value),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="section container">
      <div className="flex flex-col lg:flex-row gap-7 w-full">
        <div className="w-full lg:w-3/12">
          <ProductCategorySelector />
        </div>
        <div className="w-full lg:w-9/12">
          <div className="flex flex-col gap-[30px] lg:gap-[60px] w-full">
            {groupedProducts.map((group, index) => (
              <div
                key={`${group.category.value}-${index}`}
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
                      key={`product-${index}`}
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
