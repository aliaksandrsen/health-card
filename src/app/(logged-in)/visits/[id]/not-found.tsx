import { Ban } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function VisitNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-muted p-6">
      <Card className="w-full max-w-lg border-destructive/30 bg-card shadow-lg">
        <CardHeader className="flex items-center gap-4 text-center">
          <div className="rounded-full bg-destructive/10 p-3 text-destructive">
            <Ban className="h-10 w-10" aria-hidden />
          </div>
          <CardTitle className="text-3xl">Visit Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            We looked everywhere but couldn&apos;t locate the visit you&apos;re
            trying to view. It may have been deleted or the link could be
            incorrect.
          </p>
          <p>
            Double-check the URL or return to the visits overview to continue
            browsing your records.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 md:flex-row md:justify-end">
          <Button asChild variant="outline" className="w-full md:w-auto">
            <Link href="/visits">Back to Visits</Link>
          </Button>
          <Button asChild className="w-full md:w-auto">
            <Link href="/visits/new">Create New Visit</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
