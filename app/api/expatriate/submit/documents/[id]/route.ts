// app/api/documents/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getObjectStream } from "@/lib/storage";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const doc = await prisma.document.findUnique({
    where: { id },
    include: { application: true },
  });
  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Employers can only download their own submissions.
  const isEmployer =
    session.user.role === "EMPLOYER" &&
    doc.application.submittedById === session.user.id;
  const isReviewer = ["VERIFIER", "COMMITTEE_MEMBER", "PERMANENT_SECRETARY", "ADMIN"].includes(
    session.user.role
  );

  if (!isEmployer && !isReviewer) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const stream = await getObjectStream(doc.storageKey);

  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Disposition": `inline; filename="${doc.fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}