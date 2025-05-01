import { home } from '@/constants/site.data';
import React from 'react';

export default function Quote() {
  return (
    <div className="container section text-center flex items-center justify-center max-w-[1000px]">
      <p className="text-accent-700 font-body">{home.quote}</p>
    </div>
  );
}
