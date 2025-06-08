import * as z from 'zod';
import phone from 'phone';
export const projectTypes = [
  'Residential',
  'Commercial',
  'Public Space',
  'Outdoor',
] as const;

export const ContactUsFormSchema = z.object({
  name: z.string().min(3, { message: 'Please input your name' }),
  phone: z
    .string()
    .trim()
    .refine(
      (num) => {
        if (/^\d+$/.test(num)) {
          num = `+${num}`;
        }

        const result = phone(num);
        return result.isValid;
      },
      {
        message:
          'Phone number must be a valid international number e.g., +1 (857) 533-7773',
      }
    ),
  subject: z.string().min(1, { message: 'Please leave a subject' }),
  email: z.string().email({ message: 'Invalid email address' }),
  message: z.string().min(4, { message: 'Please leave a valid message' }),
});

export const SubscriberFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export const QuoteProductFormSchema = z.object({
  name: z.string().min(3, { message: 'Please input your name' }),

  phone: z
    .string()
    .trim()
    .refine(
      (num) => {
        if (/^\d+$/.test(num)) num = `+${num}`;
        const result = phone(num);
        return result.isValid;
      },
      {
        message:
          'Phone number must be a valid international number e.g., +1 (857) 533-7773',
      }
    ),

  email: z.string().email({ message: 'Invalid email address' }),
  projectType: z.enum(projectTypes, {
    errorMap: () => ({ message: 'Please select a project type' }),
  }),

  address: z.string().min(3, { message: 'Please input a valid address' }),

  city: z.string().min(2, { message: 'Please input a valid city' }),

  quantity: z.string().refine((val) => /^\d+$/.test(val) && Number(val) > 0, {
    message: 'Quantity must be a positive number',
  }),

  message: z.string().min(4, { message: 'Please leave a valid message' }),
});
