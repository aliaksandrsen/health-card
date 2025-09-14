'use server';

import { signIn } from '@/auth';
// import { signIn } from '@/auth';
import z from 'zod';

export const loginWithCredentials = async ({
  email,
  password,
  // token,
}: {
  email: string;
  password: string;
  // token?: string;
}) => {
  const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(4),
  });

  const loginValidation = loginSchema.safeParse({
    email,
    password,
  });

  if (!loginValidation.success) {
    return {
      error: loginValidation.error.issues[0]?.message ?? 'An error occurred',
    };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      // token,
      redirect: false,
    });
  } catch (e) {
    console.error('Error during login:', e);
    return {
      error: 'Incorrect email or password',
    };
  }
};
