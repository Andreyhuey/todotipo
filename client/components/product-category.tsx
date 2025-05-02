import React, { useState } from 'react';
import { Button } from './ui/button';
import Image from 'next/image';

export default function ProductCategory() {
  const [type, setType] = useState(0);
  const setProductType = (index: number) => {
    setType(index);
  };
  const labels = [
    { name: 'Decking', value: 'decking' },
    { name: 'WPC flooring', value: 'wpc flooring' },
    { name: 'Wall Panels', value: 'wall panels' },
    { name: 'Ceilings', value: 'ceilings' },
    { name: 'Fencing', value: 'fencing' },
    { name: 'Gates', value: 'gates' },
  ];

  const images = [
    '/assets/decking1.png',
    '/assets/decking2.png',
    '/assets/decking3.png',
    '/assets/decking4.png',
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3 w-full md:w-fit p-3 rounded-md md:rounded-[200px] border border-[#EBEBEB] shadow overflow-x-auto">
        {labels.map((item, i) => (
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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
        {images.map((item, index) => (
          <Image
            src={item}
            alt={`product image ${1}`}
            className="h-full w-full"
            height={100}
            width={100}
            key={` s${index}555%%%32 `}
            unoptimized
          />
        ))}
      </div>
    </div>
  );
}
