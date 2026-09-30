import { count, desc, eq } from "drizzle-orm";
import type { PageMeta } from "@/packages/contracts/src/pagination";
import { buildPageMeta } from "@/packages/contracts/src/pagination";
import type { InboxEmail } from "@/packages/contracts/src/inbox.schema";
import { getDb } from "@/server/db/client";
import { inboxEmails } from "@/server/db/drizzle-schema";
import { AppError } from "@/server/lib/response";
import type { ListInboxFilter, UpsertInboxEmailInput } from "./inbox.types";

export interface InboxPage {
  items: InboxEmail[];
  total: number;
  unread: number;
  meta: PageMeta;
}

function toInboxEmail(r: typeof inboxEmails.$inferSelect): InboxEmail {
  return {
    id: r.id,
    messageId: r.messageId,
    from: r.fromAddr,
    to: r.toAddr,
    subject: r.subject,
    snippet: r.snippet,
    body: r.body,
    receivedAt: r.receivedAt.toISOString(),
    seen: r.seen,
    replied: r.replied,
  };
}

function requireDb(): NonNullable<ReturnType<typeof getDb>> {
  const db = getDb();
  if (db === null) throw new AppError("INTERNAL", 503, "Database not ready");
  return db;
}

// messageId দিয়ে upsert — থাকলে এড়িয়ে যাও (seen DB-এরটাই থাকে)।
// ফেরত: true = নতুন ঢুকেছে, false = আগেই ছিল।
export async function upsertInboxEmail(input: UpsertInboxEmailInput): Promise<boolean> {
  const db = requireDb();
  const existing = await db
    .select({ id: inboxEmails.id })
    .from(inboxEmails)
    .where(eq(inboxEmails.messageId, input.messageId))
    .limit(1);
  if (existing.length > 0) return false;
  await db.insert(inboxEmails).values({
    messageId: input.messageId,
    fromAddr: input.from,
    toAddr: input.to,
    subject: input.subject,
    snippet: input.snippet,
    body: input.body,
    receivedAt: input.receivedAt,
  });
  return true;
}

export async function unreadCount(): Promise<number> {
  const db = requireDb();
  const rows = await db
    .select({ n: count() })
    .from(inboxEmails)
    .where(eq(inboxEmails.seen, false));
  const row = rows[0];
  return row ? Number(row.n) : 0;
}

export async function listInboxEmails(filter: ListInboxFilter): Promise<InboxPage> {
  const db = requireDb();
  const offset = (filter.page - 1) * filter.limit;
  const counted = await db.select({ n: count() }).from(inboxEmails);
  const totalRow = counted[0];
  const total: number = totalRow ? Number(totalRow.n) : 0;
  const rows = await db
    .select()
    .from(inboxEmails)
    .orderBy(desc(inboxEmails.receivedAt))
    .limit(filter.limit)
    .offset(offset);
  const unread = await unreadCount();
  return {
    items: rows.map(toInboxEmail),
    total,
    unread,
    meta: buildPageMeta(total, { page: filter.page, limit: filter.limit }),
  };
}

export async function findInboxEmailById(id: number): Promise<InboxEmail | null> {
  const db = requireDb();
  const rows = await db.select().from(inboxEmails).where(eq(inboxEmails.id, id)).limit(1);
  const row = rows[0];
  if (!row) return null;
  return toInboxEmail(row);
}

export async function setInboxSeen(id: number, seen: boolean): Promise<InboxEmail | null> {
  const db = requireDb();
  const rows = await db
    .update(inboxEmails)
    .set({ seen })
    .where(eq(inboxEmails.id, id))
    .returning();
  const row = rows[0];
  if (!row) return null;
  return toInboxEmail(row);
}

// উত্তর পাঠানো চিহ্ন — seen + replied একসাথে।
export async function markInboxReplied(id: number): Promise<InboxEmail | null> {
  const db = requireDb();
  const rows = await db
    .update(inboxEmails)
    .set({ seen: true, replied: true })
    .where(eq(inboxEmails.id, id))
    .returning();
  const row = rows[0];
  if (!row) return null;
  return toInboxEmail(row);
}
