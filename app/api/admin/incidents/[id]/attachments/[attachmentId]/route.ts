// app/api/admin/incidents/[id]/attachments/[attachmentId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getObjectStream, statObject } from "@/lib/storage";

export const runtime = "nodejs";

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  pdf: "application/pdf",
};

// ── GET /api/admin/incidents/:id/attachments/:attachmentId ───
// Admin-only download of an incident attachment.
// Mirrors /api/files for MIME + ENOENT handling, but adds auth,
// an ownership check, and private/no-store caching. The
// attachment's storageKey never leaves the server.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; attachmentId: string }> }
) {
  const { id, attachmentId } = await params;

  // 1. Auth gate — must be a logged-in ADMIN.
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. Ownership check — the attachment must belong to the
  //    incident in the URL. Without this, an admin could probe
  //    attachment IDs across incidents.
  const attachment = await prisma.incidentAttachment.findFirst({
    where: { id: attachmentId, incidentId: id },
    select: {
      fileName: true,
      mimeType: true,
      sizeBytes: true,
      storageKey: true,
    },
  });
  if (!attachment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 3. Stream the file. ENOENT → 404 (row exists, file gone).
  try {
    const { size, mtime } = await statObject(attachment.storageKey);
    const stream = await getObjectStream(attachment.storageKey);

    const ext = attachment.storageKey.split(".").pop()?.toLowerCase() ?? "";
    const contentType =
      MIME_BY_EXT[ext] ?? attachment.mimeType ?? "application/octet-stream";

    // Sanitize for Content-Disposition: strip CR/LF/quotes (header
    // injection) and provide both ASCII and RFC 5987 forms so
    // Unicode filenames survive in every browser.
    const safeName = attachment.fileName.replace(/[\r\n"]/g, "_");
    const asciiName = safeName.replace(/[^\x20-\x7E]/g, "_");
    const encodedName = encodeURIComponent(safeName);

    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(size),
        "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${encodedName}`,
        "Cache-Control": "private, no-store",
        "Last-Modified": mtime.toUTCString(),
      },
    });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    console.error("[admin/incidents/attachments] stream failed:", err);
    return NextResponse.json(
      { error: "Failed to read file" },
      { status: 500 }
    );
  }
}