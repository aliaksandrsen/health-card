'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

type FetchVisitsInput = {
  skip: number;
  take: number;
};

export const fetchVisits = async ({ skip, take }: FetchVisitsInput) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = +session.user.id;

  const [visits, totalVisits] = await Promise.all([
    prisma.visit.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      where: { userId },
      include: { user: { select: { name: true } } },
    }),
    prisma.visit.count({
      where: { userId },
    }),
  ]);

  return { visits, totalVisits };
};
