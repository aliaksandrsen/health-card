'use server';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SignOutButton } from './SignOutButton';

type HeaderProps = {
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export default async function Header({ user }: HeaderProps) {
  return (
    <header className="w-full border-b bg-background px-8 py-4">
      <nav className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold hover:text-primary">
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
            <div className="text-right text-sm text-muted-foreground">
              <div>{user.name}</div>
              <div>{user.email}</div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
