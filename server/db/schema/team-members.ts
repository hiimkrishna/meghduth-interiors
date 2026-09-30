// বাস্তব স্কিমা server/db/drizzle-schema.ts-এ — এগুলো ডকুমেন্টেশন
import type { TeamMember } from "@/packages/contracts/src/team.schema";

export type { TeamMember };

// team_members — কলাম: id | name | designation | bio | image_key | order | published | created_at | updated_at
export const TEAM_MEMBERS_TABLE = "team_members" as const;

export interface TeamMemberRow {
  id: number;
  name: string;
  designation: string;
  bio: string | null;
  imageKey: string | null;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
