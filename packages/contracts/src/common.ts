import { z } from "zod";

// সব ফিচারে ঘুরেফিরে লাগে এমন স্কিমা — এখান থেকে আমদানি করো, নতুন করে লিখো না।
export const idSchema = z.string().uuid({ message: "invalid id" });

export const idParamSchema = z.object({ id: idSchema });

export const slugSchema = z
  .string()
  .trim()
  .min(1, { message: "required" })
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "invalid slug" });

export const nonEmptyString = (max = 255) =>
  z.string().trim().min(1, { message: "required" }).max(max);

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email({ message: "invalid email" })
  .max(255);

export const passwordSchema = z
  .string()
  .min(8, { message: "password must be at least 8 characters" })
  .max(128);

export const imageKeySchema = z.string().trim().min(1).max(512);

export const orderSchema = z.number().int().min(0).default(0);

export const publishedSchema = z.boolean().default(true);
