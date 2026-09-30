import { ImapFlow } from "imapflow";
import type {
  FetchMessageObject,
  MessageStructureObject,
} from "imapflow";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/server/db/client";
import { inboxEmails } from "@/server/db/drizzle-schema";
import { AppError } from "@/server/lib/response";

const MAX_BODY_CHARS = 20000;
const MAX_SNIPPET_CHARS = 500;
const MAX_FETCH_COUNT = 30;

interface ParsedMail {
  messageId: string;
  from: string;
  to: string;
  subject: string;
  snippet: string;
  body: string;
  receivedAt: Date;
}

function parsePort(raw: string | undefined): number {
  if (raw === undefined || raw.trim() === "") return 993;
  const n = Number(raw);
  if (!Number.isInteger(n) || n <= 0 || n > 65535) return 993;
  return n;
}

function parseTls(raw: string | undefined): boolean {
  if (raw === undefined || raw.trim() === "") return true;
  const v = raw.trim().toLowerCase();
  if (v === "false" || v === "0" || v === "no" || v === "off") return false;
  return true;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_m, dec: string) => {
      const n = Number(dec);
      if (!Number.isFinite(n)) return "";
      try {
        return String.fromCodePoint(n);
      } catch {
        return "";
      }
    });
}

function stripHtml(html: string): string {
  const withoutScripts = html
    .replace(/<script[\s\S]*?<\/script\s*>/gi, " ")
    .replace(/<style[\s\S]*?<\/style\s*>/gi, " ");
  const withoutTags = withoutScripts.replace(/<[^>]*>/g, " ");
  return decodeEntities(withoutTags).replace(/\s+/g, " ").trim();
}

function formatAddr(name: string | undefined, address: string | undefined): string {
  const addr = (address ?? "").trim();
  const nm = (name ?? "").trim();
  if (addr === "") return nm;
  if (nm === "" || nm === addr) return addr;
  return `${nm} <${addr}>`;
}

function collectTextParts(
  node: MessageStructureObject | undefined,
  out: Array<{ part: string; type: string }>,
): void {
  if (!node) return;
  const t = node.type.toLowerCase();
  if ((t === "text/plain" || t === "text/html") && node.part) {
    out.push({ part: node.part, type: t });
  }
  const kids = node.childNodes ?? [];
  for (const k of kids) collectTextParts(k, out);
}

function toDate(value: Date | string | undefined, fallback: Date | string | undefined): Date {
  const d = value !== undefined ? new Date(value) : fallback !== undefined ? new Date(fallback) : new Date();
  if (Number.isNaN(d.getTime())) return new Date();
  return d;
}

function buildParsed(
  msg: FetchMessageObject,
  bodies: Map<string, { kind: "plain" | "html"; text: string }>,
  host: string,
): ParsedMail {
  const env = msg.envelope;
  const fromList = env?.from ?? [];
  const toList = env?.to ?? [];
  const from = fromList.map((a) => formatAddr(a.name, a.address)).join(", ");
  const to = toList.map((a) => formatAddr(a.name, a.address)).join(", ");
  const subject = (env?.subject ?? "").trim();
  const rawId = (env?.messageId ?? "").trim();
  const messageId = rawId !== "" ? rawId : `imap-${host}-${String(msg.uid)}`;
  const receivedAt = toDate(env?.date, msg.internalDate);

  let body = "";
  // text/plain প্রাধান্য, না থাকলে text/html ছেঁটে।
  const entries = [...bodies.entries()];
  const plain = entries.filter(([, v]) => v.kind === "plain").map(([, v]) => v.text);
  if (plain.length > 0) {
    body = plain.join("\n\n").trim();
  } else {
    const htmlEntry = entries.find(([, v]) => v.kind === "html");
    if (htmlEntry) body = stripHtml(htmlEntry[1].text);
    else {
      const first = entries[0];
      if (first) {
        const looksHtml = /<[a-z][\s\S]*>/i.test(first[1].text);
        body = looksHtml ? stripHtml(first[1].text) : first[1].text.replace(/\s+/g, " ").trim();
      }
    }
  }
  if (body.length > MAX_BODY_CHARS) body = body.slice(0, MAX_BODY_CHARS);
  const snippet = body.replace(/\s+/g, " ").trim().slice(0, MAX_SNIPPET_CHARS);

  return { messageId, from, to, subject, snippet, body, receivedAt };
}

