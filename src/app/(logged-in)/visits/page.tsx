'use server';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import prisma from '@/lib/prisma';

const VISITS_PER_PAGE = 5;

type VisitsPageSearchParams = {
  [key: string]: string | string[] | undefined;
  page?: string | string[];
};

export default async function VisitsPage({
  searchParams,
}: {
  searchParams?: VisitsPageSearchParams;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const pageParam = searchParams?.page;
  const parsedPage = Array.isArray(pageParam)
    ? parseInt(pageParam[0] ?? '1', 10)
    : parseInt(pageParam ?? '1', 10);
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const offset = (currentPage - 1) * VISITS_PER_PAGE;

  const [visits, totalVisits] = await Promise.all([
    prisma.visit.findMany({
      skip: offset,
      take: VISITS_PER_PAGE,
      orderBy: { createdAt: 'desc' },
      where: { userId: +session.user.id },
      include: { user: { select: { name: true } } },
    }),
    prisma.visit.count({
      where: { userId: +session.user.id },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalVisits / VISITS_PER_PAGE));

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-8">
      {visits.length === 0 ? (
        <p className="text-muted-foreground">No visits available.</p>
      ) : (
        <ul className="mx-auto w-full max-w-4xl space-y-6">
          {visits.map((visit) => (
            <li
              key={visit.id}
              className="rounded-lg border bg-card p-6 shadow-md"
            >
              <Link
                href={`/visits/${visit.id}`}
                className="font-semibold text-2xl hover:underline"
              >
                {visit.title}
              </Link>
              <p className="text-muted-foreground text-sm">
                by {visit.user.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {new Date(visit.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </li>
          ))}
        </ul>
      )}

      <Pagination className="mt-8">
        <PaginationContent>
          {currentPage > 1 ? (
            <PaginationItem>
              <PaginationPrevious href={`/visits?page=${currentPage - 1}`} />
            </PaginationItem>
          ) : null}

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href={`/visits?page=${page}`}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {currentPage < totalPages ? (
            <PaginationItem>
              <PaginationNext href={`/visits?page=${currentPage + 1}`} />
            </PaginationItem>
          ) : null}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
