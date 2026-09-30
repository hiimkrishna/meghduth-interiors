import { timingSafeEqual } from "node:crypto";
import { markSeenSchema, replyEmailSchema } from "@/packages/contracts/src/inbox.schema";
import { requireAdmin } from "@/server/lib/admin-auth";
import { AppError, BadRequest, fail, NotFound, ok, withReqId } from "@/server/lib/response";
import { getInboxEmail, ingestInboundEmail, listInbox, markInboxSeen, replyToEmail, syncInbox } from "./inbox.service";

// GET /api/v1/admin/inbox → ok({ items, unread }, undefined, meta)
export async function listInboxController(req: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const url = new URL(req.url);
    const pageRaw = url.searchParams.get("page") ?? undefined;
    const limitRaw = url.searchParams.get("limit") ?? undefined;
    const pageNum = pageRaw !== undefined ? Number(pageRaw) : 1;
    const limitNum = limitRaw !== undefined ? Number(limitRaw) : 20;
    const page = Number.isInteger(pageNum) && pageNum >= 1 ? pageNum : 1;
    const limit = Number.isInteger(limitNum) && limitNum >= 1 ? limitNum : 20;
    const result = await listInbox({ page, limit });
    return ok({ items: result.items, unread: result.unread }, undefined, result.meta);
  } catch (err) {
    return fail(err, reqId);
  }
}

// GET /api/v1/admin/inbox/[id] → একটা মেইল
export async function getInboxEmailController(req: Request, id: string): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) throw NotFound("Email not found");
    const item = await getInboxEmail(numericId);
    return ok(item);
  } catch (err) {
    return fail(err, reqId);
  }
}

// PATCH /api/v1/admin/inbox/[id] { seen } → seen বদল
export async function markSeenController(req: Request, id: string): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) throw NotFound("Email not found");
    const body: unknown = await req.json().catch(() => null);
    const parsed = markSeenSchema.safeParse(body);
    if (!parsed.success) throw BadRequest("Invalid seen flag");
    const item = await markInboxSeen(numericId, parsed.data.seen);
    return ok(item, "Updated");
  } catch (err) {
    return fail(err, reqId);
  }
}

// POST /api/v1/admin/inbox/sync → sync চালিয়ে { synced, total }
export async function syncInboxController(req: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const result = await syncInbox();
    return ok(result, "Synced");
  } catch (err) {
    return fail(err, reqId);
  }
}

// POST /api/v1/admin/inbox/[id]/reply { body } → SMTP-তে উত্তর
export async function replyEmailController(req: Request, id: string): Promise<Response> {
  const reqId = withReqId();
  try {
    await requireAdmin(req);
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) throw NotFound("Email not found");
    const body: unknown = await req.json().catch(() => null);
    const parsed = replyEmailSchema.safeParse(body);
    if (!parsed.success) throw BadRequest("Reply message is required");
    const result = await replyToEmail(numericId, parsed.data.body);
    return ok(result, "Reply sent");
  } catch (err) {
    return fail(err, reqId);
  }
}

// ধ্রুব-সময়ে সিক্রেট তুলনা — দৈর্ঘ্য-অমিলে early-false।
function secretsEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

// POST /api/v1/admin/inbox/ingress — বাইরের inbound-provider webhook।
// অ্যাডমিন-টোকেন নয়, x-ingress-secret চলে (প্রোভাইডার ড্যাশবোর্ডে বসে)।
// INGRESS_SECRET না থাকলে 503 — ভুল সিক্রেটে 403।
export async function ingressEmailController(req: Request): Promise<Response> {
  const reqId = withReqId();
  try {
    const secret = (process.env.INGRESS_SECRET ?? "").trim();
    if (secret === "") {
      throw new AppError("INTERNAL", 503, "Inbound ingress is not configured");
    }
    const provided = (req.headers.get("x-ingress-secret") ?? "").trim();
    if (provided === "" || !secretsEqual(provided, secret)) {
      throw new AppError("FORBIDDEN", 403, "Invalid ingress secret");
    }
    const body: unknown = await req.json().catch(() => null);
    const result = await ingestInboundEmail(body);
    return ok(result, result.inserted ? "Email received" : "Already exists");
  } catch (err) {
    return fail(err, reqId);
  }
}
