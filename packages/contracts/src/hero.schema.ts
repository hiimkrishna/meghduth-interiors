import { z } from "zod";
import { imageKeySchema, nonEmptyString, orderSchema, publishedSchema } from "./common";

// হোম হিরো স্লাইড — বর্তমান data/heroSlides.js-এর টাইপ করা চুক্তি।
// স্লাইডশোতে সর্বোচ্চ ৬টি ছবি — সার্ভার-ক্যাপ ও অ্যাডমিন-UI একই ধ্রুবক মানে।
export const MAX_HERO_SLIDES = 6;
export const heroSlideSchema = z.object({
  id: z.string().uuid().or(z.number().int().positive()),
  image: imageKeySchema,
  badge: nonEmptyString(120),
  title: nonEmptyString(200),
  description: nonEmptyString(1000),
  order: orderSchema.optional(),
  published: publishedSchema.optional(),
});

export type HeroSlide = z.infer<typeof heroSlideSchema>;

export const createHeroSlideSchema = z.object({
  imageKey: imageKeySchema,
  badge: nonEmptyString(120),
  title: nonEmptyString(200),
  description: nonEmptyString(1000),
  order: orderSchema,
  published: publishedSchema,
});

export type CreateHeroSlide = z.infer<typeof createHeroSlideSchema>;

export const updateHeroSlideSchema = createHeroSlideSchema.partial();

export type UpdateHeroSlide = z.infer<typeof updateHeroSlideSchema>;

export const heroSlideListSchema = z.array(heroSlideSchema);
