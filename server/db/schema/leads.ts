// বাস্তব স্কিমা server/db/drizzle-schema.ts-এ — এগুলো ডকুমেন্টেশন
import type { CreateLead, Lead, LeadStatus } from "@/packages/contracts/src/lead.schema";

export type { CreateLead, Lead, LeadStatus };

// leads_inquiries — কলাম: id | name | email | phone | subject | message | status | created_at | updated_at
export const LEADS_TABLE = "leads_inquiries" as const;

export interface LeadRow {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}
