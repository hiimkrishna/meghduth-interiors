import { fail, ok, withReqId } from "@/server/lib/response";
import { getPublishedServiceBySlug, listPublishedServices } from "@/server/modules/services/services.service";

// চিকন নিয়ন্ত্রক — সার্ভিস → জবাব। try/catch এখানে নয়, fail() দেখবে।
export async function listServicesController(req?: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    const url = req !== undefined ? new URL(req.url) : null;
    const page = url?.searchParams.get("page") ?? undefined;
    const limit = url?.searchParams.get("limit") ?? undefined;
    const { items, meta } = await listPublishedServices({ page, limit });
    return ok(items, undefined, meta);
  } catch (err) {
    return fail(err, reqId);
  }
}

// একক সেবা — slug দিয়ে।
export async function getServiceController(slug: string): Promise<Response> {
  const reqId = withReqId();
  try {
    const item = await getPublishedServiceBySlug(slug);
    return ok(item);
  } catch (err) {
    return fail(err, reqId);
  }
}
