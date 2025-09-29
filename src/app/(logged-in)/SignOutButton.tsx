'use server';

import { LogOut } from 'lucide-react';
import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';

async function signOutAction() {
  'use server';
  await signOut({ redirectTo: '/login' });
}

export async function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" className="cursor-pointer" variant="outline">
        <LogOut />
      </Button>
    </form>
  );
}
