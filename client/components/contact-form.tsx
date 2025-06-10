'use client';

import { ContactUsFormSchema } from '@/lib/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import useSendMail, { MailRequest } from '@/store/mutation/useSendMail';
import { ContactDefaultValues } from '@/constants/form.data';

const ContactForm = () => {
  const form = useForm<z.infer<typeof ContactUsFormSchema>>({
    resolver: zodResolver(ContactUsFormSchema),
    defaultValues: ContactDefaultValues,
  });

  const { mutateAsync: createRequest, isPending } = useSendMail();

  const onSubmit = async (data: z.infer<typeof ContactUsFormSchema>) => {
    const payload: MailRequest = {
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
          className="flex flex-col gap-6 w-full"
        >
          {fieldDefinitions.map(({ label, name, type, placeholder }, index) => (
            <div
              key={`${index} dsdsdcsd`}
              className="flex flex-col gap-2 w-full"
            >
              <p>{label}</p>

              <FormField
                name={name}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <>
                        {type === 'note' ? (
                          <Textarea
                            placeholder={placeholder}
                            {...field}
                            className="h-[150px] w-full"
                          />
                        ) : (
                          <Input
                            placeholder={placeholder}
                            {...field}
                            className="w-full"
                          />
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
            className="min-w-[200px] text-center lg:w-fit w-full"
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
