// lib/storage.ts
import { promises as fs, createReadStream } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Readable } from "stream";

const ROOT = process.env.STORAGE_ROOT
  ? path.resolve(process.env.STORAGE_ROOT)
  : path.join(process.cwd(), "storage");

function resolveKey(key: string): string {
  const cleaned = key
    .normalize("NFC")
    .replace(/\0/g, "")
    .replace(/\.\./g, "")
    .replace(/^\/+/, "");
  const full = path.join(ROOT, cleaned);
  const rel = path.relative(ROOT, full);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`Invalid storage key: ${key}`);
  }
  return full;
}

export async function putObject(
  key: string,
  data: Buffer | Uint8Array | ArrayBuffer,
  _contentType: string,
): Promise<string> {
  const filePath = resolveKey(key);
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  const buffer = Buffer.isBuffer(data)
    ? data
    : data instanceof ArrayBuffer
      ? Buffer.from(data)
      : Buffer.from(data.buffer, data.byteOffset, data.byteLength);

  const tmpPath = `${filePath}.${randomUUID()}.tmp`;
  await fs.writeFile(tmpPath, buffer);
  await fs.rename(tmpPath, filePath);
  return key;
}

export async function getObjectStream(
  key: string,
): Promise<ReadableStream<Uint8Array>> {
  const filePath = resolveKey(key);
  await fs.access(filePath);
  const nodeStream = createReadStream(filePath);
  return Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;
}

export async function statObject(key: string): Promise<{ size: number; mtime: Date }> {
  const filePath = resolveKey(key);
  const st = await fs.stat(filePath);
  return { size: st.size, mtime: st.mtime };
}

export async function deleteObject(key: string): Promise<void> {
  const filePath = resolveKey(key);
  try {
    await fs.unlink(filePath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return;
    throw err;
  }
}

export async function ensureStorageReady(): Promise<void> {
  await fs.mkdir(ROOT, { recursive: true });
  await fs.access(ROOT, fs.constants.W_OK);
  console.log(`[storage] ready at ${ROOT}`);
}
