import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import GoBackBtn from '@/components/go-back-button';
import { routes } from '@/lib/routes';
import { Undo2 } from 'lucide-react';
import notfound from '@/public/assets/404.jpg';

export const metadata: Metadata = {
  title: 'Page not found | EasyRentProps',
};

export default function NotFound() {
  return (
    <>
      <div className="container  py-0 overflow-hidden items-center flex lg:flex-row flex-col justify-center bg-white text-black min-h-screen">
        <div className="py-[60px] flex-1 flex justify-center text-center flex-col mx-auto h-max relative">
          <h2 className="text-[28px] xs:text-[32px] md:text-[56px] py-5 ">
            Uh oh! We can&apos;t find this page
          </h2>
          <p className="text-base md:text-[20px] ">
            We couldn&apos;t find the page you were looking for, but don&apos;t
            worry! Here are some options to help you get back on track.
          </p>

          <div className="flex flex-col xs:flex-row gap-4 my-20 font-medium text-base w-full">
            <GoBackBtn className="flex items-center justify-center gap-2 py-3 px-6 md:px-16 rounded-full bg-primary text-back w-full">
              <Undo2 />
              <p>Go Back</p>
            </GoBackBtn>

            <Link
              href={routes.home()}
              className="flex items-center gap-2 py-3 px-6 md:px-16 bg-primary-main rounded-full hover:text-primary-400 text-black w-full"
            >
              Take Me Home
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex w-full h-full flex-1">
          <div className="relative w-full aspect-video [&>img]:object-contain ">
            <Image
              src={notfound.src}
              alt="error 404"
              fill
              className="h-full w-full"
              unoptimized
            />
          </div>
        </div>
      </div>
    </>
  );
}
