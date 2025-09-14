export const dynamic = 'force-dynamic'; // This disables SSG and ISR

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import prisma from '@/lib/prisma';
import Link from 'next/link';

import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';

export default async function Home() {
  const session = await getServerSession(authOptions);
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
    <div className="min-h-screen flex flex-col items-center py-24 px-8">
      {visits && visits.length > 0 && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mb-8">
          {visits.map((visit) => (
            <Link key={visit.id} href={`/visits/${visit.id}`} className="group">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="group-hover:underline">
                    {visit.title}
                  </CardTitle>
                  <CardDescription>
                    by {visit.author ? visit.author.name : 'Anonymous'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-4">
                    {new Date(visit.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="leading-relaxed line-clamp-2">
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
