import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';
import { deleteVisit } from './actions';

export default async function Visit({ params }: PageProps<'/visits/[id]'>) {
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const { id } = await params;

  const visit = await prisma.visit.findFirst({
    where: { id: +id, userId: +session.user.id },
    include: {
      user: true,
    },
  });

  if (!visit) {
    notFound();
  }

  const deleteVisitAction = deleteVisit.bind(null, { visitId: visit.id });

  return (
    <div className="flex flex-1 flex-col items-center p-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-4xl">{visit.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 text-lg leading-relaxed">
            <p>{visit.content}</p>
          </div>
          <form action={deleteVisitAction} className="mt-6">
            <Button type="submit" variant="destructive">
              Delete Visit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
