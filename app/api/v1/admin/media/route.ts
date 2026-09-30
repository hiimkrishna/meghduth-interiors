import { requireAdmin } from "@/server/lib/admin-auth";
import { AppError, fail, ok, withReqId } from "@/server/lib/response";
import { getPublicUrl, saveFile } from "@/server/lib/storage";
import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";
import { processImage, saveOptimizedImages, validateImageFile } from "@/lib/image-optimization";

export const dynamic = "force-dynamic";

// magic-byte allowlist — ক্লায়েন্ট-MIME বিশ্বাস নয়, স্নিফ-করা ধরন দেখো।
// v1: images only. Video uploads arrive in v2 (social hub).
const ALLOWED_IMAGE_MIME: ReadonlySet<string> = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB

// অ্যাডমিন মিডিয়া আপলোড — multipart form-data (`file` ফিল্ড)।
// স্নিফ → responsive variants (webp/avif/jpeg) → storage।
export async function POST(req: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const form = await req.formData().catch(() => null);
    if (form === null) throw new AppError("VALIDATION_ERROR", 400, "File not found");
    const entry = form.get("file");
    if (entry === null || typeof entry === "string") {
      throw new AppError("VALIDATION_ERROR", 400, "File not found");
    }
    const file = entry as File;
    if (file.size > MAX_IMAGE_BYTES) throw new AppError("VALIDATION_ERROR", 400, "Image must not exceed 10MB");
    if (file.size <= 0) throw new AppError("VALIDATION_ERROR", 400, "File not found");
    const raw = Buffer.from(await file.arrayBuffer());

    validateImageFile({ buffer: raw, mimetype: file.type, size: file.size });

    const sniffed = await fileTypeFromBuffer(raw).catch(() => undefined);
    if (sniffed === undefined || !ALLOWED_IMAGE_MIME.has(sniffed.mime)) {
      throw new AppError("VALIDATION_ERROR", 400, "Only jpeg/png/webp/avif allowed");
    }

    let optimized;
    try {
      optimized = await processImage(raw, {
        breakpoints: [400, 800, 1200, 1600, 2000],
        formats: ["webp", "avif", "jpeg"],
        quality: 85,
        maxWidth: 2000,
        maxHeight: 2000,
      });
    } catch {
      throw new AppError("VALIDATION_ERROR", 400, "Invalid image or processing failed");
    }

    const savedPaths = await saveOptimizedImages(optimized, "./public");
    void savedPaths;

    if (optimized.variants.length === 0) {
      throw new AppError("INTERNAL", 500, "No image variants generated");
    }
    const mainVariant = optimized.variants.find(v => v.format === "webp" && v.width >= 1200)
      ?? optimized.variants[0];

    if (!mainVariant) throw new AppError("INTERNAL", 500, "No main variant found");

    const saved = await saveFile({
      buffer: mainVariant.buffer,
      mime: `image/${mainVariant.format}`,
      ext: mainVariant.format
    });

    const url = await getPublicUrl(saved.key);

    const blurPlaceholder = await sharp(raw)
      .resize(20, 20, { fit: "inside" })
      .blur(10)
      .jpeg({ quality: 20 })
      .toBuffer()
      .then(b => `data:image/jpeg;base64,${b.toString("base64")}`);

    return ok(
      {
        key: saved.key,
        url,
        type: "image",
        blurPlaceholder,
        variants: optimized.variants.map(v => ({
          width: v.width,
          height: v.height,
          format: v.format,
          size: v.size,
          url: v.url,
        })),
        originalSize: optimized.metadata.size,
        optimizedSize: optimized.variants.reduce((sum, v) => sum + v.size, 0),
        savingsPercent: ((optimized.metadata.size - optimized.variants.reduce((sum, v) => sum + v.size, 0)) / optimized.metadata.size * 100).toFixed(1),
      },
      "Uploaded and optimized",
      undefined,
      201
    );
  } catch (err) {
    return fail(err, reqId);
  }
}
