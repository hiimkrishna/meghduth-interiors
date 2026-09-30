import { updateTeamMemberSchema } from "@/packages/contracts/src/team.schema";
import { requireAdmin } from "@/server/lib/admin-auth";
import { BadRequest, fail, ok, withReqId } from "@/server/lib/response";
import { deleteTeamMember, updateTeamMember } from "@/server/modules/team/team.service";

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
    const parsed = updateTeamMemberSchema.safeParse(body);
    if (!parsed.success) throw BadRequest("Invalid team member data");
    const item = await updateTeamMember(id, parsed.data);
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
    const item = await deleteTeamMember(id);
    return ok(item, "Deleted");
  } catch (err) {
    return fail(err, reqId);
  }
}
