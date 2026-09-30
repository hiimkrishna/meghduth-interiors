import { api } from "@/lib/api";
import { toArray } from "../shared/use-admin-list";
import type {
  SiteSettings,
  UpdateSiteSettings,
} from "@/packages/contracts/src/site.schema";

// সাইট সেটিংস — একক বস্তু পড়া/বদল।
export async function getAdminSiteSettings(): Promise<SiteSettings> {
  return api.get<SiteSettings>("/admin/site-settings");
}

export async function updateAdminSiteSettings(
  payload: UpdateSiteSettings,
): Promise<SiteSettings> {
  return api.patch<SiteSettings>("/admin/site-settings", payload);
}
