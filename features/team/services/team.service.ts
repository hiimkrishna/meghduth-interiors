import { api } from "@/lib/api";
import { cached } from "@/lib/client-cache";
import type { TeamMember } from "@/packages/contracts/src/team.schema";

// টিম সদস্য — সরাসরি API থেকে, Envelope lib/api খোলে।
export async function getTeamMembers(): Promise<TeamMember[]> {
  return cached("team", () => api.get<TeamMember[]>("/team"));
}
