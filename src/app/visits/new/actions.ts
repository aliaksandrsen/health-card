'use server';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function createVisit(formData: FormData) {
  const session = await getServerSession(authOptions);

  console.log('🚀 ~ createVisit ~ session:', session);

  if (!session?.user) {
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
