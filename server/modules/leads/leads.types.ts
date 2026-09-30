import type { CreateLead, Lead, LeadStatus } from "@/packages/contracts/src/lead.schema";

export type { CreateLead, Lead, LeadStatus };

// পেজ আকার — তালিকা + মোট সংখ্যা।
export interface LeadPage {
  items: Lead[];
  total: number;
}
