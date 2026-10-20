// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { putObject } from "@/lib/storage";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "File is empty" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File exceeds ${MAX_BYTES / 1024 / 1024} MB` },
      { status: 400 }
    );
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type}` },
      { status: 400 }
    );
  }

  // Prefer the MIME-derived extension. Falls back to the original
  // filename's extension (only if it's a known safe one).
  const safeExtFromName = (file.name.match(/\.[a-zA-Z0-9]+$/)?.[0] ?? "").toLowerCase();
  const known = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
  const ext = EXT_BY_MIME[file.type] ?? (known.has(safeExtFromName) ? safeExtFromName : "");

  const key = `listings/${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await putObject(key, buffer, file.type);
  } catch (err) {
    console.error("[upload] putObject failed:", err);
    return NextResponse.json({ error: "Failed to store file" }, { status: 500 });
  }

  // Return the public URL served by /api/files/[...key]
  return NextResponse.json({ url: `/api/files/${key}` });
}