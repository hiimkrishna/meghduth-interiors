import { eq, sql } from "drizzle-orm";
import { getDb } from "@/server/db/client";
import { adminUsers, type AdminUserRow } from "@/server/db/drizzle-schema";
import { AppError } from "@/server/lib/response";

// DB নেই → 503 (সেবা বীজ-ডেটায় চলবে, ক্র্যাশ নয়)।
const requireDb = (): NonNullable<ReturnType<typeof getDb>> => {
  const db = getDb();
  if (db === null) throw new AppError("INTERNAL", 503, "Database not ready");
  return db;
};

// ইমেইলে প্রশাসক খোঁজো।
export async function findAdminByEmail(email: string): Promise<AdminUserRow | null> {
  const db = requireDb();
  const rows = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  const row = rows[0];
  return row ?? null;
}

// আইডিতে প্রশাসক খোঁজো।
export async function findAdminById(id: string): Promise<AdminUserRow | null> {
  const db = requireDb();
  const rows = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  const row = rows[0];
  return row ?? null;
}

// টোকেন সংস্করণ বাড়াও (ঘূর্ণন/বাতিল) — পারমাণবিক UPDATE।
export async function incrementTokenVersion(id: string): Promise<number> {
  const db = requireDb();
  const rows = await db.execute(
    sql`UPDATE admin_users SET token_version = token_version + 1, updated_at = NOW() WHERE id = ${id} RETURNING token_version`
  );
  const list: unknown = rows as unknown;
  if (Array.isArray(list)) {
    const first: unknown = list[0];
    if (typeof first === "object" && first !== null && "token_version" in first) {
      const v: unknown = (first as { token_version: unknown }).token_version;
      if (typeof v === "number") return v;
    }
    throw new AppError("INTERNAL", 500, "Token version increment failed");
  }
  if (typeof list === "object" && list !== null && "rows" in list) {
    const inner: unknown = (list as { rows: unknown }).rows;
    if (Array.isArray(inner)) {
      const first: unknown = inner[0];
      if (typeof first === "object" && first !== null && "token_version" in first) {
        const v: unknown = (first as { token_version: unknown }).token_version;
        if (typeof v === "number") return v;
      }
    }
  }
  throw new AppError("INTERNAL", 500, "Token version increment failed");
}

// পারমাণবিক ঘূর্ণন — সংস্করণ মিললেই +1, না মিললে null (এক UPDATE-এই শর্ত+লেখা)।
export async function rotateTokenVersion(id: string, oldVersion: number): Promise<number | null> {
  const db = requireDb();
  const rows = await db.execute(sql`UPDATE admin_users SET token_version = token_version + 1, updated_at = NOW() WHERE id = ${id} AND token_version = ${oldVersion} RETURNING token_version`);
  const list: unknown = rows as unknown;
  if (Array.isArray(list)) {
    const first: unknown = list[0];
    if (typeof first === "object" && first !== null && "token_version" in first) {
      const v: unknown = (first as { token_version: unknown }).token_version;
      if (typeof v === "number") return v;
    }
    return null;
  }
  if (typeof list === "object" && list !== null && "rows" in list) {
    const inner: unknown = (list as { rows: unknown }).rows;
    if (Array.isArray(inner)) {
      const first: unknown = inner[0];
      if (typeof first === "object" && first !== null && "token_version" in first) {
        const v: unknown = (first as { token_version: unknown }).token_version;
        if (typeof v === "number") return v;
      }
    }
  }
  return null;
}
