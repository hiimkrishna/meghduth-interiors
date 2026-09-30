import { z } from "zod";

// সব লিস্ট API-তে একই query চুক্তি: ?page=&limit=&sort=&order=&search=
// limit সর্বোচ্চ 100 — এর বেশি চাইলে cursor-pagination-এ যাও।
export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().max(64).optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().max(200).optional(),
});

export type ListQuery = z.infer<typeof listQuerySchema>;

// সব লিস্ট response-এ data-এর সাথে এই meta বাধ্যতামূলক।
export const pageMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  totalPages: z.number().int().nonnegative(),
});

export type PageMeta = z.infer<typeof pageMetaSchema>;

export const buildPageMeta = (
  total: number,
  query: Pick<ListQuery, "page" | "limit">,
): PageMeta => ({
  total,
  page: query.page,
  limit: query.limit,
  totalPages: Math.ceil(total / query.limit),
});
