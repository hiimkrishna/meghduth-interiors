import type { PageMeta } from "@/packages/contracts/src/pagination";
import type { InboundEmail, InboxEmail, InboxSyncResult, ReplySent } from "@/packages/contracts/src/inbox.schema";
import { inboundEmailSchema, replyEmailSchema } from "@/packages/contracts/src/inbox.schema";
import { BadRequest, NotFound } from "@/server/lib/response";
import { syncInboxFromMail } from "@/server/lib/imap";
import { sendReply } from "@/server/lib/smtp";
import {
  findInboxEmailById,
  listInboxEmails,
  markInboxReplied,
  setInboxSeen,
  upsertInboxEmail,
} from "./inbox.repository";

export interface InboxListResult {
  items: InboxEmail[];
  unread: number;
  meta: PageMeta;
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

// তালিকা — { items, unread, meta }।
export async function listInbox(input: { page?: unknown; limit?: unknown }): Promise<InboxListResult> {
  const page = clampPage(typeof input.page === "number" ? input.page : Number(input.page ?? 1));
  const limit = clampLimit(typeof input.limit === "number" ? input.limit : Number(input.limit ?? 20));
  const result = await listInboxEmails({ page, limit });
  return { items: result.items, unread: result.unread, meta: result.meta };
}

export async function getInboxEmail(idRaw: unknown): Promise<InboxEmail> {
  const id = typeof idRaw === "number" ? idRaw : Number(idRaw);
  if (!Number.isInteger(id) || id <= 0) throw NotFound("Email not found");
  const found = await findInboxEmailById(id);
  if (found === null) throw NotFound("Email not found");
  return found;
}

export async function markInboxSeen(idRaw: unknown, seenRaw: unknown): Promise<InboxEmail> {
  const id = typeof idRaw === "number" ? idRaw : Number(idRaw);
  if (!Number.isInteger(id) || id <= 0) throw NotFound("Email not found");
  if (typeof seenRaw !== "boolean") throw BadRequest("Invalid seen flag");
  const updated = await setInboxSeen(id, seenRaw);
  if (updated === null) throw NotFound("Email not found");
  return updated;
}

export async function syncInbox(): Promise<InboxSyncResult> {
  return syncInboxFromMail();
}

// ইনবাউন্ড ingest — webhook JSON বা IMAP, দুই পথেই একই upsert।
// ফেরত: true = নতুন ঢুকেছে, false = আগেই ছিল।
export async function ingestInboundEmail(input: unknown): Promise<{ inserted: boolean }> {
  const parsed = inboundEmailSchema.safeParse(input);
  if (!parsed.success) throw BadRequest("Invalid inbound email");
  const body = parsed.data.body.slice(0, 20000);
  const receivedAt =
    parsed.data.receivedAt === undefined
      ? new Date()
      : parsed.data.receivedAt instanceof Date
        ? parsed.data.receivedAt
        : new Date(parsed.data.receivedAt);
  if (Number.isNaN(receivedAt.getTime())) throw BadRequest("Invalid received date");
  const inserted = await upsertInboxEmail({
    messageId: parsed.data.messageId,
    from: parsed.data.from,
    to: parsed.data.to,
    subject: parsed.data.subject,
    snippet: body.slice(0, 500),
    body,
    receivedAt,
  });
  return { inserted };
}

// উত্তর — SMTP-তে পাঠিয়ে replied+seen চিহ্ন।
export async function replyToEmail(idRaw: unknown, bodyRaw: unknown): Promise<ReplySent> {
  const id = typeof idRaw === "number" ? idRaw : Number(idRaw);
  if (!Number.isInteger(id) || id <= 0) throw NotFound("Email not found");
  const parsed = replyEmailSchema.safeParse({ body: bodyRaw });
  if (!parsed.success) throw BadRequest("Reply message is required");
  const mail = await findInboxEmailById(id);
  if (mail === null) throw NotFound("Email not found");
  const subject = mail.subject === "" ? "Re: (no subject)" : mail.subject.startsWith("Re:") ? mail.subject : `Re: ${mail.subject}`;
  await sendReply({
    to: mail.from,
    subject,
    body: parsed.data.body,
    ...(mail.messageId !== "" ? { inReplyTo: mail.messageId } : {}),
  });
  await markInboxReplied(id);
  return { sent: true as const };
}
