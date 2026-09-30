import { api } from "@/lib/api";
import { cached } from "@/lib/client-cache";
import type { Project, ProjectDetail } from "@/packages/contracts/src/project.schema";

// প্রজেক্ট তালিকা — সরাসরি API থেকে, Envelope lib/api খোলে।
export async function getProjects(): Promise<Project[]> {
  return cached("projects", () => api.get<Project[]>("/projects"));
}

// একক প্রজেক্ট — slug দিয়ে, ছবিসহ।
export async function getProject(slug: string): Promise<ProjectDetail> {
  return api.get<ProjectDetail>(`/projects/${encodeURIComponent(slug)}`);
}
