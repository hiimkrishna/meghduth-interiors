import { requireAdmin } from "@/server/lib/admin-auth";
import { fail, ok, withReqId } from "@/server/lib/response";
import { removeProjectImage } from "@/server/modules/projects/projects.service";

export const dynamic = "force-dynamic";

// প্রজেক্ট ছবি মোছা।
export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const image = await removeProjectImage(id);
    return ok(image, "Deleted");
  } catch (err) {
    return fail(err, reqId);
  }
}
