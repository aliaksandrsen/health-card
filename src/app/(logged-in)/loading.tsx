import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PREVIEW_COUNT } from './const';

export default function HomeLoading() {
  return (
    <div className="flex flex-1 flex-col items-center p-8">
      <div className="mb-8 grid w-full max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: PREVIEW_COUNT }).map((_, index) => (
          <Card
            key={`home-visit-skeleton-${
              // biome-ignore lint/suspicious/noArrayIndexKey: predictable list
              index
            }`}
            className="shadow-md transition-shadow"
          >
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-5">
              <Skeleton className="h-3 w-24" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
