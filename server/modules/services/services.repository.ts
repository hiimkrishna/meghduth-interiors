import { asc, count, eq } from "drizzle-orm";
import type {
  CreateService,
  ServiceImage,
  ServiceItem,
  UpdateService,
} from "@/packages/contracts/src/service.schema";
import { getDb } from "@/server/db/client";
import { serviceImages, services } from "@/server/db/drizzle-schema";
import { AppError } from "@/server/lib/response";

// বোকা রেপোজিটরি — শুধু তথ্য পড়া। ব্যবসার নিয়ম এখানে নিষেধ।
// DB থাকলে drizzle, না থাকলে বীজ-ফলব্যাক।
import { servicesSeed } from "@/server/db/seed-data";

function seedPublished(): ServiceItem[] {
  return servicesSeed
    .filter((s) => s.published !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function seedAll(): ServiceItem[] {
  return [...servicesSeed].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function toService(r: typeof services.$inferSelect): ServiceItem {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description,
    ...(r.imageKey !== null ? { imageKey: r.imageKey } : {}),
    order: r.displayOrder,
    published: r.published,
  };
}

function toServiceImage(r: typeof serviceImages.$inferSelect): ServiceImage {
  return {
    id: r.id,
    serviceId: r.serviceId,
    imageKey: r.imageKey,
    ...(r.alt !== null ? { alt: r.alt } : {}),
    order: r.displayOrder,
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

export async function findPublishedServices(
  opts?: PublishedPage,
): Promise<{ items: ServiceItem[]; total: number }> {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 50;
  const offset = (page - 1) * limit;
  const db = getDb();
  if (!db) {
    const all = seedPublished();
    return { items: all.slice(offset, offset + limit), total: all.length };
  }
  const whereClause = eq(services.published, true);
  const [rows, totalRows] = await Promise.all([
    db
      .select()
      .from(services)
      .where(whereClause)
      .orderBy(asc(services.displayOrder))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(services).where(whereClause),
  ]);
  return { items: rows.map(toService), total: totalRows[0]?.value ?? 0 };
}

export async function findAllServices(): Promise<ServiceItem[]> {
  const db = getDb();
  if (!db) return seedAll();
  const rows = await db.select().from(services).orderBy(asc(services.displayOrder));
  return rows.map(toService);
}

export async function findServiceById(id: string): Promise<ServiceItem | null> {
  const db = requireDb();
  const rows = await db.select().from(services).where(eq(services.id, id)).limit(1);
  const row = rows[0];
  if (!row) return null;
  return toService(row);
}

export async function findServiceBySlug(slug: string): Promise<ServiceItem | null> {
  const db = requireDb();
  const rows = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  const row = rows[0];
  if (!row) return null;
  return toService(row);
}

export async function createServiceRecord(input: CreateService): Promise<ServiceItem> {
  const db = requireDb();
  const rows = await db
    .insert(services)
    .values({
      slug: input.slug,
      title: input.title,
      description: input.description,
      imageKey: input.imageKey ?? null,
      displayOrder: input.order ?? 0,
      published: input.published ?? true,
    })
    .returning();
  const row = rows[0];
  if (!row) throw new AppError("INTERNAL", 500, "Internal error");
  return toService(row);
}

export async function updateServiceRecord(
  id: string,
  patch: UpdateService,
): Promise<ServiceItem | null> {
  const db = requireDb();
  const set: Partial<typeof services.$inferInsert> = {};
  if (patch.slug !== undefined) set.slug = patch.slug;
  if (patch.title !== undefined) set.title = patch.title;
  if (patch.description !== undefined) set.description = patch.description;
  if (patch.imageKey !== undefined) set.imageKey = patch.imageKey;
  if (patch.order !== undefined) set.displayOrder = patch.order;
  if (patch.published !== undefined) set.published = patch.published;
  const rows = await db
    .update(services)
    .set({ ...set, updatedAt: new Date() })
    .where(eq(services.id, id))
    .returning();
  const row = rows[0];
  if (!row) return null;
  return toService(row);
}

export async function deleteServiceRecord(id: string): Promise<ServiceItem | null> {
  const db = requireDb();
  await db.delete(serviceImages).where(eq(serviceImages.serviceId, id));
  const rows = await db.delete(services).where(eq(services.id, id)).returning();
  const row = rows[0];
  if (!row) return null;
  return toService(row);
}

export interface CreateServiceImageInput {
  imageKey: string;
  alt?: string;
  order?: number;
}

export async function findServiceImages(serviceId: string): Promise<ServiceImage[]> {
  const db = requireDb();
  const rows = await db
    .select()
    .from(serviceImages)
    .where(eq(serviceImages.serviceId, serviceId))
    .orderBy(asc(serviceImages.displayOrder));
  return rows.map(toServiceImage);
}

export async function addServiceImageRecord(
  serviceId: string,
  input: CreateServiceImageInput,
): Promise<ServiceImage> {
  const db = requireDb();
  const rows = await db
    .insert(serviceImages)
    .values({
      serviceId,
      imageKey: input.imageKey,
      alt: input.alt ?? null,
      displayOrder: input.order ?? 0,
    })
    .returning();
  const row = rows[0];
  if (!row) throw new AppError("INTERNAL", 500, "Internal error");
  return toServiceImage(row);
}

export async function removeServiceImageRecord(id: number): Promise<ServiceImage | null> {
  const db = requireDb();
  const rows = await db.delete(serviceImages).where(eq(serviceImages.id, id)).returning();
  const row = rows[0];
  if (!row) return null;
  return toServiceImage(row);
}
