'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function createVisit(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('You must be logged in to create a visit');
  }

  await prisma.visit.create({
    data: {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      userId: +session.user.id,
    },
  });

  redirect('/visits');
}
