import sharp from "sharp";
import { randomUUID } from "crypto";
import { AppError } from "@/server/lib/response";

// Image optimization configuration
export const IMAGE_CONFIG = {
  // Quality settings
  jpeg: { quality: 85, progressive: true, mozjpeg: true },
  webp: { quality: 85, effort: 6 },
  avif: { quality: 70, effort: 7 },
  
  // Responsive breakpoints (widths)
  breakpoints: [400, 800, 1200, 1600, 2000],
  
  // Maximum dimensions
  maxWidth: 2000,
  maxHeight: 2000,
  
  // Upload limits
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
};

export interface OptimizedImage {
  original: Buffer;
  variants: ImageVariant[];
  metadata: ImageMetadata;
}

export interface ImageVariant {
  width: number;
  height: number;
  format: "jpeg" | "webp" | "avif" | "png";
  buffer: Buffer;
  size: number;
  url: string; // Relative path
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  hasAlpha: boolean;
}

export interface ProcessOptions {
  breakpoints?: number[];
  formats?: ("jpeg" | "webp" | "avif" | "png")[];
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * Process an uploaded image - optimize and generate responsive variants
 */
export async function processImage(
  buffer: Buffer,
  options: ProcessOptions = {}
): Promise<OptimizedImage> {
  const {
    breakpoints = IMAGE_CONFIG.breakpoints,
    formats = ["webp", "jpeg"],
    quality = 85,
    maxWidth = IMAGE_CONFIG.maxWidth,
    maxHeight = IMAGE_CONFIG.maxHeight,
  } = options;

  // Validate input
  if (buffer.length > IMAGE_CONFIG.maxFileSize) {
    throw new AppError("VALIDATION_ERROR", 400, `File size exceeds ${IMAGE_CONFIG.maxFileSize / 1024 / 1024}MB limit`);
  }

  // Get original metadata
  const originalMetadata = await sharp(buffer).metadata();
  if (!originalMetadata.width || !originalMetadata.height) {
    throw new AppError("VALIDATION_ERROR", 400, "Invalid image file");
  }

  // Check MIME type
  const mime = originalMetadata.format;
  if (!["jpeg", "png", "webp", "avif"].includes(mime || "")) {
    throw new AppError("VALIDATION_ERROR", 400, "Unsupported image format");
  }

  // Resize if needed
  let workingBuffer = buffer;
  if (originalMetadata.width > maxWidth || originalMetadata.height > maxHeight) {
    workingBuffer = await sharp(buffer)
      .resize(maxWidth, maxHeight, { fit: "inside", withoutEnlargement: true })
      .toBuffer();
  }

  // Generate variants
  const variants: ImageVariant[] = [];
  const baseName = randomUUID();

  for (const format of formats) {
    const sharpFormat = format === "avif" ? "avif" : format === "webp" ? "webp" : "jpeg";
    for (const width of breakpoints) {
      // Skip if original is smaller than breakpoint
      if (originalMetadata.width && originalMetadata.width < width) continue;

      const resized = await sharp(workingBuffer)
        .resize(width, null, { fit: "inside", withoutEnlargement: true })
        .toFormat(sharpFormat, {
          quality,
          progressive: format === "jpeg",
          effort: format === "webp" ? 6 : undefined,
          lossless: format === "avif" ? false : undefined,
        })
        .toBuffer({ resolveWithObject: true });

      variants.push({
        width: resized.info.width,
        height: resized.info.height,
        format: format as "jpeg" | "webp" | "avif",
        buffer: resized.data,
        size: resized.data.length,
        url: `/images/optimized/${baseName}-${width}w.${format}`,
      });
    }
  }

  // Also create original format variant at full size
  const originalFormat = (originalMetadata.format || "jpeg") as "jpeg" | "png" | "webp" | "avif";
  if (!formats.includes(originalFormat)) {
    const fullSize = await sharp(workingBuffer)
      .toFormat(originalFormat, { quality })
      .toBuffer({ resolveWithObject: true });
    
    variants.push({
      width: fullSize.info.width,
      height: fullSize.info.height,
      format: originalFormat,
      buffer: fullSize.data,
      size: fullSize.data.length,
      url: `/images/optimized/${baseName}-original.${originalFormat}`,
    });
  }

  // Calculate total savings
  const originalSize = buffer.length;
  const optimizedSize = variants.reduce((sum, v) => sum + v.size, 0);
  const savingsPercent = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);

  return {
    original: buffer,
    variants,
    metadata: {
      width: originalMetadata.width,
      height: originalMetadata.height,
      format: originalMetadata.format || "unknown",
      size: originalSize,
      hasAlpha: originalMetadata.hasAlpha || false,
    },
  };
}

/**
 * Save optimized images to filesystem (or cloud storage)
 */
export async function saveOptimizedImages(
  optimized: OptimizedImage,
  basePath: string = "./public"
): Promise<string[]> {
  const fs = await import("fs/promises");
  const path = await import("path");
  
  const savedPaths: string[] = [];
  
  for (const variant of optimized.variants) {
    const fullPath = path.join(basePath, variant.url);
    const dir = path.dirname(fullPath);
    
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, variant.buffer);
    savedPaths.push(variant.url);
  }
  
  return savedPaths;
}

/**
 * Generate blur placeholder (LQIP - Low Quality Image Placeholder)
 */
export async function generateBlurPlaceholder(buffer: Buffer): Promise<string> {
  const placeholder = await sharp(buffer)
    .resize(20, 20, { fit: "inside" })
    .blur(10)
    .jpeg({ quality: 20 })
    .toBuffer();
  
  return `data:image/jpeg;base64,${placeholder.toString("base64")}`;
}

/**
 * Validate uploaded file
 */
export function validateImageFile(file: { buffer: Buffer; mimetype: string; size: number }): void {
  if (!IMAGE_CONFIG.allowedMimes.includes(file.mimetype)) {
    throw new AppError("VALIDATION_ERROR", 400, "Invalid file type. Allowed: JPEG, PNG, WebP, AVIF");
  }
  
  if (file.size > IMAGE_CONFIG.maxFileSize) {
    throw new AppError("VALIDATION_ERROR", 400, `File too large. Maximum size: ${IMAGE_CONFIG.maxFileSize / 1024 / 1024}MB`);
  }
}

/**
 * Get optimized image URL for responsive srcset
 */
export function generateSrcSet(baseUrl: string, breakpoints: number[] = IMAGE_CONFIG.breakpoints): string {
  return breakpoints
    .map((w) => `${baseUrl}-${w}w.webp ${w}w`)
    .join(", ");
}

/**
 * Get optimized image URL for <picture> sources
 */
export function generatePictureSources(baseUrl: string, breakpoints: number[] = IMAGE_CONFIG.breakpoints): string {
  return breakpoints
    .map((w) => `<source srcset="${baseUrl}-${w}w.webp" type="image/webp" media="(max-width: ${w}px)">`)
    .join("\n");
}