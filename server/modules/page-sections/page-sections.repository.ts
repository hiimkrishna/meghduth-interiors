import { and, eq } from "drizzle-orm";
import type {
  PageKey,
  UpsertPageSection,
} from "@/packages/contracts/src/page-section.schema";
import { getDb } from "@/server/db/client";
import { pageSections } from "@/server/db/drizzle-schema";
import { AppError } from "@/server/lib/response";

// বোকা রেপোজিটরি — শুধু তথ্য পড়া/লেখা। ব্যবসার নিয়ম এখানে নিষেধ।
// সারি না থাকা স্বাভাবিক — ভোক্তা কোড-ফলব্যাক দেখায়, তাই null ফেরে।
function requireDb(): NonNullable<ReturnType<typeof getDb>> {
  const db = getDb();
  if (db === null) throw new AppError("INTERNAL", 503, "Database not ready");
  return db;
}

export async function getSectionRecord(
  page: PageKey,
  section: string,
): Promise<Record<string, unknown> | null> {
  const db = getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(pageSections)
    .where(and(eq(pageSections.page, page), eq(pageSections.section, section)))
    .limit(1);
  const first = rows[0];
  if (!first) return null;
  return first.data;
}

export async function listPageRecords(
  page: PageKey,
): Promise<Record<string, Record<string, unknown>>> {
  const db = getDb();
  if (!db) return {};
  const rows = await db
    .select()
    .from(pageSections)
    .where(eq(pageSections.page, page));
  const out: Record<string, Record<string, unknown>> = {};
  for (const row of rows) out[row.section] = row.data;
  return out;
}

export async function upsertSectionRecord(
  input: UpsertPageSection,
): Promise<{ page: PageKey; section: string; data: Record<string, unknown> }> {
  const db = requireDb();
  const existing = await db
    .select()
    .from(pageSections)
    .where(
      and(eq(pageSections.page, input.page), eq(pageSections.section, input.section)),
    )
    .limit(1);
  const first = existing[0];
  if (!first) {
    const inserted = await db
      .insert(pageSections)
      .values({ page: input.page, section: input.section, data: input.data })
      .returning();
    const row = inserted[0];
    if (!row) throw new AppError("INTERNAL", 500, "Internal error");
    return { page: input.page, section: input.section, data: row.data };
  }
  const updated = await db
    .update(pageSections)
    .set({ data: input.data, updatedAt: new Date() })
    .where(eq(pageSections.id, first.id))
    .returning();
  const row = updated[0];
  if (!row) throw new AppError("INTERNAL", 500, "Internal error");
  return { page: input.page, section: input.section, data: row.data };
}
