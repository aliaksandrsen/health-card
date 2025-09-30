import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Header } from './components/Header';
import { UserProvider } from './user-context';

export default async function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const userId = Number.parseInt(session.user.id, 10);

  return (
    <UserProvider value={{ userId }}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header user={session.user} />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </UserProvider>
  );
}
