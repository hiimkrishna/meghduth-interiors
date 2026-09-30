import { api } from "@/lib/api";
import { cached } from "@/lib/client-cache";
import type { ServiceDetail, ServiceItem } from "@/packages/contracts/src/service.schema";

// সেবা তালিকা — সরাসরি API থেকে, Envelope lib/api খোলে.
export async function getServices(): Promise<ServiceItem[]> {
  return cached("services", () => api.get<ServiceItem[]>("/services"));
}

// একক সেবা — slug দিয়ে, ছবিসহ।
export async function getService(slug: string): Promise<ServiceDetail> {
  return api.get<ServiceDetail>(`/services/${encodeURIComponent(slug)}`);
}
