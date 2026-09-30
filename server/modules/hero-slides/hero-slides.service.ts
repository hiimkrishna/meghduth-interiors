import type {
  CreateHeroSlide,
  HeroSlide,
  UpdateHeroSlide,
} from "@/packages/contracts/src/hero.schema";
import { MAX_HERO_SLIDES, createHeroSlideSchema, updateHeroSlideSchema } from "@/packages/contracts/src/hero.schema";
import type { PageMeta } from "@/packages/contracts/src/pagination";
import { buildPageMeta } from "@/packages/contracts/src/pagination";
import { BadRequest, Conflict, NotFound } from "@/server/lib/response";
import {
  countHeroSlides,
  createHeroSlideRecord,
  deleteHeroSlideRecord,
  findAllHeroSlides,
  findHeroSlideById,
  findPublishedHeroSlides,
  updateHeroSlideRecord,
} from "./hero-slides.repository";

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

export async function listPublishedHeroSlides(
  input?: { page?: unknown; limit?: unknown },
): Promise<PublishedListResult<HeroSlide>> {
  const page = clampPage(input?.page);
  const limit = clampLimit(input?.limit);
  const { items, total } = await findPublishedHeroSlides({ page, limit });
  return { items, meta: buildPageMeta(total, { page, limit }) };
}

export async function listAllHeroSlides(): Promise<HeroSlide[]> {
  return findAllHeroSlides();
}

function parseNumericId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw NotFound("Hero slide not found");
  return id;
}

export async function createHeroSlide(input: CreateHeroSlide): Promise<HeroSlide> {
  const parsed = createHeroSlideSchema.safeParse(input);
  if (!parsed.success) throw BadRequest("Invalid hero slide data");
  // স্লাইডশোতে সর্বোচ্চ MAX_HERO_SLIDES (৬) — তার বেশি যোগ করা নিষেধ।
  const total = await countHeroSlides();
  if (total >= MAX_HERO_SLIDES)
    throw Conflict(`Maximum ${MAX_HERO_SLIDES} hero slides allowed`);
  return createHeroSlideRecord(parsed.data);
}

export async function updateHeroSlide(idRaw: string, input: UpdateHeroSlide): Promise<HeroSlide> {
  const parsed = updateHeroSlideSchema.safeParse(input);
  if (!parsed.success) throw BadRequest("Invalid hero slide data");
  if (Object.keys(parsed.data).length === 0) throw BadRequest("Invalid hero slide data");
  const id = parseNumericId(idRaw);
  const existing = await findHeroSlideById(id);
  if (existing === null) throw NotFound("Hero slide not found");
  const next = await updateHeroSlideRecord(id, parsed.data);
  if (next === null) throw NotFound("Hero slide not found");
  return next;
}

export async function deleteHeroSlide(idRaw: string): Promise<HeroSlide> {
  const id = parseNumericId(idRaw);
  const removed = await deleteHeroSlideRecord(id);
  if (removed === null) throw NotFound("Hero slide not found");
  return removed;
}
