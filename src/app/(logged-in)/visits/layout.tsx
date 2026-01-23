import type { ReactNode } from "react";

import { VisitsBreadcrumbs } from "./VisitsBreadcrumbs";

type VisitsLayoutProps = {
	readonly children: ReactNode;
};

export default function VisitsLayout({ children }: VisitsLayoutProps) {
	return (
		<div className="flex flex-1 flex-col items-stretch justify-start p-8">
			<VisitsBreadcrumbs />
			{children}
		</div>
	);
}
