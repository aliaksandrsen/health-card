import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    signOut: '/',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Public (guest) routes. Everything else is treated as protected.
      const publicRoutes = ['/login', '/register'];
      const isPublic = publicRoutes.includes(pathname);

      // System / technical paths that should always be allowed
      if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/auth') ||
        pathname === '/favicon.ico'
      ) {
        return true;
      }

      // If the user is authenticated and attempts to visit login/register — redirect to home
      if (isPublic) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/', nextUrl));
        }
        return true; // guest is allowed
      }

      // Remaining routes require authentication
      if (!isLoggedIn) {
        // Return false — NextAuth will redirect to pages.signIn ('/login')
        return false;
        // Or explicitly:
        // return Response.redirect(new URL('/login', nextUrl));
      }

      return true; // Authenticated and not on a guest route
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
