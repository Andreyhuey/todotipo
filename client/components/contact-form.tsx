'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send } from 'lucide-react';
import { ContactUsFormSchema } from '@/lib/validator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import useSendMail from '@/store/mutation/useSendMail';

type Values = z.infer<typeof ContactUsFormSchema>;

const fields: { name: keyof Values; label: string; placeholder: string; type?: string; autoComplete?: string; wide?: boolean }[] = [
  { name: 'name', label: 'Full name', placeholder: 'Jane Doe', autoComplete: 'name' },
  { name: 'email', label: 'Email', placeholder: 'you@company.com', type: 'email', autoComplete: 'email' },
  { name: 'phone', label: 'Phone', placeholder: '+1 555 000 0000', type: 'tel', autoComplete: 'tel' },
  { name: 'subject', label: 'Subject', placeholder: 'Samples, pricing, installation…' },
];

export default function ContactForm() {
  const form = useForm<Values>({
    resolver: zodResolver(ContactUsFormSchema),
    defaultValues: { name: '', phone: '', subject: '', email: '', message: '' },
  });
  const { mutate, isPending } = useSendMail();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutate(data, { onSuccess: () => form.reset() }))}
        className="grid gap-5 md:grid-cols-2"
      >
        <h2 className="font-display text-3xl font-light md:col-span-2">Send us a message</h2>
        {fields.map((f) => (
          <FormField
            key={f.name}
            control={form.control}
            name={f.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{f.label}</FormLabel>
                <FormControl>
                  <Input type={f.type} placeholder={f.placeholder} autoComplete={f.autoComplete} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about your project" className="min-h-40" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="md:col-span-2">
          <Button type="submit" size="lg" loading={isPending} className="w-full sm:w-auto">
            {!isPending && <Send />} Send message
          </Button>
        </div>
      </form>
    </Form>
  );
}
