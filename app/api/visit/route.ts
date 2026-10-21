// app/api/visit/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Fire-and-forget visitor counter. Called from the client beacon
 * on first paint of a session — the client dedupes via
 * sessionStorage so refreshes don't double count.
 */
export async function POST() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  try {
    await prisma.siteVisit.upsert({
      where: { day: today },
      create: { day: today, count: 1 },
      update: { count: { increment: 1 } },
    });
  } catch (err) {
    console.error("[visit] counter failed", err);
  }

  return NextResponse.json({ ok: true });
}