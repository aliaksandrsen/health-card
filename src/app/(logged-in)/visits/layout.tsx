import type { ReactNode } from "react";

import { VisitsBreadcrumbs } from "./VisitsBreadcrumbs";

export default function VisitsLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-1 flex-col items-stretch justify-start p-8">
			<VisitsBreadcrumbs />
			{children}
		</div>
	);
}
