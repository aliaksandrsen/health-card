'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { EmptyVisitsFallback } from '@/components/EmptyVisitsFallback';
import { VisitPreviewCard } from '@/components/VisitPreviewCard';
import prisma from '@/lib/prisma';
import { PREVIEW_COUNT } from './const';

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const userId = +session.user.id;

  const visits = userId
    ? await prisma.visit.findMany({
        orderBy: { createdAt: 'desc' },
        take: PREVIEW_COUNT,
        where: { userId: userId },
      })
    : [];

  const hasVisits = visits.length > 0;

  return (
    <div className="flex flex-1 flex-col items-center p-8">
      {hasVisits ? (
        <div className="mb-8 grid w-full max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visits.map((visit) => (
            <VisitPreviewCard key={visit.id} visit={visit} />
          ))}
        </div>
      ) : (
        <EmptyVisitsFallback />
      )}
    </div>
  );
}
