import { mkdir, unlink, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { AppError } from "./response";

// সংরক্ষণ বিমূর্ততা — local ডিফল্ট, s3 ভবিষ্যতের জন্য স্টাব।
// DB ছাড়াই চলে; local ড্রাইভার public/uploads/-এ লেখে।
export interface SaveFileInput {
  buffer: Buffer;
  mime: string;
  ext: string;
}

export interface SaveFileResult {
  key: string;
}

type StorageDriver = "local" | "s3";

function getDriver(): StorageDriver {
  const raw: string = (process.env.STORAGE_DRIVER ?? "local").trim().toLowerCase();
  if (raw === "s3") return "s3";
  return "local";
}

function failS3(): never {
  throw new AppError("INTERNAL", 501, "S3 storage is not configured yet");
}

const ALLOWED_EXTS: ReadonlySet<string> = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

function sanitizeExt(ext: string): string {
  const cleaned = ext.trim().toLowerCase().replace(/^\.+/, "").replace(/[^a-z0-9]/g, "");
  if (!ALLOWED_EXTS.has(cleaned)) return "bin";
  return cleaned;
}

function sanitizeKey(key: string): string {
  const base = key.trim().replace(/\\/g, "/").split("/").pop() ?? "";
  const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, "");
  if (cleaned === "" || cleaned === "." || cleaned === "..") throw new AppError("VALIDATION_ERROR", 400, "Invalid file key");
  return cleaned;
}

function uploadsDir(): string {
  return path.join(process.cwd(), "public", "uploads");
}

export async function saveFile(input: SaveFileInput): Promise<SaveFileResult> {
  const driver = getDriver();
  if (driver === "s3") failS3();
  const MAX_FILE_BYTES = 8 * 1024 * 1024;
  if (input.buffer.length > MAX_FILE_BYTES)
    throw new AppError("VALIDATION_ERROR", 400, "File must not exceed 8MB");
  const ext = sanitizeExt(input.ext);
  const key = `${Date.now().toString(36)}-${randomBytes(8).toString("hex")}.${ext}`;
  const dir = uploadsDir();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, key), input.buffer);
  return { key };
}

export async function getPublicUrl(key: string): Promise<string> {
  const driver = getDriver();
  if (driver === "s3") failS3();
  const safe = sanitizeKey(key);
  return `/uploads/${safe}`;
}

export async function deleteFile(key: string): Promise<void> {
  const driver = getDriver();
  if (driver === "s3") failS3();
  const safe = sanitizeKey(key);
  try {
    await unlink(path.join(uploadsDir(), safe));
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "ENOENT") return;
    throw err;
  }
}
