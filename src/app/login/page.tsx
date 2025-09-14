'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const response = await signIn('credentials', {
        ...Object.fromEntries(formData),
        redirect: false,
      });

      if (response?.error) {
        setError('Invalid credentials');
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Sign in to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="text-destructive text-center text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link
              href="/register"
              className="text-primary text-sm underline-offset-4 hover:underline"
            >
              No account? Register.
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
