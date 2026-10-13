'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ProjectTypeEnum, projectTypes, QuoteProductFormSchema } from '@/lib/validator';
import useQuoteProduct from '@/store/mutation/useQuoteProduct';
import { cn } from '@/lib/utils';

type Values = z.infer<typeof QuoteProductFormSchema>;

interface Props {
  productName: string;
  link: string;
  trigger?: React.ReactNode;
}

export default function QuoteDialog({ productName, link, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(QuoteProductFormSchema),
    defaultValues: {
      name: productName,
      fullname: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      quantity: '',
      message: '',
      projectType: ProjectTypeEnum.Residential,
    },
  });
  const { mutate, isPending } = useQuoteProduct();

  const onSubmit = (data: Values) =>
    mutate(
      { ...data, link },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      }
    );

  const field = (name: keyof Values, label: string, placeholder: string, props: React.ComponentProps<'input'> = {}) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...props} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="lg" variant="oak">
            <FileText /> Request a quote
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-3xl p-0 sm:max-w-2xl">
        <div className="border-b border-border bg-linen px-6 py-6 md:px-8">
          <DialogTitle className="font-display text-2xl font-light text-ink">Request a quote</DialogTitle>
          <DialogDescription className="mt-1 text-stone-500">
            Tell us about your project and we&apos;ll send a tailored quote for <strong className="text-ink">{productName}</strong>.
          </DialogDescription>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 px-6 py-6 md:grid-cols-2 md:px-8">
            <div className="md:col-span-2">{field('fullname', 'Full name', 'Jane Doe', { autoComplete: 'name' })}</div>
            {field('email', 'Email', 'you@company.com', { type: 'email', autoComplete: 'email' })}
            {field('phone', 'Phone', '+1 555 000 0000', { type: 'tel', autoComplete: 'tel' })}
            {field('address', 'Project address', 'Street address', { autoComplete: 'street-address' })}
            {field('city', 'City', 'City')}
            <div className="md:col-span-2">
              {field('quantity', 'Quantity', 'Units or square footage', { inputMode: 'numeric' })}
            </div>
            <FormField
              control={form.control}
              name="projectType"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Project type</FormLabel>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {projectTypes.map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => field.onChange(type)}
                        aria-pressed={field.value === type}
                        className={cn(
                          'rounded-xl border px-3 py-3 text-sm transition-colors',
                          field.value === type
                            ? 'border-ink bg-ink text-linen'
                            : 'border-border text-stone-600 hover:border-stone-400'
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Project details</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Dimensions, colours, timeline…" className="min-h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end md:col-span-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="default" size="lg" loading={isPending}>
                Send request
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
