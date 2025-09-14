'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Visit {
  id: number;
  title: string;
  content?: string;
  createdAt: string;
  author?: {
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
        <div className="flex items-center justify-center space-x-2 min-h-[200px]">
          <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <>
          {visits.length === 0 ? (
            <p className="text-muted-foreground">No visits available.</p>
          ) : (
            <ul className="space-y-6 w-full max-w-4xl mx-auto">
              {visits.map((visit) => (
                <li
                  key={visit.id}
                  className="border p-6 rounded-lg shadow-md bg-card"
                >
                  <Link
                    href={`/visits/${visit.id}`}
                    className="text-2xl font-semibold hover:underline"
                  >
                    {visit.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    by {visit.author?.name || 'Anonymous'}
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
          <div className="flex justify-center space-x-4 mt-8">
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
    <div className="min-h-screen flex flex-col items-center justify-start p-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-3 text-muted-foreground">Loading page...</p>
          </div>
        }
      >
        <VisitsList />
      </Suspense>
    </div>
  );
}
