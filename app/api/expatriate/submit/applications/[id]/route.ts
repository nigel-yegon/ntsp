// app/api/expatriate/applications/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      documents: { orderBy: { uploadedAt: "asc" } },
    },
  });
  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Only the owner or admin may read the full record via this endpoint.
  // Reviewers read applications through /review/* pages, not this API.
  if (
    application.submittedById !== session.user.id &&
    session.user.role !== "ADMIN"
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    id: application.id,
    referenceNo: application.referenceNo,
    status: application.status,
    applicant: {
      fullName: application.applicantName,
      nationality: application.applicantNationality,
      passportNumber: application.applicantPassportNo,
      email: application.applicantEmail,
      phone: application.applicantPhone,
      permitClass: permitClassToClient(application.permitClass),
      isRenewal: application.applicationType === "RENEWAL",
    },
    documents: application.documents.map((d) => ({
      id: d.id,
      slotId: d.slotId,
      fileName: d.fileName,
      mimeType: d.mimeType,
      sizeBytes: d.sizeBytes,
      // Absolute URL the client can fetch to download.
      url: `/api/documents/${d.id}`,
    })),
  });
}

function permitClassToClient(
  value: string,
): "class-g" | "class-d" | "special-pass" {
  if (value === "CLASS_G") return "class-g";
  if (value === "CLASS_D") return "class-d";
  return "special-pass";
}