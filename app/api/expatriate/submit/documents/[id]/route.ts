// app/api/documents/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getObjectStream, deleteObject } from "@/lib/storage";

const REVIEWER_ROLES = new Set([
  "PERUSER",
  "VERIFIER",
  "COMMITTEE_MEMBER",
  "PERMANENT_SECRETARY",
  "ADMIN",
]);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const doc = await prisma.document.findUnique({
    where: { id },
    include: { application: { select: { submittedById: true, status: true } } },
  });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = doc.application.submittedById === session.user.id;
  const isReviewer = REVIEWER_ROLES.has(session.user.role);
  const isAdmin = session.user.role === "ADMIN";

  const canView =
    isAdmin ||
    isReviewer ||
    (isOwner && session.user.role === "EMPLOYER");

  if (!canView) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (isReviewer && !isAdmin && doc.application.status === "DRAFT") {
    return NextResponse.json({ error: "Application has not been submitted" }, { status: 403 });
  }

  let stream: ReadableStream<Uint8Array>;
  try {
    stream = await getObjectStream(doc.storageKey);
  } catch (err) {
    console.error(`[documents/${id}] storage read failed`, err);
    return NextResponse.json({ error: "File unavailable" }, { status: 502 });
  }

  return new NextResponse(stream, {
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Disposition": `inline; filename="${sanitizeFileName(doc.fileName)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const doc = await prisma.document.findUnique({
    where: { id },
    select: {
      id: true,
      storageKey: true,
      application: { select: { submittedById: true, status: true } },
    },
  });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = doc.application.submittedById === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  const canDelete =
    isAdmin ||
    (isOwner && session.user.role === "EMPLOYER" && doc.application.status === "DRAFT");

  if (!canDelete) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await deleteObject(doc.storageKey);
  await prisma.document.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}

function sanitizeFileName(name: string): string {
  return name.replace(/[\r\n"\\/]/g, "_");
}