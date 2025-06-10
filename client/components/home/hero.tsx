'use client';

import { home } from '@/constants/site.data';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import NextImage from 'next/image';

export default function Hero() {
  const slides = home.hero.slider;
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Preload images
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, [slides]);

  useEffect(() => {
    if (!isPaused) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 7000);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, isPaused, slides.length]);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <>
      <div
        className="relative min-h-screen w-full flex flex-col items-center justify-center hero overflow-hidden"
        onClick={togglePause}
      >
        {/* Background layers */}
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <NextImage
                src={slide.image}
                alt={`Slide ${index}`}
                fill
                priority={index === 0}
                className="object-cover"
                quality={100} // max clarity
              />
            </div>
          );
        })}
        <div className="relative z-10 container section py-[1rem] flex flex-col gap-4 lg:flex-row lg:gap-[40px] items-end justify-between h-full w-full">
          <div className="flex flex-col items-center lg:items-start gap-14 w-full">
            <div className="flex flex-col gap-5">
              <div className="flex gap-5 w-full">
                {home.hero.tag.map((item, index) => (
                  <p
                    className="text-white body4 font-normal"
                    key={`index ${index} sdsdcscd`}
                  >
                    {item}
                  </p>
                ))}
              </div>
              <h1 className="text-white h5 lg:h3 shadow-3xl transition-opacity duration-1000">
                {slides[currentIndex].title}
              </h1>
            </div>
            <div className="bg-[#000000a1] p-3 lg:p-9 rounded-lg flex flex-col gap-6 w-full md:w-[435px] border-[0.5px] border-[#808080]">
              <p className="text-[#ADADAD] body3 font-normal">
                {home.hero.desc}
              </p>
              <div className="flex justify-center gap-2 md:gap-5 w-full">
                <Link href={home.hero.cta[1].link} className="w-full">
                  <Button
                    variant="default2"
                    className="caption1 font-normal w-full"
                  >
                    {home.hero.cta[1].text}
                  </Button>
                </Link>
                <Link href={home.hero.cta[2].link} className="w-full group">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 caption1 font-normal w-full"
                  >
                    <p>{home.hero.cta[2].text}</p>
                    <ArrowRight className="h-3 w-3 transform transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className=""></div>
        </div>
      </div>
    </>
  );
}
