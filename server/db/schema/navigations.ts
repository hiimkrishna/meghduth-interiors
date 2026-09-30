// বাস্তব স্কিমা server/db/drizzle-schema.ts-এ — এগুলো ডকুমেন্টেশন
import type { NavigationItem } from "@/packages/contracts/src/site.schema";

export type { NavigationItem };

// navigations — কলাম: id | label | href | order | visible | created_at | updated_at
export const NAVIGATIONS_TABLE = "navigations" as const;

export interface NavigationRow {
  id: number;
  label: string;
  href: string;
  order: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}
