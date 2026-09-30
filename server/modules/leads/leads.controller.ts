import { createLeadSchema } from "@/packages/contracts/src/lead.schema";
import { BadRequest, fail, ok, withReqId } from "@/server/lib/response";
import { createLead } from "@/server/modules/leads/leads.service";

// চিকন নিয়ন্ত্রক — বৈধতা → সার্ভিস → ২০১ জবাব। try/catch এখানে নয়, fail() দেখবে।
export async function createLeadController(body: unknown): Promise<Response> {
  const reqId = withReqId();
  try {
    const parsed = createLeadSchema.safeParse(body);
    if (!parsed.success) throw BadRequest("Invalid lead data");
    const lead = await createLead(parsed.data);
    return ok(lead, "Enquiry received", undefined, 201);
  } catch (err) {
    return fail(err, reqId);
  }
}
