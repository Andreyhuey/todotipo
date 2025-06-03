import { about } from '@/constants/site.data';
import Image from 'next/image';
import React from 'react';
import DescCard from '../desc-card';

export default function Commit() {
  return (
    <div className="bg-[#F9F8F5]">
      <div className="container section flex flex-col gap-7">
        <div className="flex flex-col gap-3 justify-center text-center">
          <h3 className="h4 md:h3 font-semibold text-neutral-head">
            {about.commit.title}
          </h3>
          <p className="text-accent-700 body2 font-normal">
            {about.commit.desc}
          </p>
        </div>
        <div className="flex flex-col gap-5 lg:flex-row justify-between ">
          <div className="flex-1 h-full w-full">
            <Image
              alt={about.title}
              src={about.commit.image}
              className="h-full w-full"
              height={100}
              width={100}
            />
          </div>
          <div className="flex-1 flex flex-col gap-[54px]">
            <div className="flex flex-col gap-3">
              <h5 className="h5 font-semibold text-neutral-head">
                {about.commit.details.name}
              </h5>
              <p className="text-accent-700 body3 font-normal">
                {about.commit.details.desc}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
              {about.commit.details.list.map((item, index) => (
                <DescCard details={item} key={`769!${index} ##45`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
