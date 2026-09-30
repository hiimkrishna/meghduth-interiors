import { requireAdmin } from "@/server/lib/admin-auth";
import { fail, ok, withReqId } from "@/server/lib/response";
import { getAuditLogs, logAdminAction } from "@/server/modules/audit/audit.service";
import type { CreateAuditLogInput } from "@/server/modules/audit/audit.types";

export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    const admin = await requireAdmin(req);
    const url = new URL(req.url);
    
    const filters = {
      adminId: url.searchParams.get("adminId") || undefined,
      action: url.searchParams.get("action") || undefined,
      resourceType: url.searchParams.get("resourceType") || undefined,
      resourceId: url.searchParams.get("resourceId") || undefined,
      fromDate: url.searchParams.get("fromDate") ? new Date(url.searchParams.get("fromDate")!) : undefined,
      toDate: url.searchParams.get("toDate") ? new Date(url.searchParams.get("toDate")!) : undefined,
      page: url.searchParams.get("page") ? parseInt(url.searchParams.get("page")!) : undefined,
      limit: url.searchParams.get("limit") ? parseInt(url.searchParams.get("limit")!) : undefined,
    };

    const result = await getAuditLogs(filters);
    return ok(result.items, undefined, { 
      total: result.total, 
      page: result.page, 
      limit: result.limit, 
      totalPages: result.totalPages 
    });
  } catch (err) {
    return fail(err, reqId);
  }
}

export async function POST(req: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    const admin = await requireAdmin(req);
    const body: unknown = await req.json().catch(() => null);
    
    const input = body as Partial<CreateAuditLogInput>;
    if (!input.action || !input.resourceType) {
      return fail(new Error("VALIDATION_ERROR: action and resourceType are required"), reqId);
    }

    const fullInput: CreateAuditLogInput = {
      adminId: admin.id,
      adminEmail: admin.email,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      oldData: input.oldData,
      newData: input.newData,
      ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
      userAgent: req.headers.get("user-agent") || undefined,
    };

    const log = await logAdminAction(fullInput);
    return ok(log, "Audit log created", undefined, 201);
  } catch (err) {
    return fail(err, reqId);
  }
}