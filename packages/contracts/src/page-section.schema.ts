import { z } from "zod";

// পেজ-সেকশন কেন্দ্রীয় ভান্ডার — ৬ পেজ ট্যাবের মালিকানা, ভোক্তা শুধু পড়ে।
// About ট্যাব → about.* (hero/story/philosophy/approach/teamPreview/whyChoose/stats)
// Contact ট্যাব → contact.* (hero/info/location/cta)
// Homepage ট্যাব → home.* (ভবিষ্যৎ; হিরো স্লাইড নিজস্ব entity-তেই থাকে)
export const PAGE_KEYS = [
  "home",
  "about",
  "services",
  "projects",
  "team",
  "contact",
] as const;

export const pageKeySchema = z.enum(PAGE_KEYS);

export type PageKey = z.infer<typeof pageKeySchema>;

const sectionKeySchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[a-zA-Z0-9-]+$/, "section must be letters, digits or dashes");

const sectionDataSchema = z.record(z.string(), z.unknown());

export const pageSectionSchema = z.object({
  id: z.string().uuid(),
  page: pageKeySchema,
  section: sectionKeySchema,
  data: sectionDataSchema,
  updatedAt: z.coerce.date(),
});

export type PageSection = z.infer<typeof pageSectionSchema>;

export const upsertPageSectionSchema = z.object({
  page: pageKeySchema,
  section: sectionKeySchema,
  data: sectionDataSchema,
});

export type UpsertPageSection = z.infer<typeof upsertPageSectionSchema>;

export const pageSectionsQuerySchema = z.object({
  page: pageKeySchema,
  section: sectionKeySchema.optional(),
});

export type PageSectionsQuery = z.infer<typeof pageSectionsQuerySchema>;
