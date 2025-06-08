import Image from 'next/image';
import React from 'react';

export interface CoreValuesCardProps {
  details: {
    image: string;
    desc: string;
    name: string;
    bg: string;
  };
}

export default function CoreValuesCard({ details }: CoreValuesCardProps) {
  return (
    <div
      className="relative min-h-[400px] w-full overflow-hidden bg-cover bg-center rounded-lg shadow-lg group"
      style={{
        backgroundImage: `url(${details.bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Darken overlay (slight opacity always, stronger on hover) */}
      <div className="absolute inset-0 bg-black bg-opacity-70 transition duration-500 group-hover:bg-opacity-60 z-0" />

      {/* Default Centered Content */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3
          transition-opacity duration-700 ease-in-out
          group-hover:opacity-0 group-hover:translate-y-[-10px]"
      >
        <Image
          src={details.image}
          alt={details.name}
          width={52}
          height={52}
          className="h-[52px] w-[52px]"
        />
        <p className="body1 font-medium text-white drop-shadow-md">
          {details.name}
        </p>
      </div>

      {/* Hover Content with Slide-in from Bottom-Right */}
      <div
        className="absolute inset-0 z-20 flex flex-col gap-6 bg-black bg-opacity-60 p-8 shadow-xl text-white
          opacity-0 translate-x-8 translate-y-8
          group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0
          transition-all duration-1000 ease-in-out pointer-events-none group-hover:pointer-events-auto"
      >
        <div className="flex flex-col gap-3">
          <Image
            src={details.image}
            alt={details.name}
            width={52}
            height={52}
            className="h-[52px] w-[52px]"
          />
          <p className="body1 font-medium">{details.name}</p>
        </div>
        <p className="body3 font-normal">{details.desc}</p>
      </div>
    </div>
  );
}
