import { z } from "zod";
import { emailSchema, imageKeySchema, nonEmptyString } from "./common";

// সাইট সেটিংস + নেভিগেশন — এক সারি, সংস্করণসহ।
export const siteSettingsSchema = z.object({
  siteName: nonEmptyString(160),
  logoKey: imageKeySchema.optional(),
  phone: z.string().trim().max(32).optional(),
  email: emailSchema.optional(),
  address: z.string().trim().max(500).optional(),
  mapEmbedUrl: z.string().trim().max(2000).optional(),
  footerDescription: z.string().trim().max(500).optional(),
  copyright: z.string().trim().max(255).optional(),
  socials: z
    .array(z.object({ label: nonEmptyString(80), href: z.string().trim().max(1000) }))
    .default([]),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

export const updateSiteSettingsSchema = siteSettingsSchema.partial();

export type UpdateSiteSettings = z.infer<typeof updateSiteSettingsSchema>;

export const navigationItemSchema = z.object({
  id: z.string().uuid().or(z.number().int().positive()),
  label: nonEmptyString(80),
  title: nonEmptyString(80).optional(),
  href: z.string().trim().min(1).max(500),
  order: z.number().int().min(0).default(0),
  visible: z.boolean().default(true),
  showInFooter: z.boolean().optional(),
});

export type NavigationItem = z.infer<typeof navigationItemSchema>;

export const createNavigationItemSchema = z.object({
  label: nonEmptyString(80),
  href: z.string().trim().min(1).max(500),
  order: z.number().int().min(0).default(0),
  visible: z.boolean().default(true),
  showInFooter: z.boolean().default(true),
});

export type CreateNavigationItem = z.infer<typeof createNavigationItemSchema>;

export const updateNavigationItemSchema = createNavigationItemSchema.partial();

export type UpdateNavigationItem = z.infer<typeof updateNavigationItemSchema>;
