import ProductComponent from '@/components/products/product-component';
import ProductHero from '@/components/products/product-hero';
import { getMetadata } from '@/lib/get-metadata';
import { routes } from '@/lib/routes';
import { Metadata } from 'next';
import React from 'react';

export function generateMetadata(): Metadata {
  return getMetadata(routes.products());
}

export default function page() {
  return (
    <>
      <ProductHero />
      <ProductComponent />
    </>
  );
}
