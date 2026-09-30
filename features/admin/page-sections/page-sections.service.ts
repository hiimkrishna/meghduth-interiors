import { api } from "@/lib/api";
import type { PageKey } from "@/packages/contracts/src/page-section.schema";

// পেজ-সেকশন অ্যাডমিন ক্লায়েন্ট — lib/api দিয়ে, Envelope lib/api খোলে।
export async function getAdminSection(
  page: PageKey,
  section: string,
): Promise<Record<string, unknown> | null> {
  const data = await api.get<{ page: PageKey; section: string; data: Record<string, unknown> | null }>(
    `/admin/page-sections?page=${page}&section=${encodeURIComponent(section)}`,
  );
  return data.data;
}

export async function saveAdminSection(
  page: PageKey,
  section: string,
  data: Record<string, unknown>,
): Promise<void> {
  await api.put<unknown>("/admin/page-sections", { page, section, data });
}
