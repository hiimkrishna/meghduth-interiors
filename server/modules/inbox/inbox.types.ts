import type { InboxEmail } from "@/packages/contracts/src/inbox.schema";

export type { InboxEmail };

// তালিকা ফিল্টার — পাতা আকার।
export interface ListInboxFilter {
  page: number;
  limit: number;
}

// নতুন মেইল ঢোকানোর আকার (IMAP সিঙ্ক থেকে)।
export interface UpsertInboxEmailInput {
  messageId: string;
  from: string;
  to: string;
  subject: string;
  snippet: string;
  body: string;
  receivedAt: Date;
}
