import type { ServiceItem } from "@/packages/contracts/src/service.schema";

export type { ServiceItem };

// পেজ আকার — তালিকা + মোট সংখ্যা।
export interface ServicePage {
  items: ServiceItem[];
  total: number;
}
