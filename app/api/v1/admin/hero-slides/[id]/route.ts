import { updateHeroSlideSchema } from "@/packages/contracts/src/hero.schema";
import { requireAdmin } from "@/server/lib/admin-auth";
import { BadRequest, fail, ok, withReqId } from "@/server/lib/response";
import { deleteHeroSlide, updateHeroSlide } from "@/server/modules/hero-slides/hero-slides.service";

export const dynamic = "force-dynamic";

async function getId(ctx: { params: Promise<{ id: string }> }): Promise<string> {
  const { id } = await ctx.params;
  return id;
}

// অ্যাডমিন হালনাগাদ — আংশিক contracts স্কিমায় যাচাই।
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const id = await getId(ctx);
    const body: unknown = await req.json().catch(() => null);
    const parsed = updateHeroSlideSchema.safeParse(body);
    if (!parsed.success) throw BadRequest("Invalid hero slide data");
    const item = await updateHeroSlide(id, parsed.data);
    return ok(item, "Updated");
  } catch (err) {
    return fail(err, reqId);
  }
}

// অ্যাডমিন মোছা — না পেলে ৪০৪।
export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const id = await getId(ctx);
    const item = await deleteHeroSlide(id);
    return ok(item, "Deleted");
  } catch (err) {
    return fail(err, reqId);
  }
}
