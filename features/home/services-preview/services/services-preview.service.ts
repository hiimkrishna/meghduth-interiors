import { api } from "@/lib/api";
import { cached } from "@/lib/client-cache";
import type { ServiceItem } from "@/packages/contracts/src/service.schema";

// হোম সেবা-ঝলক — সরাসরি API থেকে, Envelope lib/api খোলে।
export async function getServicesPreview(): Promise<ServiceItem[]> {
  return cached("services-preview", () => api.get<ServiceItem[]>("/services"));
}
