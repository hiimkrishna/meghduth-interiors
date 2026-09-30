import { requireAdmin } from "@/server/lib/admin-auth";
import { fail, ok, withReqId } from "@/server/lib/response";
import { listLeads } from "@/server/modules/leads/leads.service";

export const dynamic = "force-dynamic";

// অ্যাডমিন লিড তালিকা — ?source=&status=&page=&limit=, meta সহ।
export async function GET(req: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const url = new URL(req.url);
    const status = url.searchParams.get("status") ?? undefined;
    const source = url.searchParams.get("source") ?? undefined;
    const pageRaw = url.searchParams.get("page") ?? undefined;
    const limitRaw = url.searchParams.get("limit") ?? undefined;
    const pageNum = pageRaw !== undefined ? Number(pageRaw) : 1;
    const limitNum = limitRaw !== undefined ? Number(limitRaw) : 20;
    const page = Number.isInteger(pageNum) && pageNum >= 1 ? pageNum : 1;
    const limit = Number.isInteger(limitNum) && limitNum >= 1 ? limitNum : 20;
    const result = await listLeads({ status, source, page, limit });
    return ok(result.items, undefined, result.meta);
  } catch (err) {
    return fail(err, reqId);
  }
}
