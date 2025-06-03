'use client';

import ProductCategory from '../products/product-category';
import TitleHeader from '../ui/title-header';

export default function Products() {
  return (
    <div className=" bg-[#F7F6F2]">
      <div className="container section flex flex-col gap-9">
        <TitleHeader title="PRODUCT COLLECTIONS" />
        <ProductCategory />
      </div>
    </div>
  );
}
