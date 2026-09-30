import type {
  CreateNavigationItem,
  NavigationItem,
  UpdateNavigationItem,
} from "@/packages/contracts/src/site.schema";
import {
  createNavigationItemSchema,
  updateNavigationItemSchema,
} from "@/packages/contracts/src/site.schema";
import type { PageMeta } from "@/packages/contracts/src/pagination";
import { buildPageMeta } from "@/packages/contracts/src/pagination";
import { BadRequest, NotFound } from "@/server/lib/response";
import {
  createNavigationRecord,
  deleteNavigationRecord,
  findAllNavigations,
  findFooterNavigations,
  findNavigationById,
  findVisibleNavigations,
  updateNavigationRecord,
} from "./navigations.repository";

// মোটা সার্ভিস — পাবলিকে শুধু দৃশ্যমান লিংক। DB সরাসরি ধরা নিষেধ।
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

export async function listVisibleNavigations(
  input?: { page?: unknown; limit?: unknown },
): Promise<PublishedListResult<NavigationItem>> {
  const page = clampPage(input?.page);
  const limit = clampLimit(input?.limit);
  const { items, total } = await findVisibleNavigations({ page, limit });
  return { items, meta: buildPageMeta(total, { page, limit }) };
}

export async function listFooterNavigations(): Promise<NavigationItem[]> {
  const items = await findFooterNavigations();
  return items;
}

export async function listAllNavigations(): Promise<NavigationItem[]> {
  return findAllNavigations();
}

function parseNumericId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw NotFound("Navigation item not found");
  return id;
}

export async function createNavigation(input: CreateNavigationItem): Promise<NavigationItem> {
  const parsed = createNavigationItemSchema.safeParse(input);
  if (!parsed.success) throw BadRequest("Invalid navigation data");
  return createNavigationRecord(parsed.data);
}

export async function updateNavigation(
  idRaw: string,
  input: UpdateNavigationItem,
): Promise<NavigationItem> {
  const parsed = updateNavigationItemSchema.safeParse(input);
  if (!parsed.success) throw BadRequest("Invalid navigation data");
  if (Object.keys(parsed.data).length === 0) throw BadRequest("Invalid navigation data");
  const id = parseNumericId(idRaw);
  const existing = await findNavigationById(id);
  if (existing === null) throw NotFound("Navigation item not found");
  const next = await updateNavigationRecord(id, parsed.data);
  if (next === null) throw NotFound("Navigation item not found");
  return next;
}

export async function deleteNavigation(idRaw: string): Promise<NavigationItem> {
  const id = parseNumericId(idRaw);
  const removed = await deleteNavigationRecord(id);
  if (removed === null) throw NotFound("Navigation item not found");
  return removed;
}
