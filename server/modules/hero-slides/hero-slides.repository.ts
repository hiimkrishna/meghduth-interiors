import { asc, count, eq } from "drizzle-orm";
import type {
  CreateHeroSlide,
  HeroSlide,
  UpdateHeroSlide,
} from "@/packages/contracts/src/hero.schema";
import { getDb } from "@/server/db/client";
import { heroSlides } from "@/server/db/drizzle-schema";
import { AppError } from "@/server/lib/response";

// বোকা রেপোজিটরি — শুধু তথ্য পড়া-লেখা। ব্যবসার নিয়ম এখানে নিষেধ।
// DB থাকলে drizzle, না থাকলে বীজ-ফলব্যাক।
import { heroSlidesSeed } from "@/server/db/seed-data";

function seedPublished(): HeroSlide[] {
  return heroSlidesSeed
    .filter((s) => s.published !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function seedAll(): HeroSlide[] {
  return [...heroSlidesSeed].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function toSlide(r: typeof heroSlides.$inferSelect): HeroSlide {
  return {
    id: r.id,
    image: r.imageKey,
    badge: r.badge,
    title: r.title,
    description: r.description,
    order: r.displayOrder,
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

export async function findPublishedHeroSlides(
  opts?: PublishedPage,
): Promise<{ items: HeroSlide[]; total: number }> {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 50;
  const offset = (page - 1) * limit;
  const db = getDb();
  if (!db) {
    const all = seedPublished();
    return { items: all.slice(offset, offset + limit), total: all.length };
  }
  const whereClause = eq(heroSlides.published, true);
  const [rows, totalRows] = await Promise.all([
    db
      .select()
      .from(heroSlides)
      .where(whereClause)
      .orderBy(asc(heroSlides.displayOrder))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(heroSlides).where(whereClause),
  ]);
  return { items: rows.map(toSlide), total: totalRows[0]?.value ?? 0 };
}

export async function findAllHeroSlides(): Promise<HeroSlide[]> {
  const db = getDb();
  if (!db) return seedAll();
  const rows = await db.select().from(heroSlides).orderBy(asc(heroSlides.displayOrder));
  return rows.map(toSlide);
}

export async function findHeroSlideById(id: number): Promise<HeroSlide | null> {
  const db = requireDb();
  const rows = await db.select().from(heroSlides).where(eq(heroSlides.id, id)).limit(1);
  const row = rows[0];
  if (!row) return null;
  return toSlide(row);
}

// মোট স্লাইড সংখ্যা — ৬-স্লাইড ক্যাপ যাচাইয়ের জন্য। DB না থাকলে বীজ-দৈর্ঘ্য।
export async function countHeroSlides(): Promise<number> {
  const db = getDb();
  if (!db) return heroSlidesSeed.length;
  const rows = await db.select({ value: count() }).from(heroSlides);
  return rows[0]?.value ?? 0;
}

export async function createHeroSlideRecord(input: CreateHeroSlide): Promise<HeroSlide> {
  const db = requireDb();
  const rows = await db
    .insert(heroSlides)
    .values({
      imageKey: input.imageKey,
      badge: input.badge,
      title: input.title,
      description: input.description,
      displayOrder: input.order ?? 0,
      published: input.published ?? true,
    })
    .returning();
  const row = rows[0];
  if (!row) throw new AppError("INTERNAL", 500, "Internal error");
  return toSlide(row);
}

export async function updateHeroSlideRecord(
  id: number,
  patch: UpdateHeroSlide,
): Promise<HeroSlide | null> {
  const db = requireDb();
  const set: Partial<typeof heroSlides.$inferInsert> = {};
  if (patch.imageKey !== undefined) set.imageKey = patch.imageKey;
  if (patch.badge !== undefined) set.badge = patch.badge;
  if (patch.title !== undefined) set.title = patch.title;
  if (patch.description !== undefined) set.description = patch.description;
  if (patch.order !== undefined) set.displayOrder = patch.order;
  if (patch.published !== undefined) set.published = patch.published;
  const rows = await db
    .update(heroSlides)
    .set({ ...set, updatedAt: new Date() })
    .where(eq(heroSlides.id, id))
    .returning();
  const row = rows[0];
  if (!row) return null;
  return toSlide(row);
}

export async function deleteHeroSlideRecord(id: number): Promise<HeroSlide | null> {
  const db = requireDb();
  const rows = await db.delete(heroSlides).where(eq(heroSlides.id, id)).returning();
  const row = rows[0];
  if (!row) return null;
  return toSlide(row);
}
