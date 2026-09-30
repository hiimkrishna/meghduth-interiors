import { z } from "zod";
import { errorCodeSchema } from "./error-codes";
import { pageMetaSchema } from "./pagination";

// সফল জবাব — একটাই আকৃতি। আলাদা করে { jobs } বা { items } বানানো নিষেধ।
export const successEnvelope = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional(),
    meta: pageMetaSchema.optional(),
  });

export const errorEnvelopeSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  code: errorCodeSchema,
  reqId: z.string().optional(),
});

export type ErrorEnvelope = z.infer<typeof errorEnvelopeSchema>;

export interface SuccessEnvelope<T> {
  success: true;
  data: T;
  message?: string;
  meta?: { total: number; page: number; limit: number; totalPages: number };
}
