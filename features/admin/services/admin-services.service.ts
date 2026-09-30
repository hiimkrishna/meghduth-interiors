import { api } from "@/lib/api";
import { toArray } from "../shared/use-admin-list";
import type {
  CreateService,
  ServiceDetail,
  ServiceImage,
  ServiceItem,
  UpdateService,
} from "@/packages/contracts/src/service.schema";
import type { AdminId } from "../hero-slides/hero-slides.service";

// সেবা CRUD — lib/api দিয়ে।
export async function listAdminServices(): Promise<ServiceItem[]> {
  const data = await api.get<unknown>("/admin/services");
  return toArray<ServiceItem>(data);
}

export async function createAdminService(
  payload: CreateService,
): Promise<ServiceItem> {
  return api.post<ServiceItem>("/admin/services", payload);
}

export async function updateAdminService(
  id: AdminId,
  payload: UpdateService,
): Promise<ServiceItem> {
  return api.patch<ServiceItem>(`/admin/services/${String(id)}`, payload);
}

export async function deleteAdminService(id: AdminId): Promise<void> {
  await api.del<unknown>(`/admin/services/${String(id)}`);
}

// একক সেবা + গ্যালারি।
export async function getAdminService(id: AdminId): Promise<ServiceDetail> {
  return api.get<ServiceDetail>(`/admin/services/${String(id)}`);
}

// গ্যালারিতে ছবি যোগ।
export async function addAdminServiceImage(
  id: AdminId,
  payload: { imageKey: string; alt?: string; order?: number },
): Promise<ServiceImage> {
  return api.post<ServiceImage>(`/admin/services/${String(id)}/images`, payload);
}

// গ্যালারি থেকে ছবি মোছো।
export async function removeAdminServiceImage(imageId: string | number): Promise<void> {
  await api.del<unknown>(`/admin/service-images/${String(imageId)}`);
}
