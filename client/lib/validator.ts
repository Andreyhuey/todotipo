import * as z from "zod";

export const ContactUsFormSchema = z.object({
  name: z.string().min(3, { message: "Please input your name" }),
  phone: z.string().min(7, { message: "Please leave a valid phone number" }),
  subject: z.string().min(1, { message: "Please leave a subject" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z.string().min(4, { message: "Please leave a valid message" }),
});

export const PropertyRequestFormSchema = z.object({
  name: z.string().min(3, { message: "Please input your name" }),
  phone: z.string().min(7, { message: "Please leave a valid phone number" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z.string().min(4, { message: "Please leave a valid message" }),
});

export const SubscriberFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const priceFormSchema = z
  .object({
    min_price: z
      .string()
      .regex(/^\d+$/, { message: "Only valid digits are allowed" }),
    max_price: z
      .string()
      .regex(/^\d+$/, { message: "Only valid digits are allowed" }),
  })
  .refine(
    (data) => parseInt(data.max_price, 10) > parseInt(data.min_price, 10),
    {
      message: "Max price must be greater than Min price",
      path: ["max_price"],
    }
  );
