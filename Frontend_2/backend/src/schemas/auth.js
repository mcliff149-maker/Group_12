import { z } from 'zod';

export const signInSchema = z.object({
  username: z.string().min(1, 'Username is required.'),
  password: z.string().min(1, 'Password is required.'),
  role:     z.enum(['student', 'academic', 'supervisor', 'admin'], {
    errorMap: () => ({ message: 'Invalid role.' }),
  }),
});

export const signUpSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  name:     z.string().min(1, 'Full name is required.'),
  email:    z.string().email('Enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  role:     z.enum(['student', 'academic', 'supervisor'], {
    errorMap: () => ({ message: 'Invalid role. Admin accounts must be created by an admin.' }),
  }),
});

export const createUserSchema = z.object({
  username: z.string().min(3),
  name:     z.string().min(1),
  email:    z.string().email(),
  password: z.string().min(6),
  role:     z.enum(['student', 'academic', 'supervisor', 'admin']),
});
