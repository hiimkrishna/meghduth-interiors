import { api } from "@/lib/api";
import type { Overview } from "@/packages/contracts/src/overview.schema";

// অ্যাডমিন ওভারভিউ — এক কলে ড্যাশবোর্ডের সব বিশ্লেষণ।
export async function getAdminOverview(): Promise<Overview> {
  return api.get<Overview>("/admin/overview");
}
