// বাস্তব স্কিমা server/db/drizzle-schema.ts-এ — এগুলো ডকুমেন্টেশন
import type { ProjectImage } from "@/packages/contracts/src/project.schema";

export type { ProjectImage };

// project_images — কলাম: id | project_id (fk → projects.id) | image_key | alt | order | created_at
export const PROJECT_IMAGES_TABLE = "project_images" as const;

export interface ProjectImageRow {
  id: number;
  projectId: string;
  imageKey: string;
  alt: string | null;
  order: number;
  createdAt: string;
}
