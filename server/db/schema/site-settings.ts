// বাস্তব স্কিমা server/db/drizzle-schema.ts-এ — এগুলো ডকুমেন্টেশন
import type { SiteSettings, UpdateSiteSettings } from "@/packages/contracts/src/site.schema";

export type { SiteSettings, UpdateSiteSettings };

// site_settings — কলাম: id | site_name | logo_key | phone | email | address | map_embed_url | socials (jsonb) | version | updated_at
export const SITE_SETTINGS_TABLE = "site_settings" as const;

export interface SiteSettingsRow {
  id: number;
  siteName: string;
  logoKey: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  mapEmbedUrl: string | null;
  socials: SiteSettings["socials"];
  version: number;
  updatedAt: string;
}
