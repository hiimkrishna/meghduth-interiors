import { updateNavigationItemSchema } from "@/packages/contracts/src/site.schema";
import { requireAdmin } from "@/server/lib/admin-auth";
import { BadRequest, fail, ok, withReqId } from "@/server/lib/response";
import {
  deleteNavigation,
  updateNavigation,
} from "@/server/modules/navigations/navigations.service";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const body: unknown = await req.json().catch(() => null);
    const parsed = updateNavigationItemSchema.safeParse(body);
    if (!parsed.success) throw BadRequest("Invalid navigation data");
    const item = await updateNavigation(id, parsed.data);
    return ok(item, "Updated");
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
    const item = await deleteNavigation(id);
    return ok(item, "Deleted");
  } catch (err) {
    return fail(err, reqId);
  }
}
