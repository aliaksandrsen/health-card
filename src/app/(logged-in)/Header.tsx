'use server';

import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SignOutButton } from './SignOutButton';

export default async function Header() {
  const session = await auth();

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
          {session ? (
            <>
              <Button asChild>
                <Link href="/visits/new">New Visit</Link>
              </Button>
              <div className="flex items-center space-x-4">
                <div className="text-right text-sm text-muted-foreground">
                  {session.user?.name && <div>{session.user.name}</div>}
                  <div>{session.user?.email}</div>
                </div>
                <SignOutButton />
              </div>
            </>
          ) : (
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
