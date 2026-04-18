import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import { Header } from "./components/Header";

type LoggedInLayoutProps = {
	readonly children: React.ReactNode;
};

export default async function LoggedInLayout({
	children,
}: LoggedInLayoutProps) {
	const session = await getSession();

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div className="bg-background flex min-h-screen flex-col">
			<Header user={session.user} />
			<main className="flex flex-1 flex-col">{children}</main>
		</div>
	);
}
