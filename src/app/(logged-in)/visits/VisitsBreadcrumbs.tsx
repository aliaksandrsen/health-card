"use client";

import { usePathname } from "next/navigation";

import {
	type BreadcrumbEntry,
	PageBreadcrumbs,
} from "@/components/PageBreadcrumbs";
import { cn } from "@/lib/utils";

const baseItems = [
	{ label: "Home", href: "/" },
	{ label: "Visits", href: "/visits" },
] as BreadcrumbEntry[];

type VisitsBreadcrumbsProps = {
	readonly className?: string;
};

export function VisitsBreadcrumbs({ className }: VisitsBreadcrumbsProps) {
	const pathname = usePathname();
	const path = pathname?.split("?")[0] ?? "";

	let items = baseItems;

	switch (true) {
		case path === "/visits/new":
			items = [...baseItems, { label: "New Visit" }];
			break;
		case path.startsWith("/visits/") &&
			path !== "/visits" &&
			!path.startsWith("/visits/new"):
			items = [...baseItems, { label: "Visit" }];
			break;
		default:
			break;
	}

	return (
		<PageBreadcrumbs
			items={items}
			className={cn("w-full self-start", className)}
		/>
	);
}
