import { EmptyVisitsFallback } from "@/components/EmptyVisitsFallback";
import { VisitPreviewCard } from "@/components/VisitPreviewCard";
import { fetchVisits } from "./actions";
import { VISITS_PER_PAGE } from "./const";
import { VisitsPagination } from "./VisitsPagination";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function VisitsPage(props: {
	searchParams: SearchParams;
}) {
	const { page } = await props.searchParams;
	const pageStr = Array.isArray(page) ? page[0] : page;

	const parsedPage = parseInt(pageStr ?? "1", 10);
	const currentPage =
		Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
	const offset = (currentPage - 1) * VISITS_PER_PAGE;

	const { visits, totalVisits } = await fetchVisits({
		skip: offset,
		take: VISITS_PER_PAGE,
	});

	const totalPages = Math.max(1, Math.ceil(totalVisits / VISITS_PER_PAGE));

	return (
		<div className="flex flex-1 flex-col items-center justify-start p-8">
			{visits.length === 0 ? (
				<EmptyVisitsFallback />
			) : (
				<div className="mx-auto w-full max-w-4xl space-y-6">
					{visits.map((visit) => (
						<VisitPreviewCard key={visit.id} visit={visit} />
					))}
				</div>
			)}

			<VisitsPagination currentPage={currentPage} totalPages={totalPages} />
		</div>
	);
}
