'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createVisit(formData: FormData) {
  const session = await auth();

  console.log('🚀 ~ createVisit ~ session:', session);

  if (!session?.user?.id) {
    throw new Error('You must be logged in to create a visit');
  }

  await prisma.visit.create({
    data: {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      authorId: +session.user.id,
    },
  });

  redirect('/visits');
}
