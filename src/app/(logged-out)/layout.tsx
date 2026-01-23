import { redirect } from "next/navigation";
import { auth } from "@/auth";

type LoggedOutLayoutProps = {
	readonly children: React.ReactNode;
};

export default async function LoggedOutLayout({
	children,
}: LoggedOutLayoutProps) {
	const session = await auth();

	if (session?.user?.id) {
		redirect("/");
	}

	return <>{children}</>;
}
