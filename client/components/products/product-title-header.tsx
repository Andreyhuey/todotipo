import React from 'react';

interface Props {
  text?: string;
}

export default function ProductTitleHeader({ text }: Props) {
  return (
    <p className="font-heading text-center bg-[#F4F4F4] border border-[#ebebeb] text-neutral-head font-medium text-[32px] w-full py-3 px-8">
      {text || ''}
    </p>
  );
}
