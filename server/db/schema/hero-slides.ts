// বাস্তব স্কিমা server/db/drizzle-schema.ts-এ — এগুলো ডকুমেন্টেশন
import type { HeroSlide } from "@/packages/contracts/src/hero.schema";

export type { HeroSlide };

// hero_slides — কলাম: id | image_key | badge | title | description | order | published | created_at | updated_at
export const HERO_SLIDES_TABLE = "hero_slides" as const;

export interface HeroSlideRow {
  id: number;
  imageKey: string;
  badge: string;
  title: string;
  description: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
