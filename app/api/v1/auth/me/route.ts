import { fail, ok, withReqId } from "@/server/lib/response";
import { requireAdmin } from "@/server/lib/admin-auth";

// নিজের পরিচয় — টোকেন যাচাই + প্রোফাইল। 401/403 হলে fail খামে ফেরে।
export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    const admin = await requireAdmin(req);
    return ok(admin);
  } catch (err) {
    return fail(err, reqId);
  }
}
