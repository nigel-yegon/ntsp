// app/api/dashboard/bookings/[id]/respond/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Payload = {
  decision: "CONFIRMED" | "DECLINED";
  responseNote?: string;
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Partial<Payload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.decision !== "CONFIRMED" && body.decision !== "DECLINED") {
    return NextResponse.json(
      { error: "Decision must be CONFIRMED or DECLINED" },
      { status: 400 }
    );
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    select: { id: true, businessId: true, status: true },
  });
  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (booking.businessId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (booking.status !== "REQUESTED") {
    return NextResponse.json(
      { error: "This request has already been responded to" },
      { status: 409 }
    );
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: body.decision,
      responseNote: body.responseNote?.trim() || null,
      respondedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}