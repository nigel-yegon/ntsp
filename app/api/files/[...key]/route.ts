// app/api/files/[...key]/route.ts
import { NextResponse } from "next/server";
import { getObjectStream, statObject } from "@/lib/storage";

export const runtime = "nodejs";

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  pdf: "application/pdf",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;
  const storageKey = key.join("/");

  // Reject path traversal — storage layer also guards, but fail early.
  if (storageKey.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  // ── NEW: block admin-only namespaces from the public streamer ──
  // Incident evidence is served only through
  // /api/admin/incidents/:id/attachments/:attachmentId.
  if (storageKey.startsWith("incidents/private/")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { size, mtime } = await statObject(storageKey);
    const stream = await getObjectStream(storageKey);

    const ext = storageKey.split(".").pop()?.toLowerCase() ?? "";
    const contentType = MIME_BY_EXT[ext] ?? "application/octet-stream";

    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(size),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Last-Modified": mtime.toUTCString(),
      },
    });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    console.error("[files] stream failed:", err);
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}