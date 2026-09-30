import { fail, ok, withReqId } from "@/server/lib/response";
import { getPublishedProjectBySlug, listPublishedProjects } from "@/server/modules/projects/projects.service";

// চিকন নিয়ন্ত্রক — সার্ভিস → জবাব। try/catch এখানে নয়, fail() দেখবে।
export async function listProjectsController(req?: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    const url = req !== undefined ? new URL(req.url) : null;
    const page = url?.searchParams.get("page") ?? undefined;
    const limit = url?.searchParams.get("limit") ?? undefined;
    const { items, meta } = await listPublishedProjects({ page, limit });
    return ok(items, undefined, meta);
  } catch (err) {
    return fail(err, reqId);
  }
}

// একক প্রজেক্ট — slug দিয়ে, ছবিসহ।
export async function getProjectController(slug: string): Promise<Response> {
  const reqId = withReqId();
  try {
    const item = await getPublishedProjectBySlug(slug);
    return ok(item);
  } catch (err) {
    return fail(err, reqId);
  }
}
