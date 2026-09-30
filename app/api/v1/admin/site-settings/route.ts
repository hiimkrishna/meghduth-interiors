import { updateSiteSettingsSchema } from "@/packages/contracts/src/site.schema";
import { requireAdmin } from "@/server/lib/admin-auth";
import { BadRequest, fail, ok, withReqId } from "@/server/lib/response";
import {
  getSiteSettings,
  updateSiteSettings,
} from "@/server/modules/site-settings/site-settings.service";

export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const settings = await getSiteSettings();
    return ok(settings);
  } catch (err) {
    return fail(err, reqId);
  }
}

export async function PATCH(req: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const body: unknown = await req.json().catch(() => null);
    const parsed = updateSiteSettingsSchema.safeParse(body);
    if (!parsed.success) throw BadRequest("Invalid site settings data");
    const settings = await updateSiteSettings(parsed.data);
    return ok(settings, "Updated");
  } catch (err) {
    return fail(err, reqId);
  }
}
