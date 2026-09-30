import { and, asc, count, eq } from "drizzle-orm";
import type {
  CreateTestimonial,
  Testimonial,
  UpdateTestimonial,
} from "@/packages/contracts/src/testimonial.schema";
import { getDb } from "@/server/db/client";
import { testimonials } from "@/server/db/drizzle-schema";
import { AppError } from "@/server/lib/response";

// বোকা রেপোজিটরি — শুধু তথ্য পড়া। ব্যবসার নিয়ম এখানে নিষেধ।
// DB থাকলে drizzle, না থাকলে বীজ-ফলব্যাক।
import { testimonialsSeed } from "@/server/db/seed-data";

function seedApproved(): Testimonial[] {
  return testimonialsSeed.filter((t) => t.status === "approved" && t.published !== false);
}

function toTestimonial(r: typeof testimonials.$inferSelect): Testimonial {
  return {
    id: r.id,
    name: r.name,
    ...(r.designation !== null ? { designation: r.designation } : {}),
    text: r.text,
    rating: r.rating,
    ...(r.imageKey !== null ? { imageKey: r.imageKey } : {}),
    status: r.status,
    published: r.published,
  };
}

function requireDb(): NonNullable<ReturnType<typeof getDb>> {
  const db = getDb();
  if (db === null) throw new AppError("INTERNAL", 503, "Database not ready");
  return db;
}

export interface PublishedPage {
  page: number;
  limit: number;
}

export async function findApprovedTestimonials(
  opts?: PublishedPage,
): Promise<{ items: Testimonial[]; total: number }> {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 50;
  const offset = (page - 1) * limit;
  const db = getDb();
  if (!db) {
    const all = seedApproved();
    return { items: all.slice(offset, offset + limit), total: all.length };
  }
  const whereClause = and(eq(testimonials.status, "approved"), eq(testimonials.published, true));
  const [rows, totalRows] = await Promise.all([
    db
      .select()
      .from(testimonials)
      .where(whereClause)
      .orderBy(asc(testimonials.id))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(testimonials).where(whereClause),
  ]);
  return { items: rows.map(toTestimonial), total: totalRows[0]?.value ?? 0 };
}

export async function findAllTestimonials(): Promise<Testimonial[]> {
  const db = getDb();
  if (!db) return [...testimonialsSeed];
  const rows = await db.select().from(testimonials).orderBy(asc(testimonials.id));
  return rows.map(toTestimonial);
}

export async function findTestimonialById(id: number): Promise<Testimonial | null> {
  const db = requireDb();
  const rows = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
  const row = rows[0];
  if (!row) return null;
  return toTestimonial(row);
}

export async function createTestimonialRecord(input: CreateTestimonial): Promise<Testimonial> {
  const db = requireDb();
  const rows = await db
    .insert(testimonials)
    .values({
      name: input.name,
      designation: input.designation ?? null,
      text: input.text,
      rating: input.rating ?? 5,
      imageKey: input.imageKey ?? null,
      status: "pending",
      published: false,
    })
    .returning();
  const row = rows[0];
  if (!row) throw new AppError("INTERNAL", 500, "Internal error");
  return toTestimonial(row);
}

export async function updateTestimonialRecord(
  id: number,
  patch: UpdateTestimonial,
): Promise<Testimonial | null> {
  const db = requireDb();
  const set: Partial<typeof testimonials.$inferInsert> = {};
  if (patch.name !== undefined) set.name = patch.name;
  if (patch.designation !== undefined) set.designation = patch.designation ?? null;
  if (patch.text !== undefined) set.text = patch.text;
  if (patch.rating !== undefined) set.rating = patch.rating;
  if (patch.imageKey !== undefined) set.imageKey = patch.imageKey;
  if (patch.status !== undefined) set.status = patch.status;
  if (patch.published !== undefined) set.published = patch.published;
  const rows = await db
    .update(testimonials)
    .set({ ...set, updatedAt: new Date() })
    .where(eq(testimonials.id, id))
    .returning();
  const row = rows[0];
  if (!row) return null;
  return toTestimonial(row);
}

export async function deleteTestimonialRecord(id: number): Promise<Testimonial | null> {
  const db = requireDb();
  const rows = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
  const row = rows[0];
  if (!row) return null;
  return toTestimonial(row);
}
