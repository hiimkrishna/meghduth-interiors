import { z } from "zod";
import { imageKeySchema, nonEmptyString, orderSchema, publishedSchema } from "./common";

// দল — data/team.js, teamData.js ও teamPageData-এর একক সত্য।
export const teamMemberSchema = z.object({
  id: z.string().uuid().or(z.number().int().positive()),
  name: nonEmptyString(160),
  designation: nonEmptyString(160),
  bio: z.string().trim().max(2000).optional(),
  imageKey: imageKeySchema.optional(),
  order: orderSchema.optional(),
  published: publishedSchema.optional(),
});

export type TeamMember = z.infer<typeof teamMemberSchema>;

export const createTeamMemberSchema = z.object({
  name: nonEmptyString(160),
  designation: nonEmptyString(160),
  bio: z.string().trim().max(2000).optional(),
  imageKey: imageKeySchema.optional(),
  order: orderSchema,
  published: publishedSchema,
});

export type CreateTeamMember = z.infer<typeof createTeamMemberSchema>;

export const updateTeamMemberSchema = createTeamMemberSchema.partial();

export type UpdateTeamMember = z.infer<typeof updateTeamMemberSchema>;

export const teamListSchema = z.array(teamMemberSchema);
