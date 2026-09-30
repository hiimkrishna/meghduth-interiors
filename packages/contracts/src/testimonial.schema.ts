import { z } from "zod";
import { imageKeySchema, nonEmptyString } from "./common";

// মতামত — অনুমোদন অবস্থা enum-এ বাঁধা, খোলা স্ট্রিং নিষেধ।
export const TESTIMONIAL_STATUSES = ["pending", "approved", "hidden"] as const;
export type TestimonialStatus = (typeof TESTIMONIAL_STATUSES)[number];
export const testimonialStatusSchema = z.enum(TESTIMONIAL_STATUSES);

export const testimonialSchema = z.object({
  id: z.string().uuid().or(z.number().int().positive()),
  name: nonEmptyString(160),
  designation: z.string().trim().max(200).optional(),
  text: nonEmptyString(2000),
  rating: z.number().int().min(1).max(5).default(5),
  imageKey: imageKeySchema.optional(),
  status: testimonialStatusSchema.default("pending"),
  published: z.boolean().default(false),
});

export type Testimonial = z.infer<typeof testimonialSchema>;

export const createTestimonialSchema = z.object({
  name: nonEmptyString(160),
  designation: z.string().trim().max(200).optional(),
  text: nonEmptyString(2000),
  rating: z.number().int().min(1).max(5).default(5),
  imageKey: imageKeySchema.optional(),
});

export type CreateTestimonial = z.infer<typeof createTestimonialSchema>;

export const moderateTestimonialSchema = z.object({
  status: testimonialStatusSchema,
  published: z.boolean(),
});

export type ModerateTestimonial = z.infer<typeof moderateTestimonialSchema>;

// পূর্ণ সম্পাদনা — সব ফিল্ড ঐচ্ছিক (moderate-ও এর অংশবিশেষ হিসেবে চলে)।
export const updateTestimonialSchema = z.object({
  name: nonEmptyString(160).optional(),
  designation: z.string().trim().max(200).optional(),
  text: nonEmptyString(2000).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  imageKey: imageKeySchema.optional(),
  status: testimonialStatusSchema.optional(),
  published: z.boolean().optional(),
});

export type UpdateTestimonial = z.infer<typeof updateTestimonialSchema>;

export const testimonialListSchema = z.array(testimonialSchema);
