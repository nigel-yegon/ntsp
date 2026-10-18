// lib/image-url.ts
/**
 * Resolves a stored image path to a renderable URL.
 *
 * - Storage keys (e.g. "uploads/abc/123.jpg") → "/api/files/<key>"
 * - Absolute URLs (https://...) → returned as-is
 * - Root-relative paths (e.g. "/images/stays/mara.png") → returned as-is
 * - Empty → null
 */
export function resolveImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return `/api/files/${path}`;
}