'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Hide header on login and register pages
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

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
                <Button variant="destructive" onClick={() => signOut()}>
                  Sign Out
                </Button>
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
