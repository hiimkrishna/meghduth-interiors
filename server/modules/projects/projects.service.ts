import type {
  CreateProject,
  Project,
  ProjectDetail,
  ProjectImage,
  UpdateProject,
} from "@/packages/contracts/src/project.schema";
import {
  createProjectImageSchema,
  createProjectSchema,
  updateProjectSchema,
} from "@/packages/contracts/src/project.schema";
import type { PageMeta } from "@/packages/contracts/src/pagination";
import { buildPageMeta } from "@/packages/contracts/src/pagination";
import { BadRequest, Conflict, NotFound } from "@/server/lib/response";
import {
  addProjectImageRecord,
  createProjectRecord,
  deleteProjectRecord,
  findAllProjects,
  findProjectById,
  findProjectBySlug,
  findProjectImages,
  findPublishedProjects,
  removeProjectImageRecord,
  updateProjectRecord,
} from "./projects.repository";
import type { CreateProjectImageInput } from "./projects.repository";

// মোটা সার্ভিস — ব্যবসার নিয়ম এখানে। DB সরাসরি ধরা নিষেধ, repo দিয়ে যাবে।
export interface PublishedListResult<T> {
  items: T[];
  meta: PageMeta;
}

function clampPage(raw: unknown): number {
  const n = typeof raw === "number" ? raw : Number(raw ?? 1);
  if (!Number.isInteger(n) || n < 1) return 1;
  return n;
}

function clampLimit(raw: unknown): number {
  const n = typeof raw === "number" ? raw : Number(raw ?? 50);
  if (!Number.isInteger(n) || n < 1) return 50;
  if (n > 50) return 50;
  return n;
}

export async function listPublishedProjects(
  input?: { page?: unknown; limit?: unknown },
): Promise<PublishedListResult<Project>> {
  const page = clampPage(input?.page);
  const limit = clampLimit(input?.limit);
  const { items, total } = await findPublishedProjects({ page, limit });
  return { items, meta: buildPageMeta(total, { page, limit }) };
}

export async function listAllProjects(): Promise<Project[]> {
  return findAllProjects();
}

// বিস্তারিত — শুধু প্রকাশিত প্রজেক্ট, ছবিসহ। খসড়া/অজানা slug-এ 404।
export async function getPublishedProjectBySlug(slugRaw: string): Promise<ProjectDetail> {
  const slug = slugRaw.trim().toLowerCase();
  if (slug === "") throw NotFound("Project not found");
  const project = await findProjectBySlug(slug);
  if (project === null || project.published !== true) throw NotFound("Project not found");
  const images = await findProjectImages(String(project.id));
  return { ...project, images };
}

export async function createProject(input: CreateProject): Promise<Project> {
  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) throw BadRequest("Invalid project data");
  const taken = await findProjectBySlug(parsed.data.slug).catch(() => null);
  if (taken !== null) throw Conflict("Slug already exists");
  return createProjectRecord(parsed.data);
}

export async function updateProject(id: string, input: UpdateProject): Promise<Project> {
  const parsed = updateProjectSchema.safeParse(input);
  if (!parsed.success) throw BadRequest("Invalid project data");
  if (Object.keys(parsed.data).length === 0) throw BadRequest("Invalid project data");
  if (id.trim() === "") throw NotFound("Project not found");
  const existing = await findProjectById(id);
  if (existing === null) throw NotFound("Project not found");
  if (parsed.data.slug !== undefined && parsed.data.slug !== existing.slug) {
    const taken = await findProjectBySlug(parsed.data.slug).catch(() => null);
    if (taken !== null) throw Conflict("Slug already exists");
  }
  const next = await updateProjectRecord(id, parsed.data);
  if (next === null) throw NotFound("Project not found");
  return next;
}

export async function deleteProject(id: string): Promise<Project> {
  if (id.trim() === "") throw NotFound("Project not found");
  const removed = await deleteProjectRecord(id);
  if (removed === null) throw NotFound("Project not found");
  return removed;
}

// অ্যাডমিন বিস্তারিত — প্রজেক্ট + গ্যালারি ছবিসহ।
export async function getAdminProjectById(idRaw: string): Promise<ProjectDetail> {
  const id = idRaw.trim();
  if (id === "") throw NotFound("Project not found");
  const project = await findProjectById(id);
  if (project === null) throw NotFound("Project not found");
  const images = await findProjectImages(String(project.id));
  return { ...project, images };
}

export async function addProjectImage(
  projectId: string,
  input: CreateProjectImageInput,
): Promise<ProjectImage> {
  const parsed = createProjectImageSchema.safeParse({ ...input, projectId });
  if (!parsed.success) throw BadRequest("Invalid image data");
  if (projectId.trim() === "") throw NotFound("Project not found");
  const existing = await findProjectById(projectId);
  if (existing === null) throw NotFound("Project not found");
  return addProjectImageRecord(projectId, {
    imageKey: parsed.data.imageKey,
    ...(parsed.data.alt !== undefined ? { alt: parsed.data.alt } : {}),
    ...(parsed.data.order !== undefined ? { order: parsed.data.order } : {}),
  });
}

export async function removeProjectImage(idRaw: string): Promise<ProjectImage> {
  const id = Number(idRaw);
  if (!Number.isInteger(id) || id <= 0) throw NotFound("Image not found");
  const removed = await removeProjectImageRecord(id);
  if (removed === null) throw NotFound("Image not found");
  return removed;
}
