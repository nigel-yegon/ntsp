// app/api/admin/incidents/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// ── Constants ────────────────────────────────────────────────
const INCIDENT_STATUSES = [
  "OPEN",
  "UNDER_REVIEW",
  "RESOLVED",
  "CLOSED",
] as const;

const INCIDENT_CATEGORIES = [
  "WILDLIFE",
  "SAFETY",
  "OPERATOR",
  "FACILITY",
  "GUIDES",
  "OTHER",
] as const;

type IncidentStatusParam = (typeof INCIDENT_STATUSES)[number];
type IncidentCategoryParam = (typeof INCIDENT_CATEGORIES)[number];

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

// ── List projection ──────────────────────────────────────────
// Narrower than IncidentRow on purpose: no `description`,
// `reviewNotes`, or `storageKey`. Full text is served by the
// detail action or the download route.
type IncidentListItem = {
  id: string;
  referenceNo: string;
  title: string;
  category: IncidentCategoryParam;
  status: IncidentStatusParam;
  location: string | null;
  reportedAt: Date;
  reviewedAt: Date | null;
  attachmentCount: number;
};

// ── Cursor ───────────────────────────────────────────────────
// Cursor is base64url(`${reportedAt.toISOString()}|${id}`). Sort
// is `(reportedAt desc, id desc)` so the id tiebreak is what
// makes cursor pagination stable when two reports share a
// reportedAt (same-millisecond inserts, seed data).
function encodeCursor(reportedAt: Date, id: string): string {
  return Buffer.from(`${reportedAt.toISOString()}|${id}`, "utf8").toString(
    "base64url"
  );
}

function decodeCursor(
  cursor: string
): { reportedAt: Date; id: string } | null {
  try {
    const raw = Buffer.from(cursor, "base64url").toString("utf8");
    const [iso, id] = raw.split("|");
    if (!iso || !id) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return { reportedAt: d, id };
  } catch {
    return null;
  }
}

// ── GET /api/admin/incidents?status=&category=&cursor=&limit= ─
export async function GET(req: Request) {
  // 1. Auth gate — ADMIN only, mirrors the actions file.
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. Parse + validate query params.
  const url = new URL(req.url);
  const statusRaw = url.searchParams.get("status");
  const categoryRaw = url.searchParams.get("category");
  const cursorRaw = url.searchParams.get("cursor");
  const limitRaw = url.searchParams.get("limit");

  if (
    statusRaw &&
    !INCIDENT_STATUSES.includes(statusRaw as IncidentStatusParam)
  ) {
    return NextResponse.json(
      {
        error: `Invalid status. Expected one of: ${INCIDENT_STATUSES.join(
          ", "
        )}`,
      },
      { status: 400 }
    );
  }
  if (
    categoryRaw &&
    !INCIDENT_CATEGORIES.includes(categoryRaw as IncidentCategoryParam)
  ) {
    return NextResponse.json(
      {
        error: `Invalid category. Expected one of: ${INCIDENT_CATEGORIES.join(
          ", "
        )}`,
      },
      { status: 400 }
    );
  }

  const limit = Math.min(
    Math.max(parseInt(limitRaw ?? "", 10) || DEFAULT_LIMIT, 1),
    MAX_LIMIT
  );

  const decoded = cursorRaw ? decodeCursor(cursorRaw) : null;
  if (cursorRaw && !decoded) {
    return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
  }

  // 3. Query. `where` is built inline — no Prisma namespace type
  //    needed, which sidesteps the TS2305 issue with the new
  //    prisma-client generator that doesn't export `Prisma` from
  //    @prisma/client.
  const rows = await prisma.incident.findMany({
    where: {
      ...(statusRaw ? { status: statusRaw as IncidentStatusParam } : {}),
      ...(categoryRaw
        ? { category: categoryRaw as IncidentCategoryParam }
        : {}),
    },
    orderBy: [{ reportedAt: "desc" }, { id: "desc" }],
    take: limit + 1,
    ...(decoded
      ? {
          cursor: { id: decoded.id },
          skip: 1, // exclude the cursor row itself
        }
      : {}),
    select: {
      id: true,
      referenceNo: true,
      title: true,
      category: true,
      status: true,
      location: true,
      reportedAt: true,
      reviewedAt: true,
      _count: { select: { attachments: true } },
    },
  });

  // 4. Build the page.
  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const last = page[page.length - 1];

  const items: IncidentListItem[] = page.map((r) => ({
    id: r.id,
    referenceNo: r.referenceNo,
    title: r.title,
    category: r.category as IncidentCategoryParam,
    status: r.status as IncidentStatusParam,
    location: r.location,
    reportedAt: r.reportedAt,
    reviewedAt: r.reviewedAt,
    attachmentCount: r._count.attachments,
  }));

  return NextResponse.json({
    items,
    nextCursor:
      hasMore && last ? encodeCursor(last.reportedAt, last.id) : null,
  });
}