import type { CreateLead, Lead, LeadSource, LeadStatus } from "@/packages/contracts/src/lead.schema";
import { canTransitionLead, leadSourceSchema, leadStatusSchema } from "@/packages/contracts/src/lead.schema";
import { BadRequest, NotFound, Unprocessable } from "@/server/lib/response";
import {
  createLeadRecord,
  findLeadById,
  findLeadsPage,
  transitionLeadRecord,
} from "./leads.repository";
import type { LeadsPage } from "./leads.repository";

export interface ListLeadsInput {
  status?: LeadStatus;
  page: number;
  limit: number;
}

// মোটা সার্ভিস — অবস্থা যন্ত্রের নিয়ম এখানে। DB সরাসরি ধরা নিষেধ।
export async function createLead(input: CreateLead): Promise<Lead> {
  return createLeadRecord(input);
}

export async function transitionLead(id: Lead["id"], to: LeadStatus): Promise<Lead> {
  const current = await findLeadById(id);
  if (current === null) throw NotFound("Lead not found");
  if (!canTransitionLead(current.status, to)) throw Unprocessable("Invalid status transition");
  const next = await transitionLeadRecord(id, to);
  if (next === null) throw NotFound("Lead not found");
  return next;
}

function clampPage(n: number): number {
  if (!Number.isInteger(n) || n < 1) return 1;
  return n;
}

function clampLimit(n: number): number {
  if (!Number.isInteger(n) || n < 1) return 20;
  if (n > 100) return 100;
  return n;
}

export async function listLeads(input: {
  status?: unknown;
  source?: unknown;
  page?: unknown;
  limit?: unknown;
}): Promise<LeadsPage> {
  let status: LeadStatus | undefined;
  if (input.status !== undefined && input.status !== "") {
    const parsed = leadStatusSchema.safeParse(input.status);
    if (!parsed.success) throw BadRequest("Invalid lead status");
    status = parsed.data;
  }
  let source: LeadSource | undefined;
  if (input.source !== undefined && input.source !== "") {
    const parsed = leadSourceSchema.safeParse(input.source);
    if (!parsed.success) throw BadRequest("Invalid lead source");
    source = parsed.data;
  }
  const page = clampPage(typeof input.page === "number" ? input.page : Number(input.page ?? 1));
  const limit = clampLimit(typeof input.limit === "number" ? input.limit : Number(input.limit ?? 20));
  return findLeadsPage({
    ...(status !== undefined ? { status } : {}),
    ...(source !== undefined ? { source } : {}),
    page,
    limit,
  });
}
