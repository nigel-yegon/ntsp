// app/admin/actions/resources.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  putObject,
  deleteObject,
} from "@/lib/storage";
import { randomUUID } from "crypto";
import type { ResourceCategory } from "@/lib/db-types";

export type ResourceRow = {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  uploadedAt: Date;
  published: boolean;
  order: number;
  uploaderName: string | null;
  createdAt: Date;
};

const CATEGORIES: ResourceCategory[] = [
  "POLICY",
  "RESEARCH",
  "INNOVATION",
  "GUIDELINES",
  "REPORTS",
  "OTHER",
];

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
]);

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

function storageKeyFor(originalName: string): string {
  const ext = (originalName.match(/\.[A-Za-z0-9]+$/)?.[0] ?? "").toLowerCase();
  const year = new Date().getFullYear();
  return `resources/${year}/${randomUUID()}${ext}`;
}

function toRow(r: {
  id: string;
  title: string;
  description: string;
  category: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  uploadedAt: Date;
  published: boolean;
  order: number;
  uploaderName: string | null;
  createdAt: Date;
}): ResourceRow {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category as ResourceCategory,
    fileName: r.fileName,
    mimeType: r.mimeType,
    sizeBytes: r.sizeBytes,
    storageKey: r.storageKey,
    uploadedAt: r.uploadedAt,
    published: r.published,
    order: r.order,
    uploaderName: r.uploaderName,
    createdAt: r.createdAt,
  };
}

// ─── Read ────────────────────────────────────────────────────
export async function listResources(): Promise<ResourceRow[]> {
  await requireAdmin();
  const rows = await prisma.resource.findMany({
    orderBy: [{ order: "asc" }, { uploadedAt: "desc" }],
  });
  return rows.map(toRow);
}

// ─── Create ──────────────────────────────────────────────────
// FormData fields: title, description, category, published,
// order, file (the actual File object).
export async function createResource(form: FormData): Promise<ResourceRow> {
  const admin = await requireAdmin();

  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const categoryRaw = String(form.get("category") ?? "OTHER");
  const order = Number(form.get("order") ?? 0);
  const published = form.get("published") === "on" || form.get("published") === "true";

  if (title.length < 3) throw new Error("Title must be at least 3 characters");
  if (description.length < 10)
    throw new Error("Description must be at least 10 characters");
  if (!CATEGORIES.includes(categoryRaw as ResourceCategory)) {
    throw new Error("Invalid category");
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("A file is required");
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`File exceeds ${MAX_BYTES / 1024 / 1024} MB`);
  }
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }

  const key = storageKeyFor(file.name);
  const buf = Buffer.from(await file.arrayBuffer());
  await putObject(key, buf, file.type);

  try {
    const created = await prisma.resource.create({
      data: {
        title,
        description,
        category: categoryRaw as ResourceCategory,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: buf.byteLength,
        storageKey: key,
        published,
        order: Number.isFinite(order) ? order : 0,
        uploadedById: admin.id,
        uploaderName: admin.name,
      },
    });
    revalidatePath("/resources");
    revalidatePath("/admin");
    return toRow(created);
  } catch (err) {
    // Roll back the uploaded file if the DB write fails
    await deleteObject(key).catch(() => {});
    throw err;
  }
}

// ─── Update metadata (not the file itself) ──────────────────
export async function updateResource(
  id: string,
  patch: {
    title?: string;
    description?: string;
    category?: ResourceCategory;
    published?: boolean;
    order?: number;
  }
): Promise<ResourceRow> {
  await requireAdmin();

  const data: Record<string, unknown> = {};
  if (patch.title !== undefined) {
    const t = patch.title.trim();
    if (t.length < 3) throw new Error("Title must be at least 3 characters");
    data.title = t;
  }
  if (patch.description !== undefined) {
    const d = patch.description.trim();
    if (d.length < 10)
      throw new Error("Description must be at least 10 characters");
    data.description = d;
  }
  if (patch.category !== undefined) {
    if (!CATEGORIES.includes(patch.category))
      throw new Error("Invalid category");
    data.category = patch.category;
  }
  if (patch.published !== undefined) data.published = patch.published;
  if (patch.order !== undefined && Number.isFinite(patch.order))
    data.order = patch.order;

  const updated = await prisma.resource.update({ where: { id }, data });
  revalidatePath("/resources");
  revalidatePath("/admin");
  return toRow(updated);
}

// ─── Delete ──────────────────────────────────────────────────
export async function deleteResource(id: string): Promise<void> {
  await requireAdmin();

  const row = await prisma.resource.findUnique({
    where: { id },
    select: { storageKey: true },
  });
  if (!row) return;

  await prisma.resource.delete({ where: { id } });
  await deleteObject(row.storageKey).catch(() => {});

  revalidatePath("/resources");
  revalidatePath("/admin");
}