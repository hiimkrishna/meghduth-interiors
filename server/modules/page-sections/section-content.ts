// সেকশন-কনটেন্ট সহায়ক — DB-ডেটা কোড-ফলব্যাকের উপর অগভীর মার্জ।
// সারি না থাকলে / আকৃতি না মিললে ফলব্যাকই ফেরে — পেজ কখনো ভাঙে না।
export function asSection<T extends object>(
  data: Record<string, unknown> | null | undefined,
  fallback: T,
): T {
  if (data === null || data === undefined || typeof data !== "object") return fallback;
  return { ...fallback, ...data } as T;
}

export function asList<T>(value: unknown, fallback: T[]): T[] {
  if (!Array.isArray(value) || value.length === 0) return fallback;
  return value as T[];
}
