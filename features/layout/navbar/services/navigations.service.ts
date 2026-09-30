import { api } from "@/lib/api";
import { cached } from "@/lib/client-cache";
import type { NavigationItem } from "@/packages/contracts/src/site.schema";

// নেভিগেশন — শুধু দৃশ্যমান লিংক, Envelope lib/api খোলে।
export async function getNavigations(): Promise<NavigationItem[]> {
  return cached("navigations", () => api.get<NavigationItem[]>("/navigations"));
}
