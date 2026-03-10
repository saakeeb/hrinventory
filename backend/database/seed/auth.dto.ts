import { z } from 'zod';

export interface LoginDTO {
  email: string;
  password: string;
}

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginBody = z.infer<typeof loginSchema>;