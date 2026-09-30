import { syncInboxController } from "@/server/modules/inbox/inbox.controller";

export const dynamic = "force-dynamic";

// অ্যাডমিন ইনবক্স — IMAP থেকে টেনে আনো, { synced, total }।
export async function POST(req: Request): Promise<Response> {
  return syncInboxController(req);
}
