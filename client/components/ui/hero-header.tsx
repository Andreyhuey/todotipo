import React from 'react';

interface Props {
  tag?: string;
  title?: string;
  desc?: string;
}

export default function HeroHeader({ tag = '', title = '', desc = '' }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {tag && (
        <div className="flex items-center gap-2 text-neutral-head">
          <span className="w-2">•</span>
          <p className="body4 font-normal">{tag}</p>
        </div>
      )}
      <h3 className="text-neutral-head h4 md:h3 text-center md:text-left">
        {title}
      </h3>
      <p className="text-[#6B7280] body3 font-normal">{desc}</p>
    </div>
  );
}
