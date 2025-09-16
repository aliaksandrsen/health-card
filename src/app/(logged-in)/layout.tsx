import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Header from './Header';

export default async function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div>
      <Header user={session.user} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
