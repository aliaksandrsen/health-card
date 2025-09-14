'use server';

import { passwordMatchSchema } from '@/app/validation/passwordMatchSchema';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { hash } from 'bcryptjs';
import { z } from 'zod';

export const registerUser = async ({
  email,
  name,
  password,
  passwordConfirm,
}: {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
}) => {
  try {
    const newUserSchema = z
      .object({
        email: z.email(),
        name: z.string().optional(),
      })
      .and(passwordMatchSchema);

    const newUserValues = newUserSchema.safeParse({
      email,
      name,
      password,
      passwordConfirm,
    });

    if (!newUserValues.success) {
      return {
        error: newUserValues.error.issues[0]?.message ?? 'An error occurred',
      };
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
      data: {
        name: newUserValues.data.name,
        email: newUserValues.data.email,
        password: hashedPassword,
      },
    });
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return {
          error: 'An account is already registered with this email address',
        };
      }
    }
    return {
      error: 'An error occurred.',
    };
  }
};
