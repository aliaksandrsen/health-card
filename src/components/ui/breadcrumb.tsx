import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Breadcrumb = React.forwardRef<
	HTMLElement,
	React.ComponentPropsWithoutRef<"nav">
>(({ className, ...props }, ref) => (
	<nav
		ref={ref}
		aria-label="breadcrumb"
		className={cn(
			"flex w-full items-center space-x-1 text-muted-foreground text-sm",
			className,
		)}
		{...props}
	/>
));
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<
	HTMLOListElement,
	React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
	<ol
		ref={ref}
		className={cn("flex flex-wrap items-center gap-1", className)}
		{...props}
	/>
));
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<
	HTMLLIElement,
	React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
	<li
		ref={ref}
		className={cn("inline-flex items-center gap-1", className)}
		{...props}
	/>
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
	HTMLAnchorElement,
	React.ComponentPropsWithoutRef<"a"> & { asChild?: boolean }
>(({ className, asChild, ...props }, ref) => {
	const Comp = asChild ? Slot : "a";

	return (
		<Comp
			ref={ref}
			className={cn("transition-colors hover:text-foreground", className)}
			{...props}
		/>
	);
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<
	HTMLSpanElement,
	React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
	<span
		ref={ref}
		aria-current="page"
		className={cn("font-medium text-foreground", className)}
		{...props}
	/>
));
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
	children,
	className,
}: React.HTMLAttributes<HTMLSpanElement>) => (
	<span
		role="presentation"
		className={cn("flex size-4 items-center justify-center", className)}
	>
		{children ?? <ChevronRight className="size-3" />}
	</span>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = React.forwardRef<
	HTMLSpanElement,
	React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
	<span
		ref={ref}
		className={cn("flex size-9 items-center justify-center", className)}
		{...props}
	>
		<MoreHorizontal className="size-4" />
		<span className="sr-only">More</span>
	</span>
));
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbPage,
	BreadcrumbSeparator,
	BreadcrumbEllipsis,
};
