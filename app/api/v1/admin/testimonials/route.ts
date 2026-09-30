import { createTestimonialSchema } from "@/packages/contracts/src/testimonial.schema";
import { requireAdmin } from "@/server/lib/admin-auth";
import { BadRequest, fail, ok, withReqId } from "@/server/lib/response";
import {
  createTestimonial,
  listAllTestimonials,
} from "@/server/modules/testimonials/testimonials.service";

export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const items = await listAllTestimonials();
    return ok(items, undefined, { total: items.length, page: 1, limit: items.length, totalPages: 1 });
  } catch (err) {
    return fail(err, reqId);
  }
}

export async function POST(req: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const body: unknown = await req.json().catch(() => null);
    const parsed = createTestimonialSchema.safeParse(body);
    if (!parsed.success) throw BadRequest("Invalid testimonial data");
    const item = await createTestimonial(parsed.data);
    return ok(item, "Created", undefined, 201);
  } catch (err) {
    return fail(err, reqId);
  }
}
