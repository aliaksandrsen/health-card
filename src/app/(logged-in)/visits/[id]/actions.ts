'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export const getVisit = async (visitId: number) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = +session.user.id;

  return prisma.visit.findFirst({
    where: { id: visitId, userId },
  });
};

export const deleteVisit = async (visitId: number) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = +session.user.id;

  await prisma.visit.deleteMany({
    where: {
      id: visitId,
      userId,
    },
  });

  redirect('/visits');
};
