import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVisit } from "../../actions";
import EditVisitForm from "./EditVisitForm";

export default async function EditVisitPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const visit = await getVisit(+id);

	if (!visit) {
		notFound();
	}

	return (
		<div className="flex flex-1 flex-col items-center">
			<Card className="w-full max-w-3xl">
				<CardHeader>
					<CardTitle>Edit Visit</CardTitle>
				</CardHeader>
				<CardContent>
					<EditVisitForm
						visit={{
							id: visit.id,
							title: visit.title,
							content: visit.content,
						}}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
