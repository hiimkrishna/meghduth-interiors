import { cache } from "react";
import type {
  PageKey,
  UpsertPageSection,
} from "@/packages/contracts/src/page-section.schema";
import { upsertPageSectionSchema } from "@/packages/contracts/src/page-section.schema";
import { BadRequest } from "@/server/lib/response";
import {
  getSectionRecord,
  listPageRecords,
  upsertSectionRecord,
} from "./page-sections.repository";

// মোটা সার্ভিস — সেকশন পড়া/লেখা। DB সরাসরি ধরা নিষেধ, repo দিয়ে যাবে।
// null = এখনো অ্যাডমিনে সেভ হয়নি → ভোক্তা কোড-ফলব্যাক দেখাবে।
export async function getSectionData(
  page: PageKey,
  section: string,
): Promise<Record<string, unknown> | null> {
  return getSectionRecord(page, section);
}

// অনুরোধ-স্কোপ মেমোইজ — একই রেন্ডারে এক সেকশন একবারই পড়া হয়।
export const getCachedSectionData = cache(
  async (page: PageKey, section: string): Promise<Record<string, unknown> | null> => {
    return getSectionRecord(page, section);
  },
);

export async function listPageSections(
  page: PageKey,
): Promise<Record<string, Record<string, unknown>>> {
  return listPageRecords(page);
}

export async function upsertSectionData(
  input: UpsertPageSection,
): Promise<{ page: PageKey; section: string; data: Record<string, unknown> }> {
  const parsed = upsertPageSectionSchema.safeParse(input);
  if (!parsed.success) throw BadRequest("Invalid page section data");
  return upsertSectionRecord(parsed.data);
}
