// app/api/incidents/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { createIncidentReferenceNo } from "@/lib/reference";
import { putObject, deleteObject } from "@/lib/storage";
import type { IncidentCategory } from "@/lib/db-types";

export const runtime = "nodejs";

// ── Constants ────────────────────────────────────────────────
const INCIDENT_CATEGORIES = [
  "WILDLIFE",
  "SAFETY",
  "OPERATOR",
  "FACILITY",
  "GUIDES",
  "OTHER",
] as const satisfies readonly IncidentCategory[];

const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

// ── Text-field schema ────────────────────────────────────────
const textSchema = z.object({
  reporterName: z.string().trim().max(200).optional(),
  reporterEmail: z
    .string()
    .trim()
    .email()
    .max(320)
    .optional()
    .or(z.literal("")),
  reporterPhone: z.string().trim().max(40).optional(),
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(10_000),
  location: z.string().trim().max(300).optional(),
  occurredAt: z
    .string()
    .datetime({ offset: true, local: true })
    .optional()
    .or(z.literal("")),
  category: z.enum(INCIDENT_CATEGORIES).default("OTHER"),
});

// ── Storage key builder ──────────────────────────────────────
// `incidents/private/` prefix lets the public /api/files route
// refuse to serve these — only the admin attachment route can.
function safeStorageKey(originalName: string): string {
  const ext = (originalName.match(/\.[A-Za-z0-9]+$/)?.[0] ?? "").toLowerCase();
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `incidents/private/${date}/${randomUUID()}${ext}`;
}

// ── POST /api/incidents (public, multipart/form-data) ────────
export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Expected multipart/form-data" },
      { status: 415 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  // 1. Validate text fields
  const textParsed = textSchema.safeParse({
    reporterName: form.get("reporterName") ?? undefined,
    reporterEmail: form.get("reporterEmail") ?? undefined,
    reporterPhone: form.get("reporterPhone") ?? undefined,
    title: form.get("title") ?? "",
    description: form.get("description") ?? "",
    location: form.get("location") ?? undefined,
    occurredAt: form.get("occurredAt") ?? undefined,
    category: form.get("category") ?? "OTHER",
  });

  if (!textParsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: textParsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  // 2. Validate files (before writing anything)
  const files = form
    .getAll("attachments")
    .filter((v): v is File => v instanceof File);

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `Maximum ${MAX_FILES} attachments allowed` },
      { status: 400 }
    );
  }
  for (const f of files) {
    if (f.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        {
          error: `File "${f.name}" exceeds ${MAX_FILE_BYTES / 1024 / 1024} MB`,
        },
        { status: 400 }
      );
    }
    if (!ALLOWED_MIME.has(f.type)) {
      return NextResponse.json(
        { error: `File "${f.name}" has unsupported type (${f.type})` },
        { status: 400 }
      );
    }
  }

  // 3. Upload files to storage first
  const uploaded: {
    key: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
  }[] = [];

  try {
    for (const f of files) {
      const key = safeStorageKey(f.name);
      const buf = Buffer.from(await f.arrayBuffer());
      await putObject(key, buf, f.type);
      uploaded.push({
        key,
        fileName: f.name,
        mimeType: f.type,
        sizeBytes: buf.byteLength,
      });
    }
  } catch (err) {
    await Promise.allSettled(uploaded.map((u) => deleteObject(u.key)));
    console.error("[api/incidents] upload failed", err);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }

  // 4. Create Incident + nested attachments
  const d = textParsed.data;
  const referenceNo = await createIncidentReferenceNo();

  let incident;
  try {
    incident = await prisma.incident.create({
      data: {
        referenceNo,
        status: "OPEN",
        category: d.category,
        reporterName: d.reporterName || null,
        reporterEmail: d.reporterEmail || null,
        reporterPhone: d.reporterPhone || null,
        title: d.title,
        description: d.description,
        location: d.location || null,
        occurredAt: d.occurredAt ? new Date(d.occurredAt) : null,
        attachments: {
          create: uploaded.map((u) => ({
            fileName: u.fileName,
            mimeType: u.mimeType,
            sizeBytes: u.sizeBytes,
            storageKey: u.key,
          })),
        },
      },
      select: {
        id: true,
        referenceNo: true,
        status: true,
        reportedAt: true,
        _count: { select: { attachments: true } },
      },
    });
  } catch (err) {
    await Promise.allSettled(uploaded.map((u) => deleteObject(u.key)));
    console.error("[api/incidents] db create failed", err);
    return NextResponse.json(
      { error: "Could not save incident" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      id: incident.id,
      referenceNo: incident.referenceNo,
      status: incident.status,
      reportedAt: incident.reportedAt,
      attachments: incident._count.attachments,
    },
    { status: 201 }
  );
}