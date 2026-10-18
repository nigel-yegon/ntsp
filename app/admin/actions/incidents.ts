// app/admin/actions/incidents.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  canTransition,
  type IncidentStatus,
  type IncidentCategory,
} from "@/lib/incident-workflow";

// ── Row shape ───────────────────────────────────────────────
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

  escalatedTo: string | null;
  escalatedAt: Date | null;
  escalatedById: string | null;
  escalatedByName: string | null;

  attachments: {
    id: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
  }[];
};

// ── Auth gate ───────────────────────────────────────────────
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

// ── Read ────────────────────────────────────────────────────
export async function listIncidents(): Promise<IncidentRow[]> {
  await requireAdmin();

  const rows = await prisma.incident.findMany({
    orderBy: [{ status: "asc" }, { reportedAt: "desc" }],
    include: {
      reviewedBy: { select: { name: true } },
      escalatedBy: { select: { name: true } },
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

  return rows.map(toRow);
}

function toRow(r: {
  id: string;
  referenceNo: string;
  status: string;
  category: string;
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
  reviewedBy: { name: string } | null;
  escalatedTo: string | null;
  escalatedAt: Date | null;
  escalatedById: string | null;
  escalatedBy: { name: string } | null;
  attachments: {
    id: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
  }[];
}): IncidentRow {
  return {
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
    escalatedTo: r.escalatedTo,
    escalatedAt: r.escalatedAt,
    escalatedById: r.escalatedById,
    escalatedByName: r.escalatedBy?.name ?? null,
    attachments: r.attachments,
  };
}

// ── Mutate: status transition ───────────────────────────────
export async function updateIncidentStatus(input: {
  id: string;
  to: IncidentStatus;
  reviewNotes?: string;
  escalatedTo?: string;
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

  // Escalation requires a recipient. Reject before writing.
  let escalatedToValue: string | null = null;
  if (input.to === "ESCALATED") {
    const trimmed = input.escalatedTo?.trim() ?? "";
    if (!trimmed) {
      throw new Error("escalatedTo is required when escalating");
    }
    escalatedToValue = trimmed;
  }

  const now = new Date();
  const updated = await prisma.incident.update({
    where: { id: input.id },
    data: {
      status: input.to,

      // Every transition stamps the reviewer trail. On escalation
      // this is the admin who escalated; on any other transition
      // it's the admin who advanced the case.
      reviewedById: admin.id,
      reviewedAt: now,
      reviewNotes:
        typeof input.reviewNotes === "string"
          ? input.reviewNotes.trim() || null
          : undefined,

      // Escalation fields — only set when transitioning to
      // ESCALATED. Never cleared on other transitions, so the
      // historical hand-off survives.
      ...(input.to === "ESCALATED"
        ? {
            escalatedTo: escalatedToValue,
            escalatedAt: now,
            escalatedById: admin.id,
          }
        : {}),
    },
    include: {
      reviewedBy: { select: { name: true } },
      escalatedBy: { select: { name: true } },
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

  return toRow(updated);
}

// ── Mutate: note-only update (no status change) ─────────────
// Useful for reviewers who want to leave context without advancing
// the case. Uses the same reviewedBy/reviewedAt trail — every note
// edit bumps the timestamp, so the panel always shows the latest
// reviewer.
export async function addIncidentNote(input: {
  id: string;
  note: string;
}): Promise<IncidentRow> {
  const admin = await requireAdmin();

  const trimmed = input.note.trim();
  if (!trimmed) throw new Error("Note cannot be empty");

  const updated = await prisma.incident.update({
    where: { id: input.id },
    data: {
      reviewNotes: trimmed,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
    include: {
      reviewedBy: { select: { name: true } },
      escalatedBy: { select: { name: true } },
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

  return toRow(updated);
}