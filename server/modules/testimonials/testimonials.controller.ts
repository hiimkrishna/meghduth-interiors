import { fail, ok, withReqId } from "@/server/lib/response";
import { listApprovedTestimonials } from "@/server/modules/testimonials/testimonials.service";

// চিকন নিয়ন্ত্রক — সার্ভিস → জবাব। try/catch এখানে নয়, fail() দেখবে।
export async function listTestimonialsController(req?: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    const url = req !== undefined ? new URL(req.url) : null;
    const page = url?.searchParams.get("page") ?? undefined;
    const limit = url?.searchParams.get("limit") ?? undefined;
    const { items, meta } = await listApprovedTestimonials({ page, limit });
    return ok(items, undefined, meta);
  } catch (err) {
    return fail(err, reqId);
  }
}
