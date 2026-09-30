import { api } from "@/lib/api";
import { toArray } from "../shared/use-admin-list";
import type {
  CreateProject,
  Project,
  ProjectDetail,
  ProjectImage,
  UpdateProject,
} from "@/packages/contracts/src/project.schema";
import type { AdminId } from "../hero-slides/hero-slides.service";

// প্রজেক্ট CRUD — lib/api দিয়ে।
export async function listAdminProjects(): Promise<Project[]> {
  const data = await api.get<unknown>("/admin/projects");
  return toArray<Project>(data);
}

export async function createAdminProject(
  payload: CreateProject,
): Promise<Project> {
  return api.post<Project>("/admin/projects", payload);
}

export async function updateAdminProject(
  id: AdminId,
  payload: UpdateProject,
): Promise<Project> {
  return api.patch<Project>(`/admin/projects/${String(id)}`, payload);
}

export async function deleteAdminProject(id: AdminId): Promise<void> {
  await api.del<unknown>(`/admin/projects/${String(id)}`);
}

// একক প্রজেক্ট + গ্যালারি।
export async function getAdminProject(id: AdminId): Promise<ProjectDetail> {
  return api.get<ProjectDetail>(`/admin/projects/${String(id)}`);
}

// গ্যালারিতে ছবি যোগ।
export async function addAdminProjectImage(
  id: AdminId,
  payload: { imageKey: string; alt?: string; order?: number },
): Promise<ProjectImage> {
  return api.post<ProjectImage>(`/admin/projects/${String(id)}/images`, payload);
}

// গ্যালারি থেকে ছবি মোছো।
export async function removeAdminProjectImage(imageId: string | number): Promise<void> {
  await api.del<unknown>(`/admin/project-images/${String(imageId)}`);
}
