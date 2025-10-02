import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteVisit, getVisit } from "../actions";

export default async function Visit({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const visit = await getVisit(+id);

	if (!visit) {
		notFound();
	}

	const deleteVisitAction = deleteVisit.bind(null, visit.id);
	return (
		<div className="flex flex-1 flex-col items-center">
			<Card className="w-full max-w-3xl">
				<CardHeader>
					<CardTitle className="text-4xl">{visit.title}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-6 text-lg leading-relaxed">
						<p>{visit.content}</p>
					</div>
					<form action={deleteVisitAction} className="mt-6">
						<Button
							className="cursor-pointer"
							type="submit"
							variant="destructive"
						>
							Delete Visit
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
