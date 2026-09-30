import { asc, count, eq } from "drizzle-orm";
import type {
  CreateTeamMember,
  TeamMember,
  UpdateTeamMember,
} from "@/packages/contracts/src/team.schema";
import { getDb } from "@/server/db/client";
import { teamMembers } from "@/server/db/drizzle-schema";
import { AppError } from "@/server/lib/response";

// বোকা রেপোজিটরি — শুধু তথ্য পড়া। ব্যবসার নিয়ম এখানে নিষেধ।
// DB থাকলে drizzle, না থাকলে বীজ-ফলব্যাক।
import { teamSeed } from "@/server/db/seed-data";

function seedPublished(): TeamMember[] {
  return teamSeed
    .filter((m) => m.published !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function seedAll(): TeamMember[] {
  return [...teamSeed].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function toMember(r: typeof teamMembers.$inferSelect): TeamMember {
  return {
    id: r.id,
    name: r.name,
    designation: r.designation,
    ...(r.bio !== null ? { bio: r.bio } : {}),
    ...(r.imageKey !== null ? { imageKey: r.imageKey } : {}),
    order: r.displayOrder,
    published: r.published,
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

export async function findPublishedTeamMembers(
  opts?: PublishedPage,
): Promise<{ items: TeamMember[]; total: number }> {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 50;
  const offset = (page - 1) * limit;
  const db = getDb();
  if (!db) {
    const all = seedPublished();
    return { items: all.slice(offset, offset + limit), total: all.length };
  }
  const whereClause = eq(teamMembers.published, true);
  const [rows, totalRows] = await Promise.all([
    db
      .select()
      .from(teamMembers)
      .where(whereClause)
      .orderBy(asc(teamMembers.displayOrder))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(teamMembers).where(whereClause),
  ]);
  return { items: rows.map(toMember), total: totalRows[0]?.value ?? 0 };
}

export async function findAllTeamMembers(): Promise<TeamMember[]> {
  const db = getDb();
  if (!db) return seedAll();
  const rows = await db.select().from(teamMembers).orderBy(asc(teamMembers.displayOrder));
  return rows.map(toMember);
}

export async function findTeamMemberById(id: number): Promise<TeamMember | null> {
  const db = requireDb();
  const rows = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
  const row = rows[0];
  if (!row) return null;
  return toMember(row);
}

export async function createTeamMemberRecord(input: CreateTeamMember): Promise<TeamMember> {
  const db = requireDb();
  const rows = await db
    .insert(teamMembers)
    .values({
      name: input.name,
      designation: input.designation,
      bio: input.bio ?? null,
      imageKey: input.imageKey ?? null,
      displayOrder: input.order ?? 0,
      published: input.published ?? true,
    })
    .returning();
  const row = rows[0];
  if (!row) throw new AppError("INTERNAL", 500, "Internal error");
  return toMember(row);
}

export async function updateTeamMemberRecord(
  id: number,
  patch: UpdateTeamMember,
): Promise<TeamMember | null> {
  const db = requireDb();
  const set: Partial<typeof teamMembers.$inferInsert> = {};
  if (patch.name !== undefined) set.name = patch.name;
  if (patch.designation !== undefined) set.designation = patch.designation;
  if (patch.bio !== undefined) set.bio = patch.bio;
  if (patch.imageKey !== undefined) set.imageKey = patch.imageKey;
  if (patch.order !== undefined) set.displayOrder = patch.order;
  if (patch.published !== undefined) set.published = patch.published;
  const rows = await db
    .update(teamMembers)
    .set({ ...set, updatedAt: new Date() })
    .where(eq(teamMembers.id, id))
    .returning();
  const row = rows[0];
  if (!row) return null;
  return toMember(row);
}

export async function deleteTeamMemberRecord(id: number): Promise<TeamMember | null> {
  const db = requireDb();
  const rows = await db.delete(teamMembers).where(eq(teamMembers.id, id)).returning();
  const row = rows[0];
  if (!row) return null;
  return toMember(row);
}
