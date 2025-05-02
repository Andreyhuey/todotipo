'use client';

import ProductCategory from '../product-category';
import TitleHeader from '../ui/title-header';

export default function Products() {
  return (
    <div className="container section flex flex-col gap-9">
      <TitleHeader
        title="Premium Materials Collection"
        desc="Explore our curated selection of high performance building textiles"
      />
      <ProductCategory />
    </div>
  );
}
