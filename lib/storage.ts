// lib/storage.ts
import { promises as fs } from "fs";
import path from "path";
import { Readable } from "stream";

const ROOT = path.join(process.cwd(), "storage");

async function ensureDir(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

function resolveKey(key: string) {
  // Reject path traversal — keys come from user-controlled filenames.
  const safe = key.replace(/\.\./g, "").replace(/^\/+/, "");
  return path.join(ROOT, safe);
}

export async function putObject(
  key: string,
  data: Buffer,
  _contentType: string
): Promise<void> {
  const filePath = resolveKey(key);
  await ensureDir(filePath);
  await fs.writeFile(filePath, data);
}

export async function getObjectStream(key: string): Promise<Readable> {
  const filePath = resolveKey(key);
  const buffer = await fs.readFile(filePath);
  return Readable.from(buffer);
}