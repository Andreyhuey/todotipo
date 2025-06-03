import { home } from '@/constants/site.data';
import React from 'react';
import TitleHeader from '../ui/title-header';
import { products } from '@/constants/product.data';
import ProductCard from '../products/product-card';

// Shuffle function (Fisher–Yates)
export const shuffled = [...products].sort(() => 0.5 - Math.random());
export const shuffledProducts = shuffled.slice(0, 3);

export default function Quote() {
  return (
    <div className="flex flex-col gap-14 section">
      <div className="container text-center flex items-center justify-center max-w-[1000px]">
        <p className="text-accent-700 font-body">{home.quote}</p>
      </div>

      <div className="container flex flex-col gap-9">
        <TitleHeader title="NEW PREMIUM PRODUCTS" />
        <div className="flex flex-col md:flex-row gap-8 justify-between">
          {shuffledProducts.slice(0, 3).map((item, index) => (
            <ProductCard product={item} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
