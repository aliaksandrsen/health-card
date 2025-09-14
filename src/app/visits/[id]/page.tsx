export const dynamic = 'force-dynamic'; // This disables SSG and ISR

import { authOptions } from '@/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';

export default async function Visit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    notFound();
  }

  const { id } = await params;
  const visitId = parseInt(id);

  const visit = await prisma.visit.findFirst({
    where: { id: visitId, authorId: +session.user.id },
    include: {
      author: true,
    },
  });

  if (!visit) {
    notFound();
  }

  // Server action to delete the visit
  async function deleteVisit() {
    'use server';
    const sessionInner = await getServerSession(authOptions);
    if (!sessionInner?.user?.id) {
      notFound();
    }

    // Enforce ownership at deletion time
    await prisma.visit.deleteMany({
      where: {
        id: visitId,
        authorId: +sessionInner.user.id,
      },
    });

    redirect('/visits');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <Card className="max-w-3xl w-full">
        <CardHeader>
          <CardTitle className="text-4xl">{visit.title}</CardTitle>
          <CardDescription>
            by{' '}
            <span className="font-medium">
              {visit.author?.name || 'Anonymous'}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-lg leading-relaxed space-y-6">
            {visit.content ? (
              <p>{visit.content}</p>
            ) : (
              <p className="italic text-muted-foreground">
                No content available for this visit.
              </p>
            )}
          </div>
          <form action={deleteVisit} className="mt-6">
            <Button type="submit" variant="destructive">
              Delete Visit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
