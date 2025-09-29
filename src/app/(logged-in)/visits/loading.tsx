import { Skeleton } from '@/components/ui/skeleton';
import { VISITS_PER_PAGE } from './const';

export default function VisitsLoading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-start p-8">
      <ul className="mx-auto w-full max-w-4xl space-y-6">
        {Array.from({ length: VISITS_PER_PAGE }).map((_, index) => (
          <li
            key={`visit-skeleton-${
              // biome-ignore lint/suspicious/noArrayIndexKey: ok
              index
            }`}
            className="rounded-lg border bg-card p-6 shadow-md"
          >
            <Skeleton className="h-6 w-3/4" />
            <div className="mt-4 space-y-2 text-muted-foreground text-sm">
              <Skeleton className="h-2 w-32" />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
