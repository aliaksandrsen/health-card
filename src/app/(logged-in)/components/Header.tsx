import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "./SignOutButton";

type HeaderProps = {
	user: {
		id: string;
		email: string;
		name: string;
	};
};

export const Header = ({ user }: HeaderProps) => {
	return (
		<header className="bg-background w-full border-b px-8 py-4">
			<nav className="flex items-center justify-between">
				<Link href="/" className="hover:text-primary text-xl font-bold">
					Health Card
				</Link>
				<div className="flex items-center space-x-4">
					<Button asChild>
						<Link href="/visits">Visits</Link>
					</Button>

					<Button asChild>
						<Link href="/visits/new">New Visit</Link>
					</Button>
					<div className="flex items-center space-x-4">
						<div className="text-muted-foreground text-right text-sm">
							<div>{user.name}</div>
							<div>{user.email}</div>
						</div>
						<SignOutButton />
					</div>
				</div>
			</nav>
		</header>
	);
};
