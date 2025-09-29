'use server';

import { Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const EmptyVisitsFallback = async () => {
  return (
    <Card className="w-full max-w-xl border-dashed text-center">
      <CardHeader className="flex flex-col items-center gap-4">
        <span className="rounded-full bg-primary/10 p-4 text-primary">
          <Stethoscope className="h-8 w-8" />
        </span>
        <CardTitle className="text-xl">No visits yet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-muted-foreground">
        <p>
          Keep track of appointments, symptoms, and treatment notes in one
          place. Log your first visit to build your health timeline.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild>
          <Link href="/visits/new">Schedule your first visit</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
