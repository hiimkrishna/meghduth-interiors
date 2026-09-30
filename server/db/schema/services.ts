// বাস্তব স্কিমা server/db/drizzle-schema.ts-এ — এগুলো ডকুমেন্টেশন
import type { ServiceItem } from "@/packages/contracts/src/service.schema";

export type { ServiceItem };

// services — কলাম: id | slug (unique) | title | description | image_key | order | published | created_at | updated_at
export const SERVICES_TABLE = "services" as const;

export interface ServiceRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageKey: string | null;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
