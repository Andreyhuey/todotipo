import React, { useState } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { PremiumProducts, productCategory } from '@/constants/product.data';
import { ArrowDownRight } from 'lucide-react';
import { routes } from '@/lib/routes';
import Link from 'next/link';

export default function ProductCategory() {
  const [type, setType] = useState(0);
  const setProductType = (index: number) => {
    setType(index);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3 w-full md:w-fit p-3 rounded-md md:rounded-[200px] border border-[#EBEBEB] shadow overflow-x-auto">
        {productCategory.map((item, i) => (
          <Button
            variant={type === i ? 'default' : 'ghost'}
            key={`Aq${i}^^777@@@`}
            onClick={() => setProductType(i)}
            className={` ${
              type !== i && 'text-[#A1A3B0]'
            } body3 rounded-[29px]`}
          >
            {item.name}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6">
        {PremiumProducts.slice(3, 7).map((item, index) => (
          <Link
            href={routes.productDetails(item.category, item.id)}
            key={index}
            className="relative group w-full overflow-hidden shadow h-full"
          >
            <Image
              src={item.image}
              alt={`premium image ${index + 1}`}
              className="h-full w-full object-cover  transition-transform duration-500 group-hover:scale-110"
              height={100}
              width={100}
              unoptimized
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/20 text-white text-center px-4 py-3 opacity-0 translate-y-5 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
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
  );
}
