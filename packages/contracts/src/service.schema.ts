import { z } from "zod";
import {
  imageKeySchema,
  nonEmptyString,
  orderSchema,
  publishedSchema,
  slugSchema,
} from "./common";

// সেবা — data/services.js ও data/servicesPageData.js-এর একক সত্য।
export const serviceSchema = z.object({
  id: z.string().uuid().or(z.number().int().positive()),
  slug: slugSchema,
  title: nonEmptyString(160),
  description: nonEmptyString(2000),
  imageKey: imageKeySchema.optional(),
  order: orderSchema.optional(),
  published: publishedSchema.optional(),
});

export type ServiceItem = z.infer<typeof serviceSchema>;

export const createServiceSchema = z.object({
  slug: slugSchema,
  title: nonEmptyString(160),
  description: nonEmptyString(2000),
  imageKey: imageKeySchema.optional(),
  order: orderSchema,
  published: publishedSchema,
});

export type CreateService = z.infer<typeof createServiceSchema>;

export const updateServiceSchema = createServiceSchema.partial();

export type UpdateService = z.infer<typeof updateServiceSchema>;

export const serviceImageSchema = z.object({
  id: z.string().uuid().or(z.number().int().positive()),
  serviceId: z.string().uuid().or(z.number().int().positive()),
  imageKey: imageKeySchema,
  alt: z.string().trim().max(255).optional(),
  order: orderSchema.optional(),
});

export type ServiceImage = z.infer<typeof serviceImageSchema>;

export const createServiceImageSchema = z.object({
  serviceId: z.string().min(1).or(z.number().int().positive()),
  imageKey: imageKeySchema,
  alt: z.string().trim().max(255).optional(),
  order: orderSchema,
});

export type CreateServiceImage = z.infer<typeof createServiceImageSchema>;

// বিস্তারিত পেজ — সেবা + গ্যালারি ছবি একসাথে।
export const serviceDetailSchema = serviceSchema.extend({
  images: z.array(serviceImageSchema).default([]),
});

export type ServiceDetail = z.infer<typeof serviceDetailSchema>;

export const serviceListSchema = z.array(serviceSchema);
