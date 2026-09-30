import { api } from "@/lib/api";
import { toArray } from "../shared/use-admin-list";
import type {
  CreateTeamMember,
  TeamMember,
  UpdateTeamMember,
} from "@/packages/contracts/src/team.schema";
import type { AdminId } from "../hero-slides/hero-slides.service";

// দল CRUD — lib/api দিয়ে।
export async function listAdminTeam(): Promise<TeamMember[]> {
  const data = await api.get<unknown>("/admin/team");
  return toArray<TeamMember>(data);
}

export async function createAdminTeamMember(
  payload: CreateTeamMember,
): Promise<TeamMember> {
  return api.post<TeamMember>("/admin/team", payload);
}

export async function updateAdminTeamMember(
  id: AdminId,
  payload: UpdateTeamMember,
): Promise<TeamMember> {
  return api.patch<TeamMember>(`/admin/team/${String(id)}`, payload);
}

export async function deleteAdminTeamMember(id: AdminId): Promise<void> {
  await api.del<unknown>(`/admin/team/${String(id)}`);
}
