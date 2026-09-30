import { createServiceImageSchema } from "@/packages/contracts/src/service.schema";
import { requireAdmin } from "@/server/lib/admin-auth";
import { BadRequest, fail, ok, withReqId } from "@/server/lib/response";
import { addServiceImage } from "@/server/modules/services/services.service";

export const dynamic = "force-dynamic";

// সেবায় ছবি যোগ — {imageKey, alt?, order?}।
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const body: unknown = await req.json().catch(() => null);
    const parsed = createServiceImageSchema.safeParse(
      typeof body === "object" && body !== null ? { ...(body as object), serviceId: id } : { serviceId: id },
    );
    if (!parsed.success) throw BadRequest("Invalid image data");
    const image = await addServiceImage(id, {
      imageKey: parsed.data.imageKey,
      ...(parsed.data.alt !== undefined ? { alt: parsed.data.alt } : {}),
      ...(parsed.data.order !== undefined ? { order: parsed.data.order } : {}),
    });
    return ok(image, "Image added", undefined, 201);
  } catch (err) {
    return fail(err, reqId);
  }
}
