// বাস্তব স্কিমা server/db/drizzle-schema.ts-এ — এগুলো ডকুমেন্টেশন
import type { Testimonial, TestimonialStatus } from "@/packages/contracts/src/testimonial.schema";

export type { Testimonial, TestimonialStatus };

// testimonials — কলাম: id | name | designation | text | rating | image_key | status | published | created_at | updated_at
export const TESTIMONIALS_TABLE = "testimonials" as const;

export interface TestimonialRow {
  id: number;
  name: string;
  designation: string | null;
  text: string;
  rating: number;
  imageKey: string | null;
  status: TestimonialStatus;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
