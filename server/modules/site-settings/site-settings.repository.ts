import { eq } from "drizzle-orm";
import type {
  SiteSettings,
  UpdateSiteSettings,
} from "@/packages/contracts/src/site.schema";
import { getDb } from "@/server/db/client";
import { siteSettings } from "@/server/db/drizzle-schema";
import { AppError } from "@/server/lib/response";

// বোকা রেপোজিটরি — শুধু তথ্য পড়া। ব্যবসার নিয়ম এখানে নিষেধ।
// DB থাকলে drizzle (এক সারি), না থাকলে বীজ-ফলব্যাক।
import { siteSettingsSeed } from "@/server/db/seed-data";

function toSettings(r: typeof siteSettings.$inferSelect): SiteSettings {
  return {
    siteName: r.siteName,
    ...(r.logoKey !== null ? { logoKey: r.logoKey } : {}),
    ...(r.phone !== null ? { phone: r.phone } : {}),
    ...(r.email !== null ? { email: r.email } : {}),
    ...(r.address !== null ? { address: r.address } : {}),
    ...(r.mapEmbedUrl !== null ? { mapEmbedUrl: r.mapEmbedUrl } : {}),
    ...(r.footerDescription !== null ? { footerDescription: r.footerDescription } : {}),
    ...(r.copyrightText !== null ? { copyright: r.copyrightText } : {}),
    socials: r.socials,
  };
}

function requireDb(): NonNullable<ReturnType<typeof getDb>> {
  const db = getDb();
  if (db === null) throw new AppError("INTERNAL", 503, "Database not ready");
  return db;
}

export async function getSiteSettingsRecord(): Promise<SiteSettings> {
  const db = getDb();
  if (!db) return siteSettingsSeed;
  const rows = await db.select().from(siteSettings).limit(1);
  const first = rows[0];
  if (!first) return siteSettingsSeed;
  return toSettings(first);
}

export async function upsertSiteSettingsRecord(patch: UpdateSiteSettings): Promise<SiteSettings> {
  const db = requireDb();
  const rows = await db.select().from(siteSettings).limit(1);
  const existing = rows[0];
  if (!existing) {
    if (patch.siteName === undefined) throw new AppError("VALIDATION_ERROR", 400, "siteName is required");
    const inserted = await db
      .insert(siteSettings)
      .values({
        siteName: patch.siteName,
        logoKey: patch.logoKey ?? null,
        phone: patch.phone ?? null,
        email: patch.email ?? null,
        address: patch.address ?? null,
        mapEmbedUrl: patch.mapEmbedUrl ?? null,
        footerDescription: patch.footerDescription ?? null,
        copyrightText: patch.copyright ?? null,
        socials: patch.socials ?? [],
        version: 1,
      })
      .returning();
    const row = inserted[0];
    if (!row) throw new AppError("INTERNAL", 500, "Internal error");
    return toSettings(row);
  }
  const set: Partial<typeof siteSettings.$inferInsert> = {};
  if (patch.siteName !== undefined) set.siteName = patch.siteName;
  if (patch.logoKey !== undefined) set.logoKey = patch.logoKey;
  if (patch.phone !== undefined) set.phone = patch.phone;
  if (patch.email !== undefined) set.email = patch.email;
  if (patch.address !== undefined) set.address = patch.address;
  if (patch.mapEmbedUrl !== undefined) set.mapEmbedUrl = patch.mapEmbedUrl;
  if (patch.footerDescription !== undefined) set.footerDescription = patch.footerDescription;
  if (patch.copyright !== undefined) set.copyrightText = patch.copyright;
  if (patch.socials !== undefined) set.socials = patch.socials;
  const updated = await db
    .update(siteSettings)
    .set({ ...set, version: existing.version + 1, updatedAt: new Date() })
    .where(eq(siteSettings.id, existing.id))
    .returning();
  const row = updated[0];
  if (!row) throw new AppError("INTERNAL", 500, "Internal error");
  return toSettings(row);
}
