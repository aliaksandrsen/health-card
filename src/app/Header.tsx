'use server';

import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SignOutButton } from './SignOutButton';

export default async function Header() {
  const session = await auth();

  // console.log('🚀 ~ Header ~ session:', session);

  return (
    <header className="w-full border-b bg-background py-4 px-8">
      <nav className="flex justify-between items-center">
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
                <div className="text-sm text-muted-foreground text-right">
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
