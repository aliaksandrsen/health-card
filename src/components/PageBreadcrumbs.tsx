import Link from "next/link";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export type BreadcrumbEntry = {
	label: string;
	href?: string;
};

type PageBreadcrumbsProps = {
	readonly items: BreadcrumbEntry[];
	readonly className?: string;
};

export function PageBreadcrumbs({ items, className }: PageBreadcrumbsProps) {
	if (items.length === 0) {
		return null;
	}

	return (
		<Breadcrumb className={cn("mb-6", className)}>
			<BreadcrumbList>
				{items.map((item, index) => {
					const isLast = index === items.length - 1;

					return (
						<BreadcrumbItem key={`${item.label}-${index}`}>
							{isLast || !item.href ? (
								<BreadcrumbPage>{item.label}</BreadcrumbPage>
							) : (
								<BreadcrumbLink asChild>
									<Link href={item.href}>{item.label}</Link>
								</BreadcrumbLink>
							)}
							{!isLast && <BreadcrumbSeparator />}
						</BreadcrumbItem>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
