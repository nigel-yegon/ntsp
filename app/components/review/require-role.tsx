// app/components/review/require-role.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Role } from "@/lib/db-types";

export async function requireRole(roles: Role[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login?next=/review/perusal");
  }
  if (!roles.includes(session.user.role)) {
    redirect("/review/forbidden");
  }
  return session.user;
}