// বাস্তব স্কিমা server/db/drizzle-schema.ts-এ — এগুলো ডকুমেন্টেশন
import type { Project } from "@/packages/contracts/src/project.schema";

export type { Project };

// projects — কলাম: id | slug (unique) | title | category | location | year | description | image_key | featured | order | published | created_at | updated_at
export const PROJECTS_TABLE = "projects" as const;

export interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string | null;
  year: string | null;
  description: string | null;
  imageKey: string | null;
  featured: boolean;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
