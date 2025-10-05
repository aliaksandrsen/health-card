import { EmptyVisitsFallback } from "@/components/EmptyVisitsFallback";
import { VisitPreviewCard } from "@/components/VisitPreviewCard";
import { getRecentVisits } from "./actions";

export default async function Home() {
	const visits = await getRecentVisits();

	const hasVisits = visits.length > 0;

	return (
		<div className="flex flex-1 flex-col items-center p-8">
			My test preview
			{hasVisits ? (
				<div className="mb-8 grid w-full max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
					{visits.map((visit) => (
						<VisitPreviewCard key={visit.id} visit={visit} />
					))}
				</div>
			) : (
				<EmptyVisitsFallback />
			)}
		</div>
	);
}
