import { and, asc, count, eq } from "drizzle-orm";
import type { PageMeta } from "@/packages/contracts/src/pagination";
import { buildPageMeta } from "@/packages/contracts/src/pagination";
import type { CreateLead, Lead, LeadSource, LeadStatus } from "@/packages/contracts/src/lead.schema";
import { getDb } from "@/server/db/client";
import { leadsInquiries } from "@/server/db/drizzle-schema";
import { AppError } from "@/server/lib/response";

// স্মৃতি ভান্ডার — DB না থাকলে ফলব্যাক। ব্যবসার নিয়ম এখানে নিষেধ।
// DB থাকলে leads_inquiries টেবিলে insert/select/update।
const leadsStore: Lead[] = [];
let leadSeq = 1;

export interface ListLeadsFilter {
  status?: LeadStatus;
  source?: LeadSource;
  page: number;
  limit: number;
}

export interface LeadsPage {
  items: Lead[];
  meta: PageMeta;
}

function toLead(r: typeof leadsInquiries.$inferSelect): Lead {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    ...(r.phone !== null ? { phone: r.phone } : {}),
    ...(r.subject !== null ? { subject: r.subject } : {}),
    message: r.message,
    source: r.source === "newsletter" ? "newsletter" : "contact-form",
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  };
}

function createMemoryLead(input: CreateLead): Lead {
  const lead: Lead = {
    ...input,
    source: input.source ?? "contact-form",
    id: leadSeq++,
    status: "NEW",
    createdAt: new Date().toISOString(),
  };
  leadsStore.push(lead);
  return lead;
}

function requireDb(): NonNullable<ReturnType<typeof getDb>> {
  const db = getDb();
  if (db === null) throw new AppError("INTERNAL", 503, "Database not ready");
  return db;
}

export async function createLeadRecord(input: CreateLead): Promise<Lead> {
  const db = getDb();
  if (!db) return createMemoryLead(input);
  const rows = await db
    .insert(leadsInquiries)
    .values({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      subject: input.subject ?? null,
      message: input.message,
      source: input.source ?? "contact-form",
      status: "NEW",
    })
    .returning();
  const row = rows[0];
  if (!row) return createMemoryLead(input);
  return toLead(row);
}

export async function findLeadById(id: Lead["id"]): Promise<Lead | null> {
  const db = getDb();
  if (!db) {
    const found = leadsStore.find((l) => l.id === id);
    return found ?? null;
  }
  if (typeof id !== "number") return null;
  const rows = await db.select().from(leadsInquiries).where(eq(leadsInquiries.id, id)).limit(1);
  const row = rows[0];
  if (!row) return null;
  return toLead(row);
}

export async function transitionLeadRecord(id: Lead["id"], to: LeadStatus): Promise<Lead | null> {
  const db = getDb();
  if (!db) {
    const lead = leadsStore.find((l) => l.id === id) ?? null;
    if (lead === null) return null;
    lead.status = to;
    return lead;
  }
  if (typeof id !== "number") return null;
  const rows = await db
    .update(leadsInquiries)
    .set({ status: to })
    .where(eq(leadsInquiries.id, id))
    .returning();
  const row = rows[0];
  if (!row) return null;
  return toLead(row);
}

export async function findAllLeads(): Promise<Lead[]> {
  const db = getDb();
  if (!db) return [...leadsStore];
  const rows = await db.select().from(leadsInquiries).orderBy(asc(leadsInquiries.id));
  return rows.map(toLead);
}

export async function findLeadsPage(filter: ListLeadsFilter): Promise<LeadsPage> {
  const db = requireDb();
  const offset = (filter.page - 1) * filter.limit;
  const conds = [];
  if (filter.status !== undefined) conds.push(eq(leadsInquiries.status, filter.status));
  if (filter.source !== undefined) conds.push(eq(leadsInquiries.source, filter.source));
  const where = conds.length > 0 ? and(...conds) : undefined;
  const counted =
    where !== undefined
      ? await db.select({ n: count() }).from(leadsInquiries).where(where)
      : await db.select({ n: count() }).from(leadsInquiries);
  const totalRow = counted[0];
  const total: number = totalRow ? Number(totalRow.n) : 0;
  const base = db.select().from(leadsInquiries).orderBy(asc(leadsInquiries.id));
  const rows =
    where !== undefined
      ? await base.where(where).limit(filter.limit).offset(offset)
      : await base.limit(filter.limit).offset(offset);
  return {
    items: rows.map(toLead),
    meta: buildPageMeta(total, { page: filter.page, limit: filter.limit }),
  };
}
