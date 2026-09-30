import { createTeamMemberSchema } from "@/packages/contracts/src/team.schema";
import { requireAdmin } from "@/server/lib/admin-auth";
import { BadRequest, fail, ok, withReqId } from "@/server/lib/response";
import { createTeamMember, listAllTeamMembers } from "@/server/modules/team/team.service";

export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const items = await listAllTeamMembers();
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
    const parsed = createTeamMemberSchema.safeParse(body);
    if (!parsed.success) throw BadRequest("Invalid team member data");
    const item = await createTeamMember(parsed.data);
    return ok(item, "Created", undefined, 201);
  } catch (err) {
    return fail(err, reqId);
  }
}
