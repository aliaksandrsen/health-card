// import { getToken } from 'next-auth/jwt';
// import type { NextRequest } from 'next/server';
// import { NextResponse } from 'next/server';

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Public routes that do not require auth
//   const isPublicRoute =
//     pathname.startsWith('/login') ||
//     pathname.startsWith('/register') ||
//     pathname.startsWith('/api/auth') ||
//     pathname.startsWith('/_next') ||
//     pathname.startsWith('/favicon.ico');

//   if (isPublicRoute) {
//     return NextResponse.next();
//   }

//   // Get token from NextAuth (JWT); requires NEXTAUTH_SECRET
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   if (!token) {
//     const loginUrl = new URL('/login', req.url);
//     // Preserve where the user was trying to go
//     loginUrl.searchParams.set(
//       'callbackUrl',
//       req.nextUrl.pathname + req.nextUrl.search,
//     );
//     return NextResponse.redirect(loginUrl);
//   }

//   return NextResponse.next();
// }

// // Apply to all routes except API and the listed public ones
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|register).*)'],
// };

export { auth as middleware } from '@/auth';
