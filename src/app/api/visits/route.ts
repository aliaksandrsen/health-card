import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const visitsPerPage = 5;
  const offset = (page - 1) * visitsPerPage;

  // Fetch paginated visits
  const visits = await prisma.visit.findMany({
    skip: offset,
    take: visitsPerPage,
    orderBy: { createdAt: 'desc' },
    where: { userId: +session.user.id },
    include: { user: { select: { name: true } } },
  });

  const totalVisits = await prisma.visit.count({
    where: { userId: +session.user.id },
  });
  const totalPages = Math.ceil(totalVisits / visitsPerPage);

  return NextResponse.json({ visits, totalPages });
}
