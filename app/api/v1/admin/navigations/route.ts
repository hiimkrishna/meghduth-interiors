import { createNavigationItemSchema } from "@/packages/contracts/src/site.schema";
import { requireAdmin } from "@/server/lib/admin-auth";
import { BadRequest, fail, ok, withReqId } from "@/server/lib/response";
import {
  createNavigation,
  listAllNavigations,
} from "@/server/modules/navigations/navigations.service";

export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const items = await listAllNavigations();
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
    const parsed = createNavigationItemSchema.safeParse(body);
    if (!parsed.success) throw BadRequest("Invalid navigation data");
    const item = await createNavigation(parsed.data);
    return ok(item, "Created", undefined, 201);
  } catch (err) {
    return fail(err, reqId);
  }
}
