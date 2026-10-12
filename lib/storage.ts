// lib/storage.ts
import { promises as fs, createReadStream } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Readable } from "stream";

/**
 * Base directory for uploaded files. Set STORAGE_ROOT in production
 * to point at the mounted persistent volume:
 *
 *   Production:  /mnt/data/ntsp-storage
 *   Local dev:   ./storage   (falls back if STORAGE_ROOT is unset)
 */
const ROOT = process.env.STORAGE_ROOT
  ? path.resolve(process.env.STORAGE_ROOT)
  : path.join(process.cwd(), "storage");

/**
 * Reject path traversal attempts. Keys come from user-supplied
 * filenames, so a caller passing "../../etc/passwd" must not escape
 * ROOT. This is the only place that turns a key into a filesystem
 * path — every read/write goes through it.
 */
function resolveKey(key: string): string {
  const cleaned = key.replace(/\.\./g, "").replace(/^\/+/, "");
  const full = path.join(ROOT, cleaned);
  const rel = path.relative(ROOT, full);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`Invalid storage key: ${key}`);
  }
  return full;
}

/**
 * Write a file to storage. Atomic: writes to a temp file first, then
 * renames. Concurrent readers see either the old file or the complete
 * new one, never a partial write.
 */
export async function putObject(
  key: string,
  data: Buffer,
  _contentType: string
): Promise<string> {
  const filePath = resolveKey(key);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tmpPath = `${filePath}.${randomUUID()}.tmp`;
  await fs.writeFile(tmpPath, data);
  await fs.rename(tmpPath, filePath);
  return key;
}

/**
 * Read a file from storage. Throws if the file is missing — callers
 * should catch and map to a 404.
 */
export async function getObjectStream(key: string): Promise<Readable> {
  const filePath = resolveKey(key);
  await fs.access(filePath);
  return createReadStream(filePath);
}

/**
 * Stat a file to get its size and mtime without reading it. Used by
 * the download route to set Content-Length.
 */
export async function statObject(
  key: string
): Promise<{ size: number; mtime: Date }> {
  const filePath = resolveKey(key);
  const st = await fs.stat(filePath);
  return { size: st.size, mtime: st.mtime };
}

export async function deleteObject(key: string): Promise<void> {
  const filePath = resolveKey(key);
  await fs.unlink(filePath).catch(() => {
    // Missing file is not an error for delete.
  });
}

/**
 * Confirms the storage root exists and is writable. Called on server
 * startup so misconfiguration is loud rather than silent.
 */
export async function ensureStorageReady(): Promise<void> {
  await fs.mkdir(ROOT, { recursive: true });
  await fs.access(ROOT, fs.constants.W_OK);
  console.log(`[storage] ready at ${ROOT}`);
}
