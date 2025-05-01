import React from 'react';

interface Props {
  title?: string;
  desc?: string;
}

export default function TitleHeader({ title = '', desc = '' }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-neutral-head h3">{title}</h3>
      <p className="text-accent-700 body2 font-normal">{desc}</p>
    </div>
  );
}
