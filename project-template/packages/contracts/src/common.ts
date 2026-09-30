import { z } from "zod";

// সব ফিচারে ঘুরেফিরে লাগে এমন schema — এখান থেকে import করো, নতুন করে লিখো না।
export const idSchema = z.string().uuid({ message: "invalid id" });

export const idParamSchema = z.object({ id: idSchema });

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
