'use client';

import { routes } from '@/lib/routes';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import logo from '@/public/assets/Logo.svg';
import logo2 from '@/public/assets/Logo2.svg';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { companyPages, productPages } from '@/constants/site.data';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';

export const links = companyPages;

const Navbar = () => {
  const pathname = usePathname();

  const isHome = pathname === routes.home();
  const Color = isHome
    ? 'text-white bg-[#0E0E0ECC]'
    : 'text-neutral-head bg-white';
  const [isOpen, setIsOpen] = useState(false);

  const handleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'revert';
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 ${Color} backdrop-blur-2xl`}
    >
      <div className="container">
        {/* for medium and large screens */}
        <div className="hidden md:flex items-center justify-between py-3">
          <Link href={routes.home()} className="">
            <Image
              src={isHome ? logo.src : logo2.src}
              alt="logo"
              width={80}
              height={80}
              className="rounded-md h-[64px] w-[179px]"
              unoptimized
            />
          </Link>
          <div className="flex gap-8 items-center">
            {links.slice(0, -1).map((item, index) => (
              <div key={`${index} sdsidn$2ddas`}>
                {item.name === 'Products' ? (
                  <>
                    <NavigationMenu>
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger>
                            <p className="body4">{item.name}</p>
                          </NavigationMenuTrigger>
                          <NavigationMenuContent
                            className={`${
                              isHome ? 'bg-[#0E0E0ECC]' : 'bg-black'
                            }`}
                          >
                            <div className="flex flex-col gap-3 w-full">
                              {productPages.map((item, index) => (
                                <Link
                                  key={` 4$$6 ${index} ***&`}
                                  href={item.link}
                                  className={`capitalize hover:text-white/13 ${
                                    !isHome && 'text-white'
                                  } body4 w-full pb-1 border-b last-of-type:border-none`}
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </div>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </>
                ) : (
                  <Link
                    href={item.link}
                    className={`capitalize hover:text-white/13 body4 ${
                      item.link === pathname && 'text-primary-200'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <Link href={routes.contactUs()}>
              <Button variant="default2">Contact Us</Button>
            </Link>
          </div>
        </div>
        {/* for small screens */}

        {isOpen ? (
          <div
            className={`md:hidden fixed top-0 left-0 w-full h-screen bg-white text-black z-50 transition-transform duration-300 ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex flex-col gap-6 px-3 h-full">
              <div className="flex justify-between items-center">
                <Link href={routes.home()} onClick={handleIsOpen}>
                  <Image
                    src={logo2}
                    alt="logo"
                    width={50}
                    height={50}
                    unoptimized
                    className="h-[75px] w-[75px] rounded-2xl"
                  />
                </Link>
                <Button onClick={handleIsOpen} size="icon" variant="ghost">
                  <X className="h-8 w-8" />
                </Button>
              </div>
              <div className="flex flex-col items-center  h-full gap-10 text-[24px]">
                <div className="flex flex-col gap-7 items-center">
                  {links.slice(0, -1).map((item, index) => (
                    <div key={`${index} sdsd00))`}>
                      {item.name === 'Products' ? (
                        <>
                          <NavigationMenu>
                            <NavigationMenuList>
                              <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                  <p className="body2">{item.name}</p>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-black">
                                  <div className="flex flex-col gap-3 w-full">
                                    {productPages.map((item, index) => (
                                      <Link
                                        key={`@@@@${index} `}
                                        href={item.link}
                                        onClick={handleIsOpen}
                                        className={`capitalize hover:text-white/13 body4 w-full pb-1 border-b last-of-type:border-none`}
                                      >
                                        {item.name}
                                      </Link>
                                    ))}
                                  </div>
                                </NavigationMenuContent>
                              </NavigationMenuItem>
                            </NavigationMenuList>
                          </NavigationMenu>
                        </>
                      ) : (
                        <Link
                          href={item.link}
                          onClick={handleIsOpen}
                          className={`capitalize hover:text-white/13 body2 `}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                <Link href={routes.contactUs()} onClick={handleIsOpen}>
                  <Button className="capitalize body4">Contact Us</Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="md:hidden flex justify-between items-center py-3">
            <Link href={routes.home()} className="text-[40px]">
              <Image
                src={isHome ? logo.src : logo2.src}
                alt="logo"
                width={50}
                height={50}
                className="h-[30px] w-full"
                unoptimized
              />
            </Link>
            <Button onClick={handleIsOpen} variant="outlineBlack" size="icon">
              <Menu />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
