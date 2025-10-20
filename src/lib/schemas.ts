import { z } from 'zod';

export const createPaymentSchema = z.object({
  amount: z
    .number()
    .positive({ message: 'Amount must be a positive number' }),
  method: z.enum(['card', 'upi'], {
    message: 'Invalid payment method. Must be "card" or "upi"',
  }),
  customerEmail: z
    .string()
    .email({ message: 'Invalid customer email address' }),
});

export const signupSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});