// INBOX read-only সিঙ্ক — তারিখ-নতুন সর্বোচ্চ ৩০টা মেইল DB-তে upsert।
// মেইলবক্সে কোনো লেখা হয় না (read-only + কোনো flag/store কল নেই)।
// PostgreSQL advisory lock ব্যবহার করুন যাতে একাধিক ইনস্ট্যান্স একসাথে সিঙ্ক না করে।
export async function syncInboxFromMail(): Promise<{ synced: number; total: number }> {
  const host = (process.env.IMAP_HOST ?? "").trim();
  const user = (process.env.IMAP_USER ?? "").trim();
  const pass = process.env.IMAP_PASS ?? "";
  if (host === "" || user === "" || pass === "") {
    throw new AppError("INTERNAL", 503, "Email inbox is not configured");
  }
  const db = getDb();
  if (db === null) {
    throw new AppError("INTERNAL", 503, "Email inbox is not configured");
  }
  
  // Advisory lock: 1234567890 is an arbitrary key for inbox sync
  const LOCK_KEY = 1234567890;
  const lockResult = await db.execute(sql`SELECT pg_try_advisory_lock(${LOCK_KEY}) AS acquired`);
  const acquired = (lockResult[0] as { acquired?: boolean } | undefined)?.acquired ?? false;
  if (!acquired) {
    return { synced: 0, total: 0 }; // Another sync in progress
  }
  
  try {
    const port = parsePort(process.env.IMAP_PORT);
    const secure = parseTls(process.env.IMAP_TLS);
    // fail-closed — prod-এ TLS ছাড়া IMAP নিষেধ (প্লেইন-টেক্সট ক্রেডেনশিয়াল নয়)।
    if (!secure && process.env.NODE_ENV === "production") {
      throw new AppError("INTERNAL", 500, "IMAP without TLS is not allowed in production");
    }

    const client = new ImapFlow({
      host,
      port,
      secure,
      auth: { user, pass },
      logger: false,
    });

    await client.connect();
    try {
      const lock = await client.getMailboxLock("INBOX", { readOnly: true });
      try {
        const found = await client.search({ all: true }, { uid: true });
        const uids: number[] = Array.isArray(found) ? found : [];
        if (uids.length === 0) return { synced: 0, total: 0 };
        const newest = uids.slice(-MAX_FETCH_COUNT);
        const total = newest.length;

        // ধাপ ১ — envelope + গঠন আনো (UID range)।
        const metas = await client.fetchAll(newest, { envelope: true, bodyStructure: true, internalDate: true }, { uid: true });

        let synced = 0;
        for (const meta of metas) {
          const parts: Array<{ part: string; type: string }> = [];
          collectTextParts(meta.bodyStructure, parts);
          // text/plain আগে, তারপর html — সর্বোচ্চ ২টা অংশই যথেষ্ট।
          parts.sort((a, b) => {
            const rank = (t: string): number => (t === "text/plain" ? 0 : 1);
            return rank(a.type) - rank(b.type);
          });
          const wanted = parts.slice(0, 2);
          const bodies = new Map<string, { kind: "plain" | "html"; text: string }>();
          for (const w of wanted) {
            try {
              const single = await client.fetchOne(meta.uid, { bodyParts: [w.part] }, { uid: true });
              if (single && typeof single !== "boolean" && single.bodyParts) {
                const buf = single.bodyParts.get(w.part);
                if (buf) {
                  bodies.set(w.part, {
                    kind: w.type === "text/plain" ? "plain" : "html",
                    text: buf.toString("utf8"),
                  });
                }
              }
            } catch {
              // একটা অংশ না পেলে বাকিগুলো চালিয়ে যাও।
            }
          }
          // কোনো text অংশ না মিললে TEXT ফলব্যাক।
          if (bodies.size === 0) {
            try {
              const single = await client.fetchOne(meta.uid, { bodyParts: ["TEXT"] }, { uid: true });
              const msg = single as FetchMessageObject | false | undefined;
              if (msg && typeof msg !== "boolean" && msg.bodyParts) {
                const buf = msg.bodyParts.get("TEXT");
                if (buf) bodies.set("TEXT", { kind: "html", text: buf.toString("utf8") });
              }
            } catch {
              // ফলব্যাক ব্যর্থ হলে খালি বডি নিয়েই এগোও।
            }
          }

          const parsed = buildParsed(meta, bodies, host);
          const existing = await db
            .select({ id: inboxEmails.id })
            .from(inboxEmails)
            .where(eq(inboxEmails.messageId, parsed.messageId))
            .limit(1);
          if (existing.length > 0) continue; // থাকলে এড়িয়ে যাও — seen আমাদের DB-এরটাই থাকে।
          await db.insert(inboxEmails).values({
            messageId: parsed.messageId,
            fromAddr: parsed.from,
            toAddr: parsed.to,
            subject: parsed.subject,
            snippet: parsed.snippet,
            body: parsed.body,
            receivedAt: parsed.receivedAt,
          });
          synced += 1;
        }
        return { synced, total };
      } finally {
        lock.release();
      }
    } finally {
      await client.logout().catch(() => undefined);
    }
  } finally {
    // Release advisory lock
    await db.execute(sql`SELECT pg_advisory_unlock(${LOCK_KEY})`).catch(() => undefined);
  }
}
