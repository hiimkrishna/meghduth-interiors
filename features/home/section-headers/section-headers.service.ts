import { api } from "@/lib/api";
import { cached } from "@/lib/client-cache";

// হোম সেকশন-শিরোনাম — মালিক: Homepage ট্যাব (home.*)।
// DB-সারি না থাকলে / API ডাউন থাকলে ফলব্যাক — সেকশন কখনো ভাঙে না।
export async function getHomeSection<T extends object>(
  section: string,
  fallback: T,
): Promise<T> {
  try {
    const res = await cached(`home-section-${section}`, () =>
      api.get<{ data: Record<string, unknown> | null }>(
        `/page-sections?page=home&section=${encodeURIComponent(section)}`,
      ),
    );
    if (res !== null && res.data !== null && typeof res.data === "object") {
      return { ...fallback, ...res.data } as T;
    }
  } catch {
    // ফলব্যাকে পড়ে যাও।
  }
  return fallback;
}
