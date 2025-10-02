import { Skeleton } from "@/components/ui/skeleton";

export default function VisitLoading() {
	return (
		<div className="flex flex-1 flex-col items-center p-8">
			<div className="w-full max-w-3xl">
				<div className="rounded-lg border bg-card p-6 shadow-md">
					<Skeleton className="h-10 w-2/3" />

					<div className="mt-6 space-y-4">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-5/6" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-2/3" />
					</div>

					<div className="mt-8 flex justify-start">
						<Skeleton className="h-10 w-32" />
					</div>
				</div>
			</div>
		</div>
	);
}
