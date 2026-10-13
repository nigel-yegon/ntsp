// app/api/dashboard/messages/[id]/reply/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { body?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = body.body?.trim();
  if (!text) {
    return NextResponse.json({ error: "Message body is required" }, { status: 400 });
  }

  const thread = await prisma.messageThread.findUnique({
    where: { id },
    select: { id: true, customerId: true, businessId: true },
  });
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  // Only the customer or the business that owns this thread can post.
  const isCustomer = thread.customerId === session.user.id;
  const isBusiness = thread.businessId === session.user.id;
  if (!isCustomer && !isBusiness) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const message = await prisma.message.create({
    data: {
      threadId: thread.id,
      authorId: session.user.id,
      body: text,
      // Mark as read by the author's side, unread by the other.
      readByCustomer: isCustomer,
      readByBusiness: isBusiness,
    },
  });

  await prisma.messageThread.update({
    where: { id: thread.id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json({ id: message.id });
}