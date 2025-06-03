'use client';

import { about } from '@/constants/site.data';
import Image from 'next/image';

export default function AboutHero() {
  return (
    <div className="hero flex flex-col gap-6 md:gap-10 lg:gap-16">
      <Image
        src={about.image}
        className="w-full h-full"
        alt="about us"
        height={100}
        width={100}
      />
      <div className="container flex flex-col gap-3">
        <h3 className="text-neutral-head h4 md:h3 text-center md:text-left">
          {about.title}
        </h3>
        {about.desc.map((item, index) => (
          <p
            className="text-[#6B7280] body4 font-normal"
            key={` ${index}dcdcd `}
          >
            {' '}
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
