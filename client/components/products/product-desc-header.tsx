import React from 'react';

interface Props {
  text?: string;
}

export default function ProductDescHeader({ text }: Props) {
  return (
    <p className="font-heading bg-[#00000033] border border-[#ebebeb] text-neutral-head font-medium text-[20px] md:text-[24px] w-full py-3 px-8">
      {text || ''}
    </p>
  );
}
