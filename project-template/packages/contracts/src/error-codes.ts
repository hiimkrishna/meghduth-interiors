import { z } from "zod";

// সব এরর কোড এক জায়গায়। নতুন কোড লাগলে শুধু এখানে যোগ করো —
// ব্যাকএন্ডের error-handler আর ফ্রন্টএন্ডের toast দুজনেই এটা চেনে।
export const ERROR_CODES = [
  "VALIDATION_ERROR",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "RATE_LIMITED",
  "UNPROCESSABLE",
  "INTERNAL",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export const errorCodeSchema = z.enum(ERROR_CODES);

// প্রতিটা কোডের HTTP স্ট্যাটাস — central error-handler এটা ব্যবহার করে।
export const ERROR_HTTP_STATUS: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  UNPROCESSABLE: 422,
  INTERNAL: 500,
};
