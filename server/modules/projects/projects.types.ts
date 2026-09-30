import type { Project } from "@/packages/contracts/src/project.schema";

export type { Project };

// পেজ আকার — তালিকা + মোট সংখ্যা।
export interface ProjectPage {
  items: Project[];
  total: number;
}
