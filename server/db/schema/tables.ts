// বাস্তব স্কিমা server/db/drizzle-schema.ts-এ — এগুলো ডকুমেন্টেশন
// টেবিল নকশা — প্রতি টেবিলে এক ফাইল। মাইলফলক ২-এ Drizzle-এ যাবে।
// আপাতত contracts-এর ধরনই সত্যের উৎস।
export const TABLES = [
  "admin_users",
  "site_settings",
  "navigations",
  "hero_slides",
  "services",
  "projects",
  "project_images",
  "team_members",
  "testimonials",
  "about_page",
  "process_steps",
  "media_assets",
  "leads_inquiries",
] as const;

export type TableName = (typeof TABLES)[number];
