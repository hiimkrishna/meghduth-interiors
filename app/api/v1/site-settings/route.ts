import { getSiteSettingsController } from "@/server/modules/site-settings/site-settings.controller";

// পাবলিক পড়া রুট — সাইট সেটিংস।
export async function GET(): Promise<Response> {
  const res = await getSiteSettingsController();
  res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=300");
  return res;
}
