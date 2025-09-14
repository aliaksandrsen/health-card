'use server';

import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id ? +session.user.id : null;

  const visits = userId
    ? await prisma.visit.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        where: { authorId: userId },
        include: { author: { select: { name: true } } },
      })
    : [];

  return (
    <div className="flex min-h-screen flex-col items-center px-8 py-24">
      {visits && visits.length > 0 && (
        <div className="mb-8 grid w-full max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visits.map((visit) => (
            <Link key={visit.id} href={`/visits/${visit.id}`} className="group">
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle>{visit.title}</CardTitle>
                  {/* <CardDescription>{visit.author.name}</CardDescription> */}
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-xs text-muted-foreground">
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
      )}
    </div>
  );
}
