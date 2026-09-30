import { api } from "@/lib/api";
import { cached } from "@/lib/client-cache";
import type { SiteSettings } from "@/packages/contracts/src/site.schema";

// সাইট সেটিংস — এক সারির বস্তু, Envelope lib/api খোলে।
export async function getSiteSettings(): Promise<SiteSettings> {
  return cached("site-settings", () => api.get<SiteSettings>("/site-settings"));
}
