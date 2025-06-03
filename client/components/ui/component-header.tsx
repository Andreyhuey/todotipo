import React from 'react';

interface Props {
  title?: string;
  desc?: string;
}

export default function ComponentHeader({ title = '', desc = '' }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-neutral-head h5 md:h4 text-center md:text-left uppercase">
        {title}
      </h3>
      <p className="text-[#6B7280] body4 font-normal">{desc}</p>
    </div>
  );
}
