import { api } from "@/lib/api";
import { toArray } from "../shared/use-admin-list";
import {
  LEAD_STATUSES,
  leadSourceSchema,
  type Lead,
  type LeadSource,
  type LeadStatus,
} from "@/packages/contracts/src/lead.schema";
import type { AdminId } from "../hero-slides/hero-slides.service";

// লিড তালিকা (উৎস + অবস্থা ফিল্টার + পাতা) ও অবস্থা বদল।
export interface LeadListParams {
  source?: LeadSource;
  status?: LeadStatus;
  page?: number;
  limit?: number;
}

export async function listAdminLeads(params: LeadListParams): Promise<Lead[]> {
  const data = await api.get<unknown>("/admin/leads", {
    source: params.source,
    status: params.status,
    page: params.page,
    limit: params.limit,
  });
  return toArray<Lead>(data);
}

export async function updateAdminLeadStatus(
  id: AdminId,
  status: LeadStatus,
): Promise<Lead> {
  return api.patch<Lead>(`/admin/leads/${String(id)}`, { status });
}

// API থেকে আসা খোলা স্ট্রিং নিরাপদ অবস্থায় নাও।
export function parseLeadStatus(value: unknown): LeadStatus | null {
  if (
    typeof value === "string" &&
    (LEAD_STATUSES as readonly string[]).includes(value)
  ) {
    return value as LeadStatus;
  }
  return null;
}

export const LEAD_SOURCES = leadSourceSchema.options;

export function parseLeadSource(value: unknown): LeadSource | null {
  const parsed = leadSourceSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
