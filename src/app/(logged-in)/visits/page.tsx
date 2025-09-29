'use server';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { fetchVisits } from './actions';
import { VISITS_PER_PAGE } from './const';
import { buildPaginationItems } from './utils';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function VisitsPage(props: {
  searchParams: SearchParams;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }
  const { page } = await props.searchParams;
  const pageStr = Array.isArray(page) ? page[0] : page;

  const parsedPage = parseInt(pageStr ?? '1', 10);
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const offset = (currentPage - 1) * VISITS_PER_PAGE;

  const { visits, totalVisits } = await fetchVisits({
    userId: +session.user.id,
    skip: offset,
    take: VISITS_PER_PAGE,
  });

  const totalPages = Math.max(1, Math.ceil(totalVisits / VISITS_PER_PAGE));
  const paginationItems = buildPaginationItems(currentPage, totalPages);

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

          {paginationItems.map((item, index) => {
            if (item === 'ellipsis') {
              return (
                <PaginationItem
                  key={`ellipsis-${
                    // biome-ignore lint/suspicious/noArrayIndexKey : it's static
                    index
                  }`}
                  aria-hidden
                >
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            const pageHref = `/visits?page=${item}`;

            return (
              <PaginationItem key={item}>
                <PaginationLink href={pageHref} isActive={item === currentPage}>
                  {item}
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
