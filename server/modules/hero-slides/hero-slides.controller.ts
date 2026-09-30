import { fail, ok, withReqId } from "@/server/lib/response";
import { listPublishedHeroSlides } from "@/server/modules/hero-slides/hero-slides.service";

// চিকন নিয়ন্ত্রক — বৈধতা → সার্ভিস → জবাব। try/catch এখানে নয়, fail() দেখবে।
export async function listHeroSlidesController(req?: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    const url = req !== undefined ? new URL(req.url) : null;
    const page = url?.searchParams.get("page") ?? undefined;
    const limit = url?.searchParams.get("limit") ?? undefined;
    const { items, meta } = await listPublishedHeroSlides({ page, limit });
    return ok(items, undefined, meta);
  } catch (err) {
    return fail(err, reqId);
  }
}
