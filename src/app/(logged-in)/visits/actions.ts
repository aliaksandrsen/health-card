'use server';

import prisma from '@/lib/prisma';

type FetchVisitsInput = {
  userId: number;
  skip: number;
  take: number;
};

export async function fetchVisits({ userId, skip, take }: FetchVisitsInput) {
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
}
