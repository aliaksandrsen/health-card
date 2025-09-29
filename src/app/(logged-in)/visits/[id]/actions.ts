'use server';

import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

type DeleteVisitInput = {
  visitId: number;
};

export const deleteVisit = async ({ visitId }: DeleteVisitInput) => {
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  await prisma.visit.deleteMany({
    where: {
      id: visitId,
      userId: +session.user.id,
    },
  });

  redirect('/visits');
};
