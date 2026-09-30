import { updateLeadStatusSchema } from "@/packages/contracts/src/lead.schema";
import { requireAdmin } from "@/server/lib/admin-auth";
import { BadRequest, fail, NotFound, ok, withReqId } from "@/server/lib/response";
import { transitionLead } from "@/server/modules/leads/leads.service";

export const dynamic = "force-dynamic";

// অ্যাডমিন লিড অবস্থা বদল — {status}, অবৈধ লাফে ৪২২।
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) throw NotFound("Lead not found");
    const body: unknown = await req.json().catch(() => null);
    const parsed = updateLeadStatusSchema.safeParse(body);
    if (!parsed.success) throw BadRequest("Invalid lead status data");
    const lead = await transitionLead(numericId, parsed.data.status);
    return ok(lead, "Updated");
  } catch (err) {
    return fail(err, reqId);
  }
}
