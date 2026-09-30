import { z } from "zod";

// অফিস-মেইল ইনবক্স — অ্যাডমিন প্যানেলে পড়ার চুক্তি।
export const inboxEmailSchema = z.object({
  id: z.number().int().positive(),
  messageId: z.string().max(512),
  from: z.string().max(512),
  to: z.string().max(512),
  subject: z.string().max(1000),
  snippet: z.string().max(500),
  body: z.string(),
  receivedAt: z.string().datetime().or(z.date()),
  seen: z.boolean(),
  replied: z.boolean().default(false),
});

export type InboxEmail = z.infer<typeof inboxEmailSchema>;

export const markSeenSchema = z.object({
  seen: z.boolean(),
});

export type MarkSeen = z.infer<typeof markSeenSchema>;

// উত্তর — অ্যাডমিন প্যানেল থেকে SMTP-তে পাঠানো হয়।
export const replyEmailSchema = z.object({
  body: z.string().trim().min(1, { message: "required" }).max(5000),
});

export type ReplyEmail = z.infer<typeof replyEmailSchema>;

export const replySentSchema = z.object({
  sent: z.literal(true),
});

export type ReplySent = z.infer<typeof replySentSchema>;

export const inboxSyncResultSchema = z.object({
  synced: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
});

export type InboxSyncResult = z.infer<typeof inboxSyncResultSchema>;

// ইনবাউন্ড webhook (Postmark/SendGrid/Mailgun) — পরিষ্কার JSON সরাসরি ঢোকে।
// IMAP-পার্সিং লাগে না; ingest দুই পথেই একই upsert ব্যবহার করে।
export const inboundEmailSchema = z.object({
  messageId: z.string().trim().min(1).max(512),
  from: z.string().trim().min(1).max(512),
  to: z.string().trim().max(512).optional().default(""),
  subject: z.string().trim().max(1000).optional().default(""),
  body: z.string().max(50000).optional().default(""),
  receivedAt: z.string().datetime().or(z.date()).optional(),
});

export type InboundEmail = z.infer<typeof inboundEmailSchema>;
// GET /api/v1/admin/inbox → ok({ items, unread }, undefined, meta)
export const inboxEmailsPageSchema = z.object({
  items: z.array(inboxEmailSchema),
  unread: z.number().int().nonnegative(),
});

export type InboxEmailsPage = z.infer<typeof inboxEmailsPageSchema>;
