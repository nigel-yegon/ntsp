// middleware.ts (project root, next to next.config.ts)
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const ROLE_HOME: Record<string, string> = {
  EMPLOYER: "/services",
  VERIFIER: "/review/perusal",
  COMMITTEE_MEMBER: "/review/committee",
  PERMANENT_SECRETARY: "/review/ps",
  ADMIN: "/admin",
};

const ROLE_PREFIXES: Record<string, string[]> = {
  EMPLOYER: ["/services"],
  CUSTOMER: ["/dashboard"],
  BUSINESS: ["/dashboard"],
  VERIFIER: ["/review/perusal", "/review/verification", "/services/applications"],
  COMMITTEE_MEMBER: ["/review/committee", "/services/applications"],
  PERMANENT_SECRETARY: ["/review/ps", "/services/applications"],
  ADMIN: ["/admin", "/review", "/services", "/dashboard"],
};

export const config = {
  matcher: [
    "/services/:path*",
    "/review/:path*",
    "/admin/:path*",
    "/dashboard/:path*",  // ← new
  ],
};

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role as string | undefined;

    if (!role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const allowedPrefixes = ROLE_PREFIXES[role] ?? [];
    const isAllowed =
      allowedPrefixes.length === 0 ||
      allowedPrefixes.some((prefix) => pathname.startsWith(prefix));

    if (!isAllowed) {
      return NextResponse.redirect(
        new URL(ROLE_HOME[role] ?? "/login", req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);
