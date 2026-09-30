import { updateProjectSchema } from "@/packages/contracts/src/project.schema";
import { requireAdmin } from "@/server/lib/admin-auth";
import { BadRequest, fail, ok, withReqId } from "@/server/lib/response";
import { deleteProject, getAdminProjectById, updateProject } from "@/server/modules/projects/projects.service";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const item = await getAdminProjectById(id);
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
    const parsed = updateProjectSchema.safeParse(body);
    if (!parsed.success) throw BadRequest("Invalid project data");
    const item = await updateProject(id, parsed.data);
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
    const item = await deleteProject(id);
    return ok(item, "Deleted");
  } catch (err) {
    return fail(err, reqId);
  }
}
