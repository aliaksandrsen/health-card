import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { VISITS_PER_PAGE } from "./const";

export default function VisitsLoading() {
	return (
		<div className="flex flex-1 flex-col items-center justify-start">
			<ul className="mx-auto w-full max-w-4xl space-y-6">
				{Array.from({ length: VISITS_PER_PAGE }).map((_, index) => (
					<li
						key={`visit-skeleton-${
							// biome-ignore lint/suspicious/noArrayIndexKey: ok
							index
						}`}
					>
						<Card className="shadow-md transition-shadow">
							<CardHeader>
								<Skeleton className="h-6 w-3/4" />
							</CardHeader>
							<CardContent className="space-y-5">
								<Skeleton className="h-3 w-28" />
								<div className="space-y-3">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-5/6" />
								</div>
							</CardContent>
						</Card>
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
