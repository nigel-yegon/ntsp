// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { putObject } from "@/lib/storage";

export const runtime = "nodejs";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

function extensionFor(mimeType: string): string {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "bin";
}

function sanitizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")   // strip extension
    .replace(/[^a-z0-9]+/g, "-")     // non-alphanumeric to hyphen
    .replace(/^-+|-+$/g, "")         // trim hyphens
    .slice(0, 60) || "image";
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only roles that actually upload images.
  const allowed = ["BUSINESS", "CUSTOMER", "ADMIN"];
  if (!allowed.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data" },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ACCEPTED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, and WebP images are allowed" },
      { status: 400 }
    );
  }

  const maxBytes = MAX_SIZE_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: `Image exceeds ${MAX_SIZE_MB} MB` },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = extensionFor(file.type);
  const baseName = sanitizeName(file.name);
  const key = [
    "uploads",
    session.user.id,
    `${Date.now()}-${baseName}.${ext}`,
  ].join("/");

  try {
    await putObject(key, buffer, file.type);
  } catch (err) {
    console.error("[upload] putObject failed:", err);
    return NextResponse.json(
      { error: "Failed to store image" },
      { status: 500 }
    );
  }

  return NextResponse.json({ key });
}