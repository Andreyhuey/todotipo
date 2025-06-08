'use client';

import { PriceDefaultValues } from '@/constants/form.data';
import { ContactUsFormSchema } from '@/lib/validator';
import useCreateContactRequest, {
  ContactRequest,
} from '@/store/mutation/useCreateContact';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

const ContactForm = () => {
  const form = useForm<z.infer<typeof ContactUsFormSchema>>({
    resolver: zodResolver(ContactUsFormSchema),
    defaultValues: PriceDefaultValues,
  });

  const { mutateAsync: createRequest, isPending } = useCreateContactRequest();

  const onSubmit = async (data: z.infer<typeof ContactUsFormSchema>) => {
    const payload: ContactRequest = {
      ...data,
    };

    await createRequest(payload, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  const fieldDefinitions = [
    {
      label: 'Full Name',
      name: 'name',
      placeholder: 'Your full name.',
    },
    {
      label: 'Phone Number',
      name: 'phone',
      placeholder: 'Your Mobile number',
    },
    {
      label: 'Email',
      name: 'email',
      placeholder: 'Email address',
    },
    {
      label: 'Subject',
      name: 'subject',
      placeholder: 'Please input a subject',
    },
    {
      label: 'Message',
      name: 'message',
      placeholder: `We'd love to hear from you`,
      type: 'note',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      <p className="text-neutral-head h4">Contact Us</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          {fieldDefinitions.map(({ label, name, type, placeholder }, index) => (
            <div key={`${index} dsdsdcsd`} className="flex flex-col gap-2">
              <p>{label}</p>

              <FormField
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <>
                        {type === 'note' ? (
                          <Textarea
                            placeholder={placeholder}
                            {...field}
                            className="h-[150px]"
                          />
                        ) : (
                          <Input placeholder={placeholder} {...field} />
                        )}
                        <FormMessage />
                      </>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))}
          <Button
            type="submit"
            className="min-w-[200px] text-center w-fit"
            loading={isPending}
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
