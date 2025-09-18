'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export const SignOutButton = () => {
  return (
    <Button variant="outline" onClick={() => signOut()}>
      <LogOut />
    </Button>
  );
};
