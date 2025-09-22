import type { NextAuthConfig } from 'next-auth';

const PUBLIC_ROUTES = new Set<string>(['/login', '/register']);
const ALWAYS_ALLOW_PREFIXES = ['/_next', '/api/auth'];
const HOME_PATH = '/';

export const authConfig = {
  pages: {
    signIn: '/login',
    signOut: HOME_PATH,
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // System / technical paths that should always be allowed
      if (ALWAYS_ALLOW_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
        return true;
      }

      // Public (guest) routes. Everything else is treated as protected.
      const isPublic = PUBLIC_ROUTES.has(pathname);

      // If the user is authenticated and attempts to visit login/register — redirect to home
      if (isPublic) {
        if (isLoggedIn) {
          return Response.redirect(new URL(HOME_PATH, nextUrl));
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
  providers: [], // Providers are added to auth.ts (Node runtime)
} satisfies NextAuthConfig;
