import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin")) return NextResponse.next();
  const cookie = req.cookies.get("admin-auth")?.value;
  if (cookie === process.env.ADMIN_PASSWORD) return NextResponse.next();
  return NextResponse.redirect(new URL("/admin-login", req.url));
}

export const config = { matcher: ["/admin/:path*"] };