import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Header } from "./components/Header";

type LoggedInLayoutProps = {
	readonly children: React.ReactNode;
};

export default async function LoggedInLayout({
	children,
}: LoggedInLayoutProps) {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Header user={session.user} />
			<main className="flex flex-1 flex-col">{children}</main>
		</div>
	);
}
