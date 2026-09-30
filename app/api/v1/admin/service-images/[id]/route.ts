import { requireAdmin } from "@/server/lib/admin-auth";
import { fail, ok, withReqId } from "@/server/lib/response";
import { removeServiceImage } from "@/server/modules/services/services.service";

export const dynamic = "force-dynamic";

// সেবা-গ্যালারি থেকে ছবি মোছো।
export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const image = await removeServiceImage(id);
    return ok(image, "Image removed");
  } catch (err) {
    return fail(err, reqId);
  }
}
