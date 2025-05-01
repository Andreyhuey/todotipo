'use client';

import { about } from '@/constants/site.data';
import Image from 'next/image';

export default function AboutHero() {
  return (
    <div className="hero">
      <div className="container section flex flex-col gap-14">
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
          <h1 className="flex-1 h5Regular lg:h2Regular text-primary-900">
            {about.title}
          </h1>
          <p className="flex-1 text-primary-500 md:bodyLargeRegular bodyRegularMedium">
            {about.desc}
          </p>
        </div>
        <Image
          src={about.image}
          className="w-full h-full rounded-xl"
          alt="about us"
          height={100}
          width={100}
        />
      </div>
    </div>
  );
}
