import ProductComponent from '@/components/products/product-component';
import ProductHero from '@/components/products/product-hero';
import React from 'react';

export default function page() {
  return (
    <>
      <ProductHero />
      <ProductComponent />
    </>
  );
}
