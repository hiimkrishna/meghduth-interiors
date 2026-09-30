import { and, asc, count, eq } from "drizzle-orm";
import type {
  CreateNavigationItem,
  NavigationItem,
  UpdateNavigationItem,
} from "@/packages/contracts/src/site.schema";
import { getDb } from "@/server/db/client";
import { navigations } from "@/server/db/drizzle-schema";
import { AppError } from "@/server/lib/response";

// বোকা রেপোজিটরি — শুধু তথ্য পড়া। ব্যবসার নিয়ম এখানে নিষেধ।
// DB থাকলে drizzle, না থাকলে বীজ-ফলব্যাক।
import { navigationsSeed } from "@/server/db/seed-data";

function seedVisible(): NavigationItem[] {
  return navigationsSeed
    .filter((n) => n.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function seedAll(): NavigationItem[] {
  return [...navigationsSeed].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function seedFooter(): NavigationItem[] {
  return navigationsSeed
    .filter((n) => n.visible !== false && n.showInFooter !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function toNavigation(r: typeof navigations.$inferSelect): NavigationItem {
  return {
    id: r.id,
    label: r.label,
    title: r.label,
    href: r.href,
    order: r.displayOrder,
    visible: r.visible,
    showInFooter: r.showInFooter,
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

export async function findVisibleNavigations(
  opts?: PublishedPage,
): Promise<{ items: NavigationItem[]; total: number }> {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 50;
  const offset = (page - 1) * limit;
  const db = getDb();
  if (!db) {
    const all = seedVisible();
    return { items: all.slice(offset, offset + limit), total: all.length };
  }
  const whereClause = eq(navigations.visible, true);
  const [rows, totalRows] = await Promise.all([
    db
      .select()
      .from(navigations)
      .where(whereClause)
      .orderBy(asc(navigations.displayOrder))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(navigations).where(whereClause),
  ]);
  return { items: rows.map(toNavigation), total: totalRows[0]?.value ?? 0 };
}

export async function findFooterNavigations(): Promise<NavigationItem[]> {
  const db = getDb();
  if (!db) return seedFooter();
  const rows = await db
    .select()
    .from(navigations)
    .where(and(eq(navigations.visible, true), eq(navigations.showInFooter, true)))
    .orderBy(asc(navigations.displayOrder));
  return rows.map(toNavigation);
}

export async function findAllNavigations(): Promise<NavigationItem[]> {
  const db = getDb();
  if (!db) return seedAll();
  const rows = await db.select().from(navigations).orderBy(asc(navigations.displayOrder));
  return rows.map(toNavigation);
}

export async function findNavigationById(id: number): Promise<NavigationItem | null> {
  const db = requireDb();
  const rows = await db.select().from(navigations).where(eq(navigations.id, id)).limit(1);
  const row = rows[0];
  if (!row) return null;
  return toNavigation(row);
}

export async function createNavigationRecord(input: CreateNavigationItem): Promise<NavigationItem> {
  const db = requireDb();
  const rows = await db
    .insert(navigations)
    .values({
      label: input.label,
      href: input.href,
      displayOrder: input.order ?? 0,
      visible: input.visible ?? true,
      showInFooter: input.showInFooter ?? true,
    })
    .returning();
  const row = rows[0];
  if (!row) throw new AppError("INTERNAL", 500, "Internal error");
  return toNavigation(row);
}

export async function updateNavigationRecord(
  id: number,
  patch: UpdateNavigationItem,
): Promise<NavigationItem | null> {
  const db = requireDb();
  const set: Partial<typeof navigations.$inferInsert> = {};
  if (patch.label !== undefined) set.label = patch.label;
  if (patch.href !== undefined) set.href = patch.href;
  if (patch.order !== undefined) set.displayOrder = patch.order;
  if (patch.visible !== undefined) set.visible = patch.visible;
  if (patch.showInFooter !== undefined) set.showInFooter = patch.showInFooter;
  const rows = await db
    .update(navigations)
    .set({ ...set, updatedAt: new Date() })
    .where(eq(navigations.id, id))
    .returning();
  const row = rows[0];
  if (!row) return null;
  return toNavigation(row);
}

export async function deleteNavigationRecord(id: number): Promise<NavigationItem | null> {
  const db = requireDb();
  const rows = await db.delete(navigations).where(eq(navigations.id, id)).returning();
  const row = rows[0];
  if (!row) return null;
  return toNavigation(row);
}
