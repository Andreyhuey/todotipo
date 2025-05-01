import Image from 'next/image';
import React from 'react';

interface Props {
  key: string;
  details: {
    image: string;
    desc: string;
    name: string;
  };
}

export default function DescCard({ details, key }: Props) {
  return (
    <div
      className="flex flex-col gap-6 border border-[#ebebeb] bg-white rounded-xl p-8"
      key={key}
    >
      <div className="flex flex-col gap-3">
        <Image
          src={details.image}
          alt={details.name}
          width={100}
          height={100}
          className="h-[52px] w-[52px]"
        />
        <p className="body1 font-medium text-neutral-head">{details.name}</p>
      </div>
      <p className="text-accent-700 body3 font-normal">{details.desc}</p>
    </div>
  );
}
