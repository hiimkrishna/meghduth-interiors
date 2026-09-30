import { updateServiceSchema } from "@/packages/contracts/src/service.schema";
import { requireAdmin } from "@/server/lib/admin-auth";
import { BadRequest, fail, ok, withReqId } from "@/server/lib/response";
import { deleteService, getAdminServiceById, updateService } from "@/server/modules/services/services.service";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const item = await getAdminServiceById(id);
    return ok(item);
  } catch (err) {
    return fail(err, reqId);
  }
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const body: unknown = await req.json().catch(() => null);
    const parsed = updateServiceSchema.safeParse(body);
    if (!parsed.success) throw BadRequest("Invalid service data");
    const item = await updateService(id, parsed.data);
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
    const item = await deleteService(id);
    return ok(item, "Deleted");
  } catch (err) {
    return fail(err, reqId);
  }
}
