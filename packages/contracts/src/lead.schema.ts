import { z } from "zod";
import { emailSchema, nonEmptyString } from "./common";

// লিড অবস্থা যন্ত্র: NEW → CONTACTED → QUOTED → WON, যেকোনো ধাপ থেকে → LOST
export const LEAD_STATUSES = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export const leadStatusSchema = z.enum(LEAD_STATUSES);

export const LEAD_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  NEW: ["CONTACTED", "LOST"],
  CONTACTED: ["QUOTED", "LOST"],
  QUOTED: ["WON", "LOST"],
  WON: [],
  LOST: [],
};

export const canTransitionLead = (from: LeadStatus, to: LeadStatus): boolean =>
  LEAD_TRANSITIONS[from].includes(to);

export const leadSourceSchema = z.enum(["contact-form", "newsletter"]);
export type LeadSource = z.infer<typeof leadSourceSchema>;

export const createLeadSchema = z.object({
  name: nonEmptyString(160),
  email: emailSchema,
  phone: z.string().trim().max(32).optional(),
  subject: z.string().trim().max(255).optional(),
  message: nonEmptyString(4000),
  source: leadSourceSchema.default("contact-form"),
});

export type CreateLead = z.infer<typeof createLeadSchema>;

export const updateLeadStatusSchema = z.object({
  status: leadStatusSchema,
});

export type UpdateLeadStatus = z.infer<typeof updateLeadStatusSchema>;

export const leadSchema = createLeadSchema.extend({
  id: z.string().uuid().or(z.number().int().positive()),
  status: leadStatusSchema.default("NEW"),
  createdAt: z.string().datetime().or(z.date()).optional(),
});

export type Lead = z.infer<typeof leadSchema>;
