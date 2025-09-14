import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Header from './Header';

export default async function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <div>
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
