'use server';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { buildPaginationItems } from './utils';

interface VisitsPaginationProps {
  currentPage: number;
  totalPages: number;
}

export const VisitsPagination = async ({
  currentPage,
  totalPages,
}: VisitsPaginationProps) => {
  const paginationItems = buildPaginationItems(currentPage, totalPages);

  return (
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
  );
};
