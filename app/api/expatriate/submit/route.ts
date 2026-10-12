// app/api/expatriate/submit/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // adjust to your auth
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { putObject } from "@/lib/storage";
import { createReferenceNo } from "@/lib/reference";
import { PermitClass, ApplicationType } from "../../../../lib/db-types";
import { SLOT_LOOKUP } from "@/app/components/expatriate/steps";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { company: true },
  });
  if (!user?.company) {
    return NextResponse.json(
      { error: "Employer is not linked to a company" },
      { status: 400 }
    );
  }

  const formData = await req.formData();
  const rawApplicant = formData.get("applicant");
  if (typeof rawApplicant !== "string") {
    return NextResponse.json({ error: "Missing applicant data" }, { status: 400 });
  }
  const applicant = JSON.parse(rawApplicant);
  const { permitClass, applicationType, isRenewal, ...details } = applicant;

  // ─── Validate permit class + application type ───
  const permitClassEnum = toPermitClass(permitClass);
  const applicationTypeEnum: ApplicationType = isRenewal
    ? "RENEWAL"
    : "FIRST_APPLICATION";

  if (!permitClassEnum) {
    return NextResponse.json({ error: "Invalid permit class" }, { status: 400 });
  }

  // ─── Create the application first (so we can key document rows to it) ───
  const referenceNo = await createReferenceNo();
  const application = await prisma.application.create({
    data: {
      referenceNo,
      status: "SUBMITTED",
      submittedById: user.id,
      companyId: user.company.id,
      permitClass: permitClassEnum,
      applicationType: applicationTypeEnum,
      applicantName: details.fullName,
      applicantNationality: details.nationality,
      applicantPassportNo: details.passportNumber,
      applicantEmail: details.email,
      applicantPhone: details.phone,
      submittedAt: new Date(),
    },
  });

  // ─── Persist documents ───
  const documentEntries = Array.from(formData.entries()).filter(([key]) =>
    key.startsWith("documents[")
  );

  const createdDocs = [];
  for (const [key, value] of documentEntries) {
    if (!(value instanceof File)) continue;
    const slotId = key.slice("documents[".length, -1);

    // Validate type and size against the slot definition
    const slot = SLOT_LOOKUP[slotId];
    if (!slot) continue;
    if (slot.accept && !slot.accept.includes(value.type)) {
      return NextResponse.json(
        { error: `Unsupported type for ${slot.label}` },
        { status: 400 }
      );
    }
    if (slot.maxSizeMb !== undefined && value.size > slot.maxSizeMb * 1024 * 1024) {
      return NextResponse.json(
        { error: `${slot.label} exceeds ${slot.maxSizeMb} MB` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await value.arrayBuffer());
    const storageKey = `applications/${application.id}/${slotId}/${value.name}`;
    await putObject(storageKey, buffer, value.type);

    createdDocs.push({
      applicationId: application.id,
      slotId,
      fileName: value.name,
      mimeType: value.type,
      sizeBytes: value.size,
      storageKey,
    });
  }

  if (createdDocs.length) {
    await prisma.document.createMany({ data: createdDocs });
  }

  // ─── Audit trail ───
  await prisma.applicationEvent.create({
    data: {
      applicationId: application.id,
      type: "SUBMITTED",
      actorId: user.id,
      message: `Application ${referenceNo} submitted by ${user.company.name}`,
    },
  });

  return NextResponse.json({
    id: application.id,
    referenceNo: application.referenceNo,
  });
}

function toPermitClass(value: string): PermitClass | null {
  if (value === "class-g") return "CLASS_G";
  if (value === "class-d") return "CLASS_D";
  if (value === "special-pass") return "SPECIAL_PASS";
  return null;
}