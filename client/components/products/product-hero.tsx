import { product } from '@/constants/site.data';
import Image from 'next/image';
import React from 'react';

type Props = {
  image?: string;
};

export default function ProductHero({ image = product.image }: Props) {
  return (
    <div className="hero flex flex-col gap-2">
      <Image
        src={image}
        className="w-full h-full"
        alt="about us"
        height={100}
        width={100}
      />
    </div>
  );
}
