import type { NavigationItem } from "@/packages/contracts/src/site.schema";

export type { NavigationItem };

// পেজ আকার — তালিকা + মোট সংখ্যা।
export interface NavigationPage {
  items: NavigationItem[];
  total: number;
}
