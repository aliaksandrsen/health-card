import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type VisitPreviewCardProps = {
	visit: {
		id: number;
		title: string;
		content: string | null;
		createdAt: Date;
	};
	href?: string;
};

export const VisitPreviewCard = ({
	visit,
	href = `/visits/${visit.id}`,
}: VisitPreviewCardProps) => {
	return (
		<Link href={href} className="group block h-full">
			<Card className="transition-shadow hover:shadow-lg">
				<CardHeader>
					<CardTitle>{visit.title}</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="mb-4 text-muted-foreground text-xs">
						{new Date(visit.createdAt).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
					<p className="line-clamp-2 text-muted-foreground leading-relaxed">
						{visit.content}
					</p>
				</CardContent>
			</Card>
		</Link>
	);
};
