import { home } from '@/constants/site.data';
import Image from 'next/image';
import React from 'react';
import TitleHeader from '../ui/title-header';
import { PremiumProducts } from '@/constants/product.data';
import { routes } from '@/lib/routes';
import Link from 'next/link';
import { ArrowDownRight } from 'lucide-react';

export default function Quote() {
  return (
    <div className="flex flex-col gap-14 section">
      <div className="container text-center flex items-center justify-center max-w-[1000px]">
        <p className="text-accent-700 font-body">{home.quote}</p>
      </div>

      <div className="container flex flex-col gap-9">
        <TitleHeader title="NEW PREMIUM PRODUCTS" />
        <div className="flex flex-col md:flex-row gap-8 justify-between">
          {PremiumProducts.slice(0, 3).map((item, index) => (
            <Link
              href={routes.productDetails(item.id)}
              key={index}
              className="relative group w-full overflow-hidden"
            >
              <Image
                src={item.image}
                alt={`premium image ${index + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                height={100}
                width={100}
                unoptimized
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/20 text-white text-center px-4 py-2 opacity-0 translate-y-5 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
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
    </div>
  );
}
