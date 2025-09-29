'use server';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { EmptyVisitsFallback } from '@/components/EmptyVisitsFallback';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';

const PREVIEW_COUNT = 6;

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
            <Link key={visit.id} href={`/visits/${visit.id}`} className="group">
              <Card className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle>{visit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground text-xs">
                    {new Date(visit.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="line-clamp-2 leading-relaxed">
                    {visit.content || 'No content available.'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyVisitsFallback />
      )}
    </div>
  );
}
