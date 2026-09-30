import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "./drizzle-schema";

// অলস সংযোগ — DATABASE_URL না থাকলে null (বীজ-ডেটায় চলবে)।
// কানেকশন পুল: max কানেকশন + idle_timeout + connect_timeout টিউন করা হয়েছে 1k RPS-এ।
export type Db = PostgresJsDatabase<typeof schema>;

let cached: Db | null = null;
let warnedNoUrl = false;

function createPool() {
  const url: string = process.env.DATABASE_URL ?? "";
  if (url === "") {
    if (!warnedNoUrl) warnedNoUrl = true;
    return null;
  }
  // কানেকশন পুল টিউনিং ১০০০ কনকারেন্ট রিকোয়েস্ট হ্যান্ডল করতে
  // max: সর্বোচ্চ কানেকশন (CPU কোর x 4-8 সুপারিশ)
  // idle_timeout: অচল কানেকশন বন্ধ করার সময়
  // connect_timeout: সংযোগ স্থাপনের সময়সীমা
  // max_lifetime: কানেকশন পুনঃব্যবহারের সর্বোচ্চ আয়ু
  // prepare: false - prepared statements বন্ধ (pgbouncer-সামঞ্জস্য)
  return postgres(process.env.DATABASE_URL!, {
    max: Math.min(Number(process.env.DB_POOL_MAX ?? 20), 100),
    idle_timeout: 30,
    connect_timeout: 10,
    max_lifetime: 60 * 60,
    prepare: false,
    onnotice: () => {}, // notice লগ আটকে রাখে
  });
}

export function getDb(): Db | null {
  const url: string = process.env.DATABASE_URL ?? "";
  if (url === "") {
    if (!warnedNoUrl) warnedNoUrl = true;
    return null;
  }
  if (cached !== null) return cached;
  const client = createPool();
  if (!client) return null;
  cached = drizzle(client, { schema });
  return cached;
}

// প্রস্তুতি পিং — readyz থেকে ডাকে।
export async function isDbReady(): Promise<boolean> {
  const db = getDb();
  if (db === null) return false;
  try {
    await db.execute(sql`select 1`);
    return true;
  } catch {
    return false;
  }
}