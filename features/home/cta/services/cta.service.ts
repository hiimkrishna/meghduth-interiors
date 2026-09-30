import { api } from "@/lib/api";
import { cached } from "@/lib/client-cache";
import ctaData, { type CtaData } from "../components/ctaData";

export type { CtaData };

// মালিক: Contact ট্যাব (contact.cta)। হোম/About শুধু পড়ে।
// DB-সারি না থাকলে / API ডাউন থাকলে স্থানীয় ফলব্যাক — CTA কখনো ভাঙে না।
export async function getCtaData(): Promise<CtaData> {
  try {
    const res = await cached("cta-section", () =>
      api.get<{ page: string; section: string; data: Record<string, unknown> | null }>(
        "/page-sections?page=contact&section=cta",
      ),
    );
    if (res !== null && res.data !== null && typeof res.data === "object") {
      return { ...ctaData, ...(res.data as Partial<CtaData>) };
    }
  } catch {
    // ফলব্যাকে পড়ে যাও।
  }
  return ctaData;
}
