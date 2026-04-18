import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = new Set<string>(["/login", "/register"]);
const HOME_PATH = "/";

export function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	const { pathname } = request.nextUrl;
	const isLoggedIn = Boolean(sessionCookie);
	const isPublicRoute = PUBLIC_ROUTES.has(pathname);

	if (isPublicRoute && isLoggedIn) {
		return NextResponse.redirect(new URL(HOME_PATH, request.url));
	}

	if (!isPublicRoute && !isLoggedIn) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		{
			source: "/",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
		{
			source: "/login",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
		{
			source: "/register",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
		{
			source: "/visits/:path*",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
	],
};
