'use server';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOutAction } from './actions';

export const SignOutButton = async () => {
  return (
    <form action={signOutAction}>
      <Button type="submit" className="cursor-pointer" variant="outline">
        <LogOut />
      </Button>
    </form>
  );
};
