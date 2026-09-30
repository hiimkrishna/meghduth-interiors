import { listInboxController } from "@/server/modules/inbox/inbox.controller";

export const dynamic = "force-dynamic";

// অ্যাডমিন ইনবক্স তালিকা — ?page=&limit=, data = { items, unread } + meta।
export async function GET(req: Request): Promise<Response> {
  return listInboxController(req);
}
