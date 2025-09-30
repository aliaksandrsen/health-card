'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

type FetchVisitsInput = {
  skip: number;
  take: number;
};

export const fetchVisits = async ({ skip, take }: FetchVisitsInput) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const userId = +session.user.id;

  const [visits, totalVisits] = await Promise.all([
    prisma.visit.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      where: { userId },
    }),
    prisma.visit.count({
      where: { userId },
    }),
  ]);

  return { visits, totalVisits };
};

export const getVisit = async (visitId: number) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const userId = +session.user.id;

  return prisma.visit.findFirst({
    where: { id: visitId, userId },
  });
};

export const createVisit = async (formData: FormData) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const userId = +session.user.id;

  const title = formData.get('title');
  const content = formData.get('content');

  if (typeof title !== 'string' || typeof content !== 'string') {
    throw new Error('Unexpected form data');
  }

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle || !trimmedContent) {
    // TODO useFormState
    throw new Error('Title and content are required');
  }

  await prisma.visit.create({
    data: {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      userId,
    },
  });

  redirect('/visits');
};

export const deleteVisit = async (visitId: number) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const userId = +session.user.id;

  await prisma.visit.delete({
    where: {
      id: visitId,
      userId,
    },
  });

  redirect('/visits');
};
