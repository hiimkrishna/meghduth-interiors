import { asc, count, eq } from "drizzle-orm";
import type {
  CreateProject,
  Project,
  ProjectImage,
  UpdateProject,
} from "@/packages/contracts/src/project.schema";
import { getDb } from "@/server/db/client";
import { projectImages, projects } from "@/server/db/drizzle-schema";
import { AppError } from "@/server/lib/response";

// বোকা রেপোজিটরি — শুধু তথ্য পড়া। ব্যবসার নিয়ম এখানে নিষেধ।
// DB থাকলে drizzle, না থাকলে বীজ-ফলব্যাক।
import { projectsSeed } from "@/server/db/seed-data";

export interface CreateProjectImageInput {
  imageKey: string;
  alt?: string;
  order?: number;
}

function seedPublished(): Project[] {
  return projectsSeed
    .filter((p) => p.published !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function seedAll(): Project[] {
  return [...projectsSeed].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function toProject(r: typeof projects.$inferSelect): Project {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    ...(r.location !== null ? { location: r.location } : {}),
    ...(r.year !== null ? { year: r.year } : {}),
    ...(r.description !== null ? { description: r.description } : {}),
    ...(r.imageKey !== null ? { imageKey: r.imageKey } : {}),
    featured: r.featured,
    order: r.displayOrder,
    published: r.published,
  };
}

function toProjectImage(r: typeof projectImages.$inferSelect): ProjectImage {
  return {
    id: r.id,
    projectId: r.projectId,
    imageKey: r.imageKey,
    ...(r.alt !== null ? { alt: r.alt } : {}),
    order: r.displayOrder,
  };
}

function requireDb(): NonNullable<ReturnType<typeof getDb>> {
  const db = getDb();
  if (db === null) throw new AppError("INTERNAL", 503, "Database not ready");
  return db;
}

export interface PublishedPage {
  page: number;
  limit: number;
}

export async function findPublishedProjects(
  opts?: PublishedPage,
): Promise<{ items: Project[]; total: number }> {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 50;
  const offset = (page - 1) * limit;
  const db = getDb();
  if (!db) {
    const all = seedPublished();
    return { items: all.slice(offset, offset + limit), total: all.length };
  }
  const whereClause = eq(projects.published, true);
  const [rows, totalRows] = await Promise.all([
    db
      .select()
      .from(projects)
      .where(whereClause)
      .orderBy(asc(projects.displayOrder))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(projects).where(whereClause),
  ]);
  return { items: rows.map(toProject), total: totalRows[0]?.value ?? 0 };
}

export async function findAllProjects(): Promise<Project[]> {
  const db = getDb();
  if (!db) return seedAll();
  const rows = await db.select().from(projects).orderBy(asc(projects.displayOrder));
  return rows.map(toProject);
}

export async function findProjectById(id: string): Promise<Project | null> {
  const db = requireDb();
  const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  const row = rows[0];
  if (!row) return null;
  return toProject(row);
}

export async function findProjectBySlug(slug: string): Promise<Project | null> {
  const db = requireDb();
  const rows = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  const row = rows[0];
  if (!row) return null;
  return toProject(row);
}

export async function createProjectRecord(input: CreateProject): Promise<Project> {
  const db = requireDb();
  const rows = await db
    .insert(projects)
    .values({
      slug: input.slug,
      title: input.title,
      category: input.category,
      location: input.location ?? null,
      year: input.year ?? null,
      description: input.description ?? null,
      imageKey: input.imageKey ?? null,
      featured: input.featured ?? false,
      displayOrder: input.order ?? 0,
      published: input.published ?? true,
    })
    .returning();
  const row = rows[0];
  if (!row) throw new AppError("INTERNAL", 500, "Internal error");
  return toProject(row);
}

export async function updateProjectRecord(
  id: string,
  patch: UpdateProject,
): Promise<Project | null> {
  const db = requireDb();
  const set: Partial<typeof projects.$inferInsert> = {};
  if (patch.slug !== undefined) set.slug = patch.slug;
  if (patch.title !== undefined) set.title = patch.title;
  if (patch.category !== undefined) set.category = patch.category;
  if (patch.location !== undefined) set.location = patch.location;
  if (patch.year !== undefined) set.year = patch.year;
  if (patch.description !== undefined) set.description = patch.description;
  if (patch.imageKey !== undefined) set.imageKey = patch.imageKey;
  if (patch.featured !== undefined) set.featured = patch.featured;
  if (patch.order !== undefined) set.displayOrder = patch.order;
  if (patch.published !== undefined) set.published = patch.published;
  const rows = await db
    .update(projects)
    .set({ ...set, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();
  const row = rows[0];
  if (!row) return null;
  return toProject(row);
}

export async function deleteProjectRecord(id: string): Promise<Project | null> {
  const db = requireDb();
  await db.delete(projectImages).where(eq(projectImages.projectId, id));
  const rows = await db.delete(projects).where(eq(projects.id, id)).returning();
  const row = rows[0];
  if (!row) return null;
  return toProject(row);
}

export async function findProjectImages(projectId: string): Promise<ProjectImage[]> {
  const db = requireDb();
  const rows = await db
    .select()
    .from(projectImages)
    .where(eq(projectImages.projectId, projectId))
    .orderBy(asc(projectImages.displayOrder));
  return rows.map(toProjectImage);
}

export async function addProjectImageRecord(
  projectId: string,
  input: CreateProjectImageInput,
): Promise<ProjectImage> {
  const db = requireDb();
  const rows = await db
    .insert(projectImages)
    .values({
      projectId,
      imageKey: input.imageKey,
      alt: input.alt ?? null,
      displayOrder: input.order ?? 0,
    })
    .returning();
  const row = rows[0];
  if (!row) throw new AppError("INTERNAL", 500, "Internal error");
  return toProjectImage(row);
}

export async function removeProjectImageRecord(id: number): Promise<ProjectImage | null> {
  const db = requireDb();
  const rows = await db.delete(projectImages).where(eq(projectImages.id, id)).returning();
  const row = rows[0];
  if (!row) return null;
  return toProjectImage(row);
}
