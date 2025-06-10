'use client';

import React from 'react';
import Link from 'next/link';
import { companyPages, productPages, siteInfo } from '@/constants/site.data';
import moment from 'moment';
import Image from 'next/image';
import logo from '@/public/assets/footer-logo.svg';
import megaphone from '@/public/assets/megaphone.svg';
import { Button } from './ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import useSubscribe from '@/store/mutation/useSubscribe';

const contact = [
  {
    title: 'General Enquiries',
    value: siteInfo.email,
  },
  {
    title: 'Phone',
    value: siteInfo.phone,
  },
  {
    title: 'Office',
    value: siteInfo.address,
  },
];

const SubscribeSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

type SubscribeFormValues = z.infer<typeof SubscribeSchema>;

const Footer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubscribeFormValues>({
    resolver: zodResolver(SubscribeSchema),
  });

  const { mutateAsync, isPending } = useSubscribe();

  const onSubmit = (data: SubscribeFormValues) => {
    mutateAsync(data, {
      onSuccess: () => reset(), // Reset form on success
    });
  };

  return (
    <div>
      <div className="container justify-between section w-full flex flex-col gap-7 lg:flex-row">
        <div className="flex-1 w-full grid grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
          <div className="flex flex-col gap-5">
            <p className="text-neutral-head body4">Products</p>
            {productPages.map((item, index) => (
              <div key={`dcdm ${index}cdmcld}`}>
                <Link href={item.link} className="text-accent-700">
                  {item.name}
                </Link>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-neutral-head body4">Company</p>
            {companyPages.map((item, index) => (
              <div key={`dcdm ${index}c$ld}`}>
                <Link href={item.link} className="text-accent-700">
                  {item.name}
                </Link>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-neutral-head body4">Contact</p>
            {contact.map((item, index) => (
              <div key={`dm ${index}c@d}`}>
                <p className="text-accent-700">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex lg:justify-end">
          <div className="flex flex-col gap-7 items-end w-full lg:max-w-[400px]">
            <div className="flex items-center gap-6">
              <Image
                className="h-6 w-6"
                src={megaphone.src}
                alt="megaphone icon"
                width={100}
                height={100}
              />
              <p className="text-neutral-head max-w-[324px]">
                Subscribe to our newsletter to receive the latest updates from
                us
              </p>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="border rounded-[100px] py-2 pl-6 pr-2 w-full flex items-center"
              >
                <input
                  placeholder="Your email address"
                  className="w-full outline-none focus:outline-none text-sm"
                  {...register('email')}
                />
                <Button
                  type="submit"
                  variant="default"
                  loading={isPending}
                  className="rounded-[100px]"
                >
                  Subscribe
                </Button>
              </form>
              {errors.email && (
                <p className="text-red-500 text-sm text-center">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container p-20">
        <Image
          src={logo.src}
          alt="todotipo footer logo"
          className="w-full h-full"
          width={100}
          height={100}
        />
      </div>
      <div className="border-t border-primary-600 py-10 flex items-center justify-center h-full">
        <div className="flex flex-col gap-y-9 lg:flex-row justify-center container text-center text-[#6b7280]">
          <p>
            © {moment(Date.now()).format('YYYY')} {siteInfo.name} All Rights
            Reserved.
          </p>
          {/* <div className="flex justify-between gap-2">
            <Link href={routes.terms()} className="hover:text-primary-300">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href={routes.privacy()} className="hover:text-primary-300">
              Privacy Policy
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Footer;
