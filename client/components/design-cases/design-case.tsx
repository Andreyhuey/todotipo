import { designCases } from '@/constants/design-case.data';
import Image from 'next/image';
import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { routes } from '@/lib/routes';

export default function DesignCase() {
  return (
    <div className="flex flex-col gap-10 lg:gap-12 section container">
      <p className="body2 font-normal text-[#667185] border-b border-[#EBEBEB] mt-8 py-1">
        Design Cases
      </p>
      {designCases.map((item, index) => (
        <div
          className="flex flex-col lg:flex-row gap-2 lg:gap-4 items-center"
          key={`${item.id}-${index}`}
        >
          <Image
            src={item.image[0]}
            width={100}
            height={100}
            alt={`image of ${item.name}`}
            className="lg:h-[333px] w-full h-full lg:w-[500px]"
            unoptimized
          />
          <div className="flex flex-col gap-5">
            <p className="h5 md:h4 text-[#344054] text-center lg:text-left">
              {item.name}
            </p>
            <p className="font-normal text-[#667185] body4">
              {item.description}
            </p>
            <Link href={routes.designCaseDetails(item.id, item.name)}>
              <Button variant="outlineBlack">Read More</Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
