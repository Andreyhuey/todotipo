'use client';

import { home } from '@/constants/site.data';
import TitleHeader from '../ui/title-header';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import DesignCasesCard from '../desc-cases-card';
import { Button } from '../ui/button';

export default function DesignCases() {
  return (
    <div className="container section flex flex-col gap-10">
      <TitleHeader
        title={home.designCases.title}
        desc={home.designCases.desc}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {
          // method for multiplying an array multiple times
          /* {Array(3)
          .fill(home.designCases.list)
          .flat() */

          home.designCases.list.map((item, index) => (
            <DesignCasesCard details={item} key={`${index} ##$$@22`} />
          ))
        }
      </div>
      <div className="flex items-center justify-center">
        <Link href={home.designCases.link}>
          <Button
            className="flex items-center gap-2 caption1 text-black font-normal"
            variant="outlineBlack"
          >
            <p>View all cases</p>
            <ArrowRight className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
