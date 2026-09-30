import type {
  CreateTeamMember,
  TeamMember,
  UpdateTeamMember,
} from "@/packages/contracts/src/team.schema";
import { createTeamMemberSchema, updateTeamMemberSchema } from "@/packages/contracts/src/team.schema";
import type { PageMeta } from "@/packages/contracts/src/pagination";
import { buildPageMeta } from "@/packages/contracts/src/pagination";
import { BadRequest, NotFound } from "@/server/lib/response";
import {
  createTeamMemberRecord,
  deleteTeamMemberRecord,
  findAllTeamMembers,
  findPublishedTeamMembers,
  findTeamMemberById,
  updateTeamMemberRecord,
} from "./team.repository";

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

export async function listPublishedTeamMembers(
  input?: { page?: unknown; limit?: unknown },
): Promise<PublishedListResult<TeamMember>> {
  const page = clampPage(input?.page);
  const limit = clampLimit(input?.limit);
  const { items, total } = await findPublishedTeamMembers({ page, limit });
  return { items, meta: buildPageMeta(total, { page, limit }) };
}

export async function listAllTeamMembers(): Promise<TeamMember[]> {
  return findAllTeamMembers();
}

function parseNumericId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw NotFound("Team member not found");
  return id;
}

export async function createTeamMember(input: CreateTeamMember): Promise<TeamMember> {
  const parsed = createTeamMemberSchema.safeParse(input);
  if (!parsed.success) throw BadRequest("Invalid team member data");
  return createTeamMemberRecord(parsed.data);
}

export async function updateTeamMember(idRaw: string, input: UpdateTeamMember): Promise<TeamMember> {
  const parsed = updateTeamMemberSchema.safeParse(input);
  if (!parsed.success) throw BadRequest("Invalid team member data");
  if (Object.keys(parsed.data).length === 0) throw BadRequest("Invalid team member data");
  const id = parseNumericId(idRaw);
  const existing = await findTeamMemberById(id);
  if (existing === null) throw NotFound("Team member not found");
  const next = await updateTeamMemberRecord(id, parsed.data);
  if (next === null) throw NotFound("Team member not found");
  return next;
}

export async function deleteTeamMember(idRaw: string): Promise<TeamMember> {
  const id = parseNumericId(idRaw);
  const removed = await deleteTeamMemberRecord(id);
  if (removed === null) throw NotFound("Team member not found");
  return removed;
}
