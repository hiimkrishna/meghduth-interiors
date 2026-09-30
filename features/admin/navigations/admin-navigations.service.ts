import { api } from "@/lib/api";
import { toArray } from "../shared/use-admin-list";
import type {
  CreateNavigationItem,
  NavigationItem,
  UpdateNavigationItem,
} from "@/packages/contracts/src/site.schema";
import type { AdminId } from "../hero-slides/hero-slides.service";

// নেভিগেশন CRUD — lib/api দিয়ে।
export async function listAdminNavigations(): Promise<NavigationItem[]> {
  const data = await api.get<unknown>("/admin/navigations");
  return toArray<NavigationItem>(data);
}

export async function createAdminNavigation(
  payload: CreateNavigationItem,
): Promise<NavigationItem> {
  return api.post<NavigationItem>("/admin/navigations", payload);
}

export async function updateAdminNavigation(
  id: AdminId,
  payload: UpdateNavigationItem,
): Promise<NavigationItem> {
  return api.patch<NavigationItem>(
    `/admin/navigations/${String(id)}`,
    payload,
  );
}

export async function deleteAdminNavigation(id: AdminId): Promise<void> {
  await api.del<unknown>(`/admin/navigations/${String(id)}`);
}
