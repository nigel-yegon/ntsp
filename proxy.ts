// proxy.ts (project root, next to next.config.ts)
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_HOME: Record<string, string> = {
  EMPLOYER: "/services",
  CUSTOMER: "/dashboard",
  BUSINESS: "/dashboard",
  VERIFIER: "/review/perusal",
  COMMITTEE_MEMBER: "/review/committee",
  PERMANENT_SECRETARY: "/review/ps",
  ADMIN: "/admin",
};

const ROLE_PREFIXES: Record<string, string[]> = {
  EMPLOYER: ["/services"],
  CUSTOMER: ["/dashboard"],
  BUSINESS: ["/dashboard"],
  VERIFIER: [
    "/review/perusal",
    "/review/verification",
    "/services/applications",
  ],
  COMMITTEE_MEMBER: ["/review/committee", "/services/applications"],
  PERMANENT_SECRETARY: ["/review/ps", "/services/applications"],
  ADMIN: ["/admin", "/review", "/services", "/dashboard"],
};

// Routes that require login but no specific role.
// Any signed-in user can reach these.
const AUTH_ONLY_PREFIXES = ["/services/applications"];

// Routes that must never be intercepted — the middleware
// would loop if it redirected away from these.
const PUBLIC_PATHS = ["/login", "/signup"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Explicit bypass for auth pages. The matcher should already
  // exclude these, but being defensive costs nothing and prevents
  // a future matcher change from creating a redirect loop.
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Not signed in — send to login with a callback URL so the
  // post-login redirect lands them back where they were going.
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role as string | undefined;

  // Signed in but role is missing from the token. This means the
  // JWT callback in lib/auth.ts hasn't populated `role` — a config
  // problem rather than a user problem. Fail to login rather than
  // letting them into an undefined state.
  if (!role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Auth-only routes: any signed-in user passes. This is where
  // reviewers and employers both reach /services/applications
  // without needing role-specific prefixes.
  if (AUTH_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Role-restricted routes. A role with no prefixes (unexpected)
  // fails closed.
  const allowedPrefixes = ROLE_PREFIXES[role] ?? [];
  const isAllowed =
    allowedPrefixes.length > 0 &&
    allowedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!isAllowed) {
    const home = ROLE_HOME[role] ?? "/login";
    // Loop guard: if the computed redirect destination is the
    // path the user is already on (or a parent of it), allow
    // through rather than spin.
    if (pathname === home || pathname.startsWith(`${home}/`)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(home, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/services/:path*",
    "/review/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
  ],
};