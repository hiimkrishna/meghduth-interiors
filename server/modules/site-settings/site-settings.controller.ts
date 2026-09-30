import { fail, ok, withReqId } from "@/server/lib/response";
import { getSiteSettings } from "@/server/modules/site-settings/site-settings.service";

// চিকন নিয়ন্ত্রক — সার্ভিস → জবাব। try/catch এখানে নয়, fail() দেখবে।
export async function getSiteSettingsController(): Promise<Response> {
  const reqId = withReqId();
  try {
    const settings = await getSiteSettings();
    return ok(settings);
  } catch (err) {
    return fail(err, reqId);
  }
}
