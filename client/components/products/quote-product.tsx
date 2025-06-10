import { X } from 'lucide-react';
import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ProjectTypeEnum,
  projectTypes,
  QuoteProductFormSchema,
} from '@/lib/validator';
import { Button } from '../ui/button';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import useQuoteProduct, {
  QuoteProductRequest,
} from '@/store/mutation/useQuoteProduct';

interface Props {
  name: string;
  link: string;
  close: () => void;
}

const QuoteProduct = ({ close, name, link }: Props) => {
  const form = useForm<z.infer<typeof QuoteProductFormSchema>>({
    resolver: zodResolver(QuoteProductFormSchema),
    defaultValues: {
      name,
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

  const { mutateAsync, isPending } = useQuoteProduct();

  const onSubmit = async (data: z.infer<typeof QuoteProductFormSchema>) => {
    const payload: QuoteProductRequest = { ...data, link };

    mutateAsync(payload, {
      onSuccess: () => {
        form.reset(); // optional: reset form
        close(); // close modal after success
      },
    });
  };
  return (
    <div className="flex flex-col gap-5 bg-white w-full lg:max-w-[600px] overflow-y-auto">
      <div className="flex items-center justify-between gap-6 py-4 px-6 border-[#EBEBEB] border-[0.5px]">
        <div className="flex flex-col gap-2 max-w-[450px]">
          <h1 className="body2 text-[#333333]">
            Request a Quote for this Product
          </h1>
          <p className="caption1 text-neutral-500">
            Fill out the details below to receive a personalized quote for the
            product you’re viewing.
          </p>
        </div>
        <button
          className="cursor-pointer text-[#344054] hover:text-red-500 h-[10px] w-[10px] rounded-full"
          onClick={close}
        >
          <X />
        </button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col py-4 px-6 gap-6"
        >
          <div className="flex flex-col gap-2">
            <p>Product Name</p>

            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <Input
                        {...field}
                        disabled
                        className="bg-[#F0F2F5] border border-[#D0D5DD]"
                      />
                      <FormMessage />
                    </>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <p>Full Name</p>

            <FormField
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <Input
                        {...field}
                        className="bg-[#F0F2F5] border border-[#D0D5DD]"
                        placeholder="Your Full Name"
                      />
                      <FormMessage />
                    </>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex md:flex-row flex-col gap-6 w-full">
            <div className="flex flex-col gap-2 w-full">
              <p>Phone</p>

              <FormField
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <>
                        <Input
                          placeholder="Your Mobile Number"
                          className="w-full"
                          {...field}
                        />
                        <FormMessage />
                      </>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <p>Email</p>

              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <>
                        <Input
                          placeholder="Email address"
                          className="w-full"
                          {...field}
                        />
                        <FormMessage />
                      </>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex md:flex-row flex-col gap-6 w-full">
            <div className="flex flex-col gap-2 w-full">
              <p>Address</p>

              <FormField
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <>
                        <Input
                          placeholder="Your home address"
                          className="w-full"
                          {...field}
                        />

                        <FormMessage />
                      </>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <p>City</p>

              <FormField
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <>
                        <Input placeholder="Your city" {...field} />
                        <FormMessage />
                      </>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p>Quantity</p>

            <FormField
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <Input
                        placeholder="Number of units or square footage required"
                        {...field}
                      />
                      <FormMessage />
                    </>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <p>Project Type</p>

            <FormField
              name="projectType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-wrap gap-2"
                    >
                      {projectTypes.map((type) => (
                        <ToggleGroupItem
                          key={type}
                          value={type}
                          className="px-3 py-1 border border-[#EBEBEB] rounded text-[#667185] data-[state=on]:text-[#333333] data-[state=on]:border-black w-full"
                        >
                          {type}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <p>Additional Message</p>

            <FormField
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <Textarea
                        placeholder={`We'd love to hear from you`}
                        {...field}
                        className="h-[150px]"
                      />
                      <FormMessage />
                    </>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="min-w-[200px] text-center w-full lg:w-fit"
            loading={isPending}
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default QuoteProduct;
