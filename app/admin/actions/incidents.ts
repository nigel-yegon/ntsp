// app/admin/actions/incidents.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ── Types ────────────────────────────────────────────────────
export type IncidentStatus =
  | "OPEN"
  | "UNDER_REVIEW"
  | "RESOLVED"
  | "CLOSED";

export type IncidentCategory =
  | "WILDLIFE"
  | "SAFETY"
  | "OPERATOR"
  | "FACILITY"
  | "GUIDES"
  | "OTHER";

export type IncidentRow = {
  id: string;
  referenceNo: string;
  status: IncidentStatus;
  category: IncidentCategory;
  title: string;
  description: string;
  location: string | null;
  occurredAt: Date | null;
  reportedAt: Date;
  reporterName: string | null;
  reporterEmail: string | null;
  reporterPhone: string | null;
  reviewedById: string | null;
  reviewedAt: Date | null;
  reviewNotes: string | null;
  reviewerName: string | null;
  attachments: {
    id: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
  }[];
};

// ── Auth gate ────────────────────────────────────────────────
// Mirrors businesses.ts: single role check, throws on failure.
// If you later want committee members to view but not mutate,
// split this into requireViewer() / requireMutator().
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

// ── Legal transitions ────────────────────────────────────────
// Kept inline so it's the single source of truth for the admin
// panel + the action. If you'd rather centralize it, move to
// lib/incident-workflow.ts and import from both places.
const TRANSITIONS: Record<IncidentStatus, IncidentStatus[]> = {
  OPEN: ["UNDER_REVIEW"],
  UNDER_REVIEW: ["RESOLVED", "CLOSED", "OPEN"], // OPEN = re-open
  RESOLVED: ["CLOSED", "UNDER_REVIEW"],          // UNDER_REVIEW = reopen
  CLOSED: ["UNDER_REVIEW"],                      // UNDER_REVIEW = reopen
};

function canTransition(from: IncidentStatus, to: IncidentStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

// ── Read: list ───────────────────────────────────────────────
// Loads all incidents. Fine for now; if the table grows past a
// few hundred rows, add `take`/`skip` params and cursor here.
export async function listIncidents(): Promise<IncidentRow[]> {
  await requireAdmin();

  const rows = await prisma.incident.findMany({
    orderBy: [{ status: "asc" }, { reportedAt: "desc" }],
    include: {
      reviewedBy: { select: { name: true } },
      attachments: {
        select: {
          id: true,
          fileName: true,
          mimeType: true,
          sizeBytes: true,
        },
      },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    referenceNo: r.referenceNo,
    status: r.status as IncidentStatus,
    category: r.category as IncidentCategory,
    title: r.title,
    description: r.description,
    location: r.location,
    occurredAt: r.occurredAt,
    reportedAt: r.reportedAt,
    reporterName: r.reporterName,
    reporterEmail: r.reporterEmail,
    reporterPhone: r.reporterPhone,
    reviewedById: r.reviewedById,
    reviewedAt: r.reviewedAt,
    reviewNotes: r.reviewNotes,
    reviewerName: r.reviewedBy?.name ?? null,
    attachments: r.attachments,
  }));
}

// ── Mutate: status transition ────────────────────────────────
export async function updateIncidentStatus(input: {
  id: string;
  to: IncidentStatus;
  reviewNotes?: string;
}): Promise<IncidentRow> {
  const admin = await requireAdmin();

  const current = await prisma.incident.findUnique({
    where: { id: input.id },
    select: { id: true, status: true },
  });
  if (!current) throw new Error("Incident not found");

  const from = current.status as IncidentStatus;
  if (!canTransition(from, input.to)) {
    throw new Error(`Cannot transition ${from} → ${input.to}`);
  }

  const updated = await prisma.incident.update({
    where: { id: input.id },
    data: {
      status: input.to,
      // Stamp reviewer + timestamp on every transition. If a
      // reviewer later adds notes without a status change, the
      // same fields update — same row, later timestamp.
      reviewedById: admin.id,
      reviewedAt: new Date(),
      reviewNotes:
        typeof input.reviewNotes === "string"
          ? input.reviewNotes.trim() || null
          : undefined,
    },
    include: {
      reviewedBy: { select: { name: true } },
      attachments: {
        select: {
          id: true,
          fileName: true,
          mimeType: true,
          sizeBytes: true,
        },
      },
    },
  });

  revalidatePath("/admin");

  return {
    id: updated.id,
    referenceNo: updated.referenceNo,
    status: updated.status as IncidentStatus,
    category: updated.category as IncidentCategory,
    title: updated.title,
    description: updated.description,
    location: updated.location,
    occurredAt: updated.occurredAt,
    reportedAt: updated.reportedAt,
    reporterName: updated.reporterName,
    reporterEmail: updated.reporterEmail,
    reporterPhone: updated.reporterPhone,
    reviewedById: updated.reviewedById,
    reviewedAt: updated.reviewedAt,
    reviewNotes: updated.reviewNotes,
    reviewerName: updated.reviewedBy?.name ?? null,
    attachments: updated.attachments,
  };
}