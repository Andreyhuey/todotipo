'use client';

import { about } from '@/constants/site.data';
import Image from 'next/image';
import HeroHeader from '../ui/hero-header';

export default function AboutHero() {
  return (
    <div className="hero flex flex-col gap-2">
      <div className="container section">
        <HeroHeader {...about} />
      </div>
      <Image
        src={about.image}
        className="w-full h-full"
        alt="about us"
        height={100}
        width={100}
      />
    </div>
  );
}
