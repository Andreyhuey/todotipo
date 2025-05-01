import { home } from '@/constants/site.data';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <>
      <div
        className="bg-cover bg-center min-h-screen w-full flex flex-col items-center justify-center hero"
        style={{
          backgroundImage: `url(${home.hero.heroImage})`,
        }}
      >
        <div className="container py-[1rem] flex flex-col gap-4 md:flex-row lg:gap-[40px] items-end justify-between h-full">
          <div className="flex-1 flex flex-col gap-14">
            <div className="flex flex-col gap-5">
              <div className="flex gap-5">
                {home.hero.tag.map((item, index) => (
                  <p
                    className="text-white body4 font-normal"
                    key={`index ${index} sdsdcscd`}
                  >
                    {item}
                  </p>
                ))}
              </div>
              <h1 className="text-white h5 lg:h3">{home.hero.title}</h1>
            </div>
            <div className="bg-[#000000B2] p-9 rounded-lg flex flex-col gap-[52px] w-full lg:w-[435px] border-[0.5px] border-[#808080]">
              <p className="text-[#ADADAD] body3 font-normal">
                {home.hero.desc}
              </p>
              <div className="flex gap-7">
                <Link href={home.hero.cta[1].link}>
                  <Button variant="default2" className="caption1 font-normal">
                    {home.hero.cta[1].text}
                  </Button>
                </Link>
                <Link href={home.hero.cta[2].link}>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 caption1 font-normal"
                  >
                    <p>{home.hero.cta[2].text}</p>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex-1"></div>
        </div>
      </div>
    </>
  );
}
