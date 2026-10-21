// app/api/expatriate/submit/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { putObject } from "@/lib/storage";
import { createReferenceNo } from "@/lib/reference";
import { PermitClass, ApplicationType } from "../../../../lib/db-types";
import { SLOT_LOOKUP } from "@/app/components/expatriate/steps";

export const runtime = "nodejs";

type SubmitMode = "draft" | "submit";

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
    return NextResponse.json({ error: "Employer is not linked to a company" }, { status: 400 });
  }

  const formData = await req.formData();

  const mode = (formData.get("mode") as SubmitMode | null) ?? "submit";
  if (mode !== "draft" && mode !== "submit") {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  const applicationId = formData.get("applicationId")?.toString() ?? null;

  const rawApplicant = formData.get("applicant");
  if (typeof rawApplicant !== "string") {
    return NextResponse.json({ error: "Missing applicant data" }, { status: 400 });
  }
  const applicant = JSON.parse(rawApplicant);
  const { permitClass, isRenewal, ...details } = applicant;

  const permitClassEnum = toPermitClass(permitClass);
  if (!permitClassEnum) {
    return NextResponse.json({ error: "Invalid permit class" }, { status: 400 });
  }
  const applicationTypeEnum: ApplicationType = isRenewal ? "RENEWAL" : "FIRST_APPLICATION";

  // ── Locate or create the row ─────────────────────────────
  let application;
  if (applicationId) {
    const existing = await prisma.application.findUnique({
      where: { id: applicationId },
      select: { id: true, status: true, submittedById: true },
    });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.submittedById !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (existing.status !== "DRAFT") return NextResponse.json({ error: "Only DRAFT applications can be edited" }, { status: 409 });

    application = await prisma.application.update({
      where: { id: existing.id },
      data: {
        permitClass: permitClassEnum,
        applicationType: applicationTypeEnum,
        applicantName: details.fullName,
        applicantNationality: details.nationality,
        applicantPassportNo: details.passportNumber,
        applicantEmail: details.email,
        applicantPhone: details.phone,
        ...(mode === "submit"
          ? { status: "SUBMITTED", submittedAt: new Date() }
          : { status: "DRAFT" }),
      },
    });
  } else {
    const referenceNo = await createReferenceNo();
    application = await prisma.application.create({
      data: {
        referenceNo,
        status: mode === "submit" ? "SUBMITTED" : "DRAFT",
        submittedById: user.id,
        companyId: user.company.id,
        permitClass: permitClassEnum,
        applicationType: applicationTypeEnum,
        applicantName: details.fullName,
        applicantNationality: details.nationality,
        applicantPassportNo: details.passportNumber,
        applicantEmail: details.email,
        applicantPhone: details.phone,
        submittedAt: mode === "submit" ? new Date() : null,
      },
    });
  }

  // ── Persist documents (upsert by slot + filename) ────────
  const documentEntries = Array.from(formData.entries()).filter(([key]) =>
    key.startsWith("documents["),
  );

  for (const [key, value] of documentEntries) {
    if (!(value instanceof File)) continue;
    const slotId = key.slice("documents[".length, -1);

    const slot = SLOT_LOOKUP[slotId];
    if (!slot) continue;

    const accept = Array.isArray(slot.accept)
      ? slot.accept
      : typeof slot.accept === "string"
        ? slot.accept.split(",").map((s) => s.trim())
        : undefined;

    if (accept && accept.length > 0) {
      const matches = accept.some((rule) => {
        if (rule.endsWith("/*")) {
          const prefix = rule.slice(0, -1);
          return value.type.startsWith(prefix);
        }
        if (rule.startsWith(".")) return value.name.toLowerCase().endsWith(rule.toLowerCase());
        return value.type === rule;
      });
      if (!matches) {
        return NextResponse.json({ error: `Unsupported type for ${slot.label}` }, { status: 400 });
      }
    }

    if (slot.maxSizeMb !== undefined && value.size > slot.maxSizeMb * 1024 * 1024) {
      return NextResponse.json({ error: `${slot.label} exceeds ${slot.maxSizeMb} MB` }, { status: 400 });
    }

    const buffer = await value.arrayBuffer();
    const storageKey = `applications/${application.id}/${slotId}/${value.name}`;
    await putObject(storageKey, buffer, value.type);

    await prisma.document.upsert({
      where: {
        applicationId_slotId_fileName: {
          applicationId: application.id,
          slotId,
          fileName: value.name,
        },
      },
      update: {
        mimeType: value.type,
        sizeBytes: value.size,
        storageKey,
        uploadedAt: new Date(),
      },
      create: {
        applicationId: application.id,
        slotId,
        fileName: value.name,
        mimeType: value.type,
        sizeBytes: value.size,
        storageKey,
      },
    });
  }

  await prisma.applicationEvent.create({
    data: {
      applicationId: application.id,
      type: mode === "submit" ? "SUBMITTED" : "NOTE_ADDED",
      actorId: user.id,
      message:
        mode === "submit"
          ? `Application ${application.referenceNo} submitted by ${user.company.name}`
          : `Draft saved for ${application.referenceNo}`,
    },
  });

  return NextResponse.json({
    id: application.id,
    referenceNo: application.referenceNo,
    status: application.status,
  });
}

function toPermitClass(value: string): PermitClass | null {
  if (value === "class-g") return "CLASS_G";
  if (value === "class-d") return "CLASS_D";
  if (value === "special-pass") return "SPECIAL_PASS";
  return null;
}