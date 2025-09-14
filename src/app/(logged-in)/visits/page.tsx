'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface Visit {
  id: number;
  title: string;
  content?: string;
  createdAt: string;
  user: {
    name: string;
  };
}

// Disable static generation
export const dynamic = 'force-dynamic';

function VisitsList() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');

  const [visits, setVisits] = useState<Visit[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVisits() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/visits?page=${page}`);
        if (!res.ok) {
          throw new Error('Failed to fetch visits');
        }
        const data = await res.json();
        setVisits(data.visits);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching visits:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVisits();
  }, [page]);

  return (
    <>
      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center space-x-2">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <>
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
                    className="text-2xl font-semibold hover:underline"
                  >
                    {visit.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    by {visit.user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
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

          {/* Pagination Controls */}
          <div className="mt-8 flex justify-center space-x-4">
            {page > 1 && (
              <Link href={`/visits?page=${page - 1}`}>
                <Button variant="secondary">Previous</Button>
              </Link>
            )}
            {page < totalPages && (
              <Link href={`/visits?page=${page + 1}`}>
                <Button variant="secondary">Next</Button>
              </Link>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default function VisitsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-8">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="ml-3 text-muted-foreground">Loading page...</p>
          </div>
        }
      >
        <VisitsList />
      </Suspense>
    </div>
  );
}
