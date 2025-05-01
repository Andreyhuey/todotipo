import { routes } from '@/lib/routes';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
  key: string;
  details: {
    tags: string[];
    image: string;
    desc: string;
    name: string;
    id: string;
  };
}

export default function DesignCasesCard({ details, key }: Props) {
  return (
    <div
      className="flex flex-col gap-3 border border-[#ebebeb] bg-white rounded-xl"
      key={key}
    >
      <Image
        src={details.image}
        alt={details.name}
        width={100}
        height={100}
        className="w-full rounded-t-xl"
      />
      <div className="flex flex-wrap gap-2 px-5 py-3">
        {details.tags.map((item, index) => (
          <p
            className="px-3 py-1 bg-[#F4F4F4] rounded-[10px] border border-[#ebebeb]"
            key={`@@${index} &&&&&`}
          >
            {item}
          </p>
        ))}
      </div>
      <div className="flex flex-col gap-3 px-5 py-3">
        <p className="body1 text-neutral-head">{details.name}</p>
        <p className="body4 text-accent-700 font-normal">{details.desc}</p>
        <Link
          href={routes.designCaseDetails(details.id)}
          className="flex gap-1 items-center"
        >
          <p className="caption1 font-regular text-neutral-head">
            View Details
          </p>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
