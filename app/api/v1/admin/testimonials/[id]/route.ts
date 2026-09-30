import { updateTestimonialSchema } from "@/packages/contracts/src/testimonial.schema";
import { requireAdmin } from "@/server/lib/admin-auth";
import { BadRequest, fail, ok, withReqId } from "@/server/lib/response";
import {
  deleteTestimonial,
  updateTestimonial,
} from "@/server/modules/testimonials/testimonials.service";

export const dynamic = "force-dynamic";

// অ্যাডমিন হালনাগাদ — পূর্ণ সম্পাদনা (update স্কিমা: কনটেন্ট + status/published)।
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const body: unknown = await req.json().catch(() => null);
    const parsed = updateTestimonialSchema.safeParse(body);
    if (!parsed.success) throw BadRequest("Invalid testimonial data");
    const item = await updateTestimonial(id, parsed.data);
    return ok(item, "Testimonial updated");
  } catch (err) {
    return fail(err, reqId);
  }
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const item = await deleteTestimonial(id);
    return ok(item, "Testimonial deleted");
  } catch (err) {
    return fail(err, reqId);
  }
}
