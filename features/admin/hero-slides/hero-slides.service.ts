import { api } from "@/lib/api";
import { toArray } from "../shared/use-admin-list";
import type {
  CreateHeroSlide,
  HeroSlide,
  UpdateHeroSlide,
} from "@/packages/contracts/src/hero.schema";

export type AdminId = string | number;

// হিরো স্লাইড CRUD — lib/api দিয়ে, Envelope lib/api খোলে।
export async function listHeroSlides(): Promise<HeroSlide[]> {
  const data = await api.get<unknown>("/admin/hero-slides");
  return toArray<HeroSlide>(data);
}

export async function createHeroSlide(payload: CreateHeroSlide): Promise<HeroSlide> {
  return api.post<HeroSlide>("/admin/hero-slides", payload);
}

export async function updateHeroSlide(
  id: AdminId,
  payload: UpdateHeroSlide,
): Promise<HeroSlide> {
  return api.patch<HeroSlide>(`/admin/hero-slides/${String(id)}`, payload);
}

export async function deleteHeroSlide(id: AdminId): Promise<void> {
  await api.del<unknown>(`/admin/hero-slides/${String(id)}`);
}
