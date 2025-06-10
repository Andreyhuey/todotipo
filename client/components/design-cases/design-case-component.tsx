import { DesignCaseProps, designCases } from '@/constants/design-case.data';
import { routes } from '@/lib/routes';
import { toSlug } from '@/lib/toSlug';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
  designCase: DesignCaseProps;
}

export default function DesignCaseComponent({ designCase }: Props) {
  const currentIndex = designCases.findIndex((p) => p.id === designCase.id);

  // Get previous and next designCases if they exist
  const prevCase = currentIndex > 0 ? designCases[currentIndex - 1] : null;
  const nextCase =
    currentIndex < designCases.length - 1
      ? designCases[currentIndex + 1]
      : null;

  return (
    <div className="min-h-screen section container flex flex-col gap-8">
      <p className="body2 font-normal text-[#667185] border-b border-[#EBEBEB] mt-8 py-1">
        Design Cases {`<<`} {designCase.name}
      </p>
      <div className="flex flex-col gap-7 w-full">
        <p className="h4 text-neutral-700 ">{designCase.name}</p>
        <div className="flex md:flex-row flex-col gap-2 md:items-center">
          <p className="text-neutral-700 body4">
            Overview :{' '}
            <span className="text-[#6B7280] font-normal">
              {designCase.overview}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap md:flex-row gap-2 items-center">
          <p className="text-neutral-800 body4">Settings : </p>
          {designCase.settings.map((item, index) => (
            <p
              key={`${item}-${index}`}
              className="text-[#6B7280] bg-[#F4F4F4] border-[0.5px] border-[#EBEBEB] px-3 py-1 rounded-[10px] w-fit"
            >
              {item}
            </p>
          ))}
        </div>
        <div className="">
          <p className="text-neutral-700 body4 w-fit flex-shrink-0">
            Description :{' '}
            <span className="text-[#6B7280] font-normal">
              {designCase.description}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-neutral-800 body4">Highlights</p>
          <ul className="flex flex-col gap-1 list-inside">
            {designCase.highlights.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="text-[#667185] list-disc font-normal"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap md:flex-row gap-2 items-center">
          <p className="text-neutral-800 body4">Audience : </p>
          {designCase.audience.map((item, index) => (
            <p
              key={`${item}-${index}`}
              className="text-[#6B7280] bg-[#F4F4F4] border-[0.5px] border-[#EBEBEB] px-3 py-1 rounded-[10px]"
            >
              {item}
            </p>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          {designCase.image &&
            designCase.image.map((item, index) => (
              <Image
                src={item}
                key={`${index}-${item}`}
                alt={`image of ${index}-${item}`}
                width={100}
                height={100}
                className="w-full h-full"
                unoptimized
              />
            ))}
        </div>
        {/* Prev/Next navigation */}
        <div className="flex justify-between gap-2 mt-3">
          {prevCase ? (
            <Link
              href={routes.designCaseDetails(
                prevCase.id,
                toSlug(prevCase.name)
              )}
              className="btn-prev px-4 py-2 border rounded hover:bg-gray-100"
            >
              ← Previous: {prevCase.name}
            </Link>
          ) : (
            <div className="btn-prev px-4 py-2 border rounded bg-gray-300">
              Previous: None
            </div>
          )}

          {nextCase ? (
            <Link
              href={routes.designCaseDetails(
                nextCase.id,
                toSlug(nextCase.name)
              )}
              className="btn-prev px-4 py-2 border rounded hover:bg-gray-100"
            >
              Next: {nextCase.name} →
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
