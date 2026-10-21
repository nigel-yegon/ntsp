// app/components/review/require-role.ts — expected shape
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import type { Role } from "@/lib/workflow";

export async function requireRole(allowed: Role[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if (!allowed.includes(session.user.role as Role)) {
    redirect("/dashboard");   // or throw new Error("Forbidden")
  }
  return session.user;
}