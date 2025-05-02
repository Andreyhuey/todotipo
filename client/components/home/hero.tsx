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
        <div className="container section py-[1rem] flex flex-col gap-4 lg:flex-row lg:gap-[40px] items-end justify-between h-full w-full">
          <div className="flex-1 flex flex-col items-center lg:items-start gap-14 w-full">
            <div className="flex flex-col gap-5">
              <div className="flex gap-5 w-full">
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
            <div className="bg-[#000000B2] p-3 lg:p-9 rounded-lg flex flex-col gap-[52px] w-full lg:w-[435px] border-[0.5px] border-[#808080]">
              <p className="text-[#ADADAD] body3 font-normal">
                {home.hero.desc}
              </p>
              <div className="flex justify-center gap-2 lg:gap-7 w-full">
                <Link href={home.hero.cta[1].link} className="min-w-fit">
                  <Button
                    variant="default2"
                    className="caption1 font-normal min-w-fit"
                  >
                    {home.hero.cta[1].text}
                  </Button>
                </Link>
                <Link href={home.hero.cta[2].link} className="min-w-fit">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 caption1 font-normal min-w-fit"
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
