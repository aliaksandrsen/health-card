'use server';

import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';

export default async function Visit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const { id } = await params;
  const visitId = parseInt(id);

  const visit = await prisma.visit.findFirst({
    where: { id: visitId, userId: +session.user.id },
    include: {
      user: true,
    },
  });

  if (!visit) {
    notFound();
  }

  // Server action to delete the visit
  async function deleteVisit() {
    'use server';
    const session = await auth();
    if (!session?.user?.id) {
      notFound();
    }

    // Enforce ownership at deletion time
    await prisma.visit.deleteMany({
      where: {
        id: visitId,
        userId: +session.user.id,
      },
    });

    redirect('/visits');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-4xl">{visit.title}</CardTitle>
          <CardDescription>
            by{' '}
            <span className="font-medium">
              {visit.user?.name || 'Anonymous'}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 text-lg leading-relaxed">
            {visit.content ? (
              <p>{visit.content}</p>
            ) : (
              <p className="text-muted-foreground italic">
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
