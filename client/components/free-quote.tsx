import Image from 'next/image';
import { Button } from './ui/button';
import image from '@/public/assets/request-quote.svg';
import Link from 'next/link';
import { routes } from '@/lib/routes';

export default function FreeQuote() {
  return (
    <div className="bg-[#F4F4F4]">
      <div className="container section">
        <div className=" rounded-l-xl bg-white flex flex-col gap-10 md:flex-row justify-between items-center w-full">
          <div className="flex-1 flex flex-col gap-10 p-5 lg:px-20">
            <div className="flex flex-col gap-3">
              <p className="h3 text-neutral-head">Let’s Build Your Vision</p>
              <p className="body2 font-normal text-accent-700">
                Ready to create with us and our composite materials? Request a
                quote or reach out to us today!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={routes.contactUs()}>
                <Button className="caption1 font-normal">Request Quote</Button>
              </Link>
              <Link href={routes.contactUs()}>
                <Button variant="outlineBlack" className="caption1 font-normal">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 h-full w-full flex items-end justify-end">
            <Image
              src={image.src}
              alt="free quote picture"
              className="w-full h-full"
              width={100}
              height={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
