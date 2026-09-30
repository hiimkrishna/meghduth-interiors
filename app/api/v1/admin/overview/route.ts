import { requireAdmin } from "@/server/lib/admin-auth";
import { fail, ok, withReqId } from "@/server/lib/response";
import { getOverview } from "@/server/modules/overview/overview.service";

export const dynamic = "force-dynamic";

// অ্যাডমিন ওভারভিউ — ড্যাশবোর্ডের এক-কল বিশ্লেষণ (মনোযোগ/কনটেন্ট/ফানেল/সাম্প্রতিক)।
export async function GET(req: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const overview = await getOverview();
    return ok(overview);
  } catch (err) {
    return fail(err, reqId);
  }
}
