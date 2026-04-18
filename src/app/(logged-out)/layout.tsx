import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";

type LoggedOutLayoutProps = {
	readonly children: React.ReactNode;
};

export default async function LoggedOutLayout({
	children,
}: LoggedOutLayoutProps) {
	const session = await getSession();

	if (session?.user?.id) {
		redirect("/");
	}

	return <>{children}</>;
}
