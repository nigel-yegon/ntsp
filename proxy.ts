// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ROLE_HOME: Record<string, string> = {
  EMPLOYER: "/services",
  VERIFIER: "/review/perusal",
  COMMITTEE_MEMBER: "/review/committee",
  PERMANENT_SECRETARY: "/review/ps",
  ADMIN: "/admin",
  BUSINESS: "/dashboard",
  OPERATOR: "/dashboard",
  CUSTOMER: "/dashboard",
};

const ROLE_PREFIXES: Record<string, string[]> = {
  EMPLOYER: ["/services"],
  CUSTOMER: ["/dashboard"],
  BUSINESS: ["/dashboard", "/operators/pending"],
  OPERATOR: ["/dashboard", "/operators/pending"],
  VERIFIER: ["/review/perusal", "/review/verification", "/services/applications"],
  COMMITTEE_MEMBER: ["/review/committee", "/services/applications"],
  PERMANENT_SECRETARY: ["/review/ps", "/services/applications"],
  ADMIN: ["/admin", "/review", "/services", "/dashboard", "/operators"],
};

export const config = {
  matcher: [
    "/services/applications/:path*",
    "/services/expatriate/:path*",
    "/services/profile/:path*",
    "/review/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
    "/operators/pending",
  ],
};

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const role = token?.role as string | undefined;
    const userId = token?.id as string | undefined;

    if (!role || !userId) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const allowedPrefixes = ROLE_PREFIXES[role] ?? [];
    const isAllowed =
      allowedPrefixes.length === 0 ||
      allowedPrefixes.some((prefix) => pathname.startsWith(prefix));

    if (!isAllowed) {
      return NextResponse.redirect(new URL(ROLE_HOME[role] ?? "/login", req.url));
    }

    // Verification gate for BUSINESS and OPERATOR
    if (role === "BUSINESS" || role === "OPERATOR") {
      const profile = await prisma.businessProfile.findUnique({
        where: { userId },
        select: { verificationStatus: true, businessType: true },
      });

      const isTourOperator = profile?.businessType === "TOUR_OPERATOR" || role === "OPERATOR";
      const isPending = profile?.verificationStatus !== "APPROVED";

      if (isTourOperator && isPending) {
        if (pathname !== "/operators/pending") {
          return NextResponse.redirect(new URL("/operators/pending", req.url));
        }
      } else {
        if (pathname === "/operators/pending") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);