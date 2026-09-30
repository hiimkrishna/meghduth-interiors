import { z } from "zod";
import { emailSchema, nonEmptyString, passwordSchema } from "./common";

export const registerSchema = z.object({
  fullName: nonEmptyString(120),
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "required" }).max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, { message: "required" }).max(8000),
});

export type RefreshInput = z.infer<typeof refreshSchema>;
