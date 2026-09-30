import { cache } from "react";
import type { SiteSettings, UpdateSiteSettings } from "@/packages/contracts/src/site.schema";
import { updateSiteSettingsSchema } from "@/packages/contracts/src/site.schema";
import { BadRequest } from "@/server/lib/response";
import {
  getSiteSettingsRecord,
  upsertSiteSettingsRecord,
} from "./site-settings.repository";

// মোটা সার্ভিস — এক সারির সেটিংস। DB সরাসরি ধরা নিষেধ, repo দিয়ে যাবে।
export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await getSiteSettingsRecord();
  return settings;
}

// অনুরোধ-স্কোপ মেমোইজ — একই রেন্ডারে layout+footer দুবার DB ছোঁয় না।
export const getCachedSiteSettings = cache(async (): Promise<SiteSettings> => {
  return getSiteSettingsRecord();
});

export async function updateSiteSettings(patch: UpdateSiteSettings): Promise<SiteSettings> {
  const parsed = updateSiteSettingsSchema.safeParse(patch);
  if (!parsed.success) throw BadRequest("Invalid site settings");
  if (Object.keys(parsed.data).length === 0) throw BadRequest("Invalid site settings");
  return upsertSiteSettingsRecord(parsed.data);
}
