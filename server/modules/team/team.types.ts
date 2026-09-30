import type { TeamMember } from "@/packages/contracts/src/team.schema";

export type { TeamMember };

// পেজ আকার — তালিকা + মোট সংখ্যা।
export interface TeamPage {
  items: TeamMember[];
  total: number;
}
