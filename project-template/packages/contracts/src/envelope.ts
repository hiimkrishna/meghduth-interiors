import { z } from "zod";
import { errorCodeSchema } from "./error-codes.js";
import { pageMetaSchema } from "./pagination.js";

// সফল response — একটাই আকৃতি। { jobs } বা { items } আলাদা করে বানানো নিষেধ,
// সব data এই খামের ভেতরে যাবে।
export const successEnvelope = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional(),
    meta: pageMetaSchema.optional(),
  });

// ব্যর্থ response — central error-handler এটা বানায়।
export const errorEnvelopeSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  code: errorCodeSchema,
  reqId: z.string().optional(),
});

export type ErrorEnvelope = z.infer<typeof errorEnvelopeSchema>;
