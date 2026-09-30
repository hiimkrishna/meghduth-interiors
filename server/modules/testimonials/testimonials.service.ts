import type {
  CreateTestimonial,
  Testimonial,
  UpdateTestimonial,
} from "@/packages/contracts/src/testimonial.schema";
import {
  createTestimonialSchema,
  updateTestimonialSchema,
} from "@/packages/contracts/src/testimonial.schema";
import type { PageMeta } from "@/packages/contracts/src/pagination";
import { buildPageMeta } from "@/packages/contracts/src/pagination";
import { BadRequest, NotFound } from "@/server/lib/response";
import {
  createTestimonialRecord,
  deleteTestimonialRecord,
  findAllTestimonials,
  findApprovedTestimonials,
  findTestimonialById,
  updateTestimonialRecord,
} from "./testimonials.repository";

// মোটা সার্ভিস — পাবলিকে শুধু অনুমোদিত মতামত। DB সরাসরি ধরা নিষেধ।
export interface PublishedListResult<T> {
  items: T[];
  meta: PageMeta;
}

function clampPage(raw: unknown): number {
  const n = typeof raw === "number" ? raw : Number(raw ?? 1);
  if (!Number.isInteger(n) || n < 1) return 1;
  return n;
}

function clampLimit(raw: unknown): number {
  const n = typeof raw === "number" ? raw : Number(raw ?? 50);
  if (!Number.isInteger(n) || n < 1) return 50;
  if (n > 50) return 50;
  return n;
}

export async function listApprovedTestimonials(
  input?: { page?: unknown; limit?: unknown },
): Promise<PublishedListResult<Testimonial>> {
  const page = clampPage(input?.page);
  const limit = clampLimit(input?.limit);
  const { items, total } = await findApprovedTestimonials({ page, limit });
  return { items, meta: buildPageMeta(total, { page, limit }) };
}

export async function listAllTestimonials(): Promise<Testimonial[]> {
  return findAllTestimonials();
}

function parseNumericId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw NotFound("Testimonial not found");
  return id;
}

export async function createTestimonial(input: CreateTestimonial): Promise<Testimonial> {
  const parsed = createTestimonialSchema.safeParse(input);
  if (!parsed.success) throw BadRequest("Invalid testimonial data");
  return createTestimonialRecord(parsed.data);
}

// পূর্ণ সম্পাদনা — কনটেন্ট + status/published (moderate এর অংশবিশেষ হিসেবে চলে)।
export async function updateTestimonial(
  idRaw: string,
  input: UpdateTestimonial,
): Promise<Testimonial> {
  const parsed = updateTestimonialSchema.safeParse(input);
  if (!parsed.success) throw BadRequest("Invalid testimonial data");
  if (Object.keys(parsed.data).length === 0) throw BadRequest("Invalid testimonial data");
  const id = parseNumericId(idRaw);
  const existing = await findTestimonialById(id);
  if (existing === null) throw NotFound("Testimonial not found");
  const next = await updateTestimonialRecord(id, parsed.data);
  if (next === null) throw NotFound("Testimonial not found");
  return next;
}

export async function deleteTestimonial(idRaw: string): Promise<Testimonial> {
  const id = parseNumericId(idRaw);
  const removed = await deleteTestimonialRecord(id);
  if (removed === null) throw NotFound("Testimonial not found");
  return removed;
}
