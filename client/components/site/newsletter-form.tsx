'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import useSubscribe from '@/store/mutation/useSubscribe';
import { SubscriberFormSchema } from '@/lib/validator';
import { Button } from '@/components/ui/button';

type Values = z.infer<typeof SubscriberFormSchema>;

export default function NewsletterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Values>({ resolver: zodResolver(SubscriberFormSchema) });
  const { mutate, isPending } = useSubscribe();

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={handleSubmit((data) => mutate(data, { onSuccess: () => reset() }))}
        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1.5 pl-5 transition-colors focus-within:border-oak-300"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="Your email address"
          autoComplete="email"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-linen placeholder:text-linen/40 focus:outline-none"
          {...register('email')}
        />
        <Button type="submit" variant="oak" loading={isPending}>
          Subscribe {!isPending && <ArrowRight />}
        </Button>
      </form>
      {errors.email && <p className="mt-2 pl-5 text-sm text-red-300">{errors.email.message}</p>}
    </div>
  );
}
