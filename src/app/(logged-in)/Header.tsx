'use server';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignOutButton } from './SignOutButton';

type HeaderProps = {
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export const Header = async ({ user }: HeaderProps) => {
  return (
    <header className="w-full border-b bg-background px-8 py-4">
      <nav className="flex items-center justify-between">
        <Link href="/" className="font-bold text-xl hover:text-primary">
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
            <div className="text-right text-muted-foreground text-sm">
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
