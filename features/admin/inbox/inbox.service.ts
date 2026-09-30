import { api } from "@/lib/api";
import type {
  InboxEmail,
  InboxEmailsPage,
  InboxSyncResult,
} from "@/packages/contracts/src/inbox.schema";

export type { InboxEmail, InboxEmailsPage, InboxSyncResult };
export type InboxId = number;

export interface InboxListParams {
  page?: number;
  limit?: number;
}

function isInboxEmail(v: unknown): v is InboxEmail {
  if (typeof v !== "object" || v === null) return false;
  const r = v as Record<string, unknown>;
  return (
    typeof r.id === "number" &&
    typeof r.messageId === "string" &&
    typeof r.from === "string" &&
    typeof r.to === "string" &&
    typeof r.subject === "string" &&
    typeof r.snippet === "string" &&
    typeof r.body === "string" &&
    typeof r.seen === "boolean" &&
    (typeof r.receivedAt === "string" || r.receivedAt instanceof Date)
  );
}

// GET /api/v1/admin/inbox → data = { items, unread } (অ্যারে নয়!)।
export async function listInboxEmails(params: InboxListParams): Promise<InboxEmailsPage> {
  const data = await api.get<InboxEmailsPage>("/admin/inbox", {
    page: params.page,
    limit: params.limit,
  });
  const items = Array.isArray((data as InboxEmailsPage).items)
    ? (data as InboxEmailsPage).items.filter(isInboxEmail)
    : [];
  const unread =
    typeof (data as InboxEmailsPage).unread === "number" &&
    Number.isInteger((data as InboxEmailsPage).unread) &&
    (data as InboxEmailsPage).unread >= 0
      ? (data as InboxEmailsPage).unread
      : items.filter((m) => !m.seen).length;
  return { items, unread };
}

export async function getInboxEmail(id: InboxId): Promise<InboxEmail> {
  return api.get<InboxEmail>(`/admin/inbox/${String(id)}`);
}

export async function markInboxSeen(id: InboxId, seen: boolean): Promise<InboxEmail> {
  return api.patch<InboxEmail>(`/admin/inbox/${String(id)}`, { seen });
}

export async function triggerInboxSync(): Promise<InboxSyncResult> {
  return api.post<InboxSyncResult>("/admin/inbox/sync");
}

export async function replyToInboxEmail(id: InboxId, body: string): Promise<InboxEmail> {
  await api.post<unknown>(`/admin/inbox/${String(id)}/reply`, { body });
  return getInboxEmail(id);
}
