import type {
  CreateService,
  ServiceDetail,
  ServiceImage,
  ServiceItem,
  UpdateService,
} from "@/packages/contracts/src/service.schema";
import {
  createServiceImageSchema,
  createServiceSchema,
  updateServiceSchema,
} from "@/packages/contracts/src/service.schema";
import type { PageMeta } from "@/packages/contracts/src/pagination";
import { buildPageMeta } from "@/packages/contracts/src/pagination";
import { BadRequest, Conflict, NotFound } from "@/server/lib/response";
import {
  addServiceImageRecord,
  createServiceRecord,
  deleteServiceRecord,
  findAllServices,
  findPublishedServices,
  findServiceById,
  findServiceBySlug,
  findServiceImages,
  removeServiceImageRecord,
  updateServiceRecord,
} from "./services.repository";
import type { CreateServiceImageInput } from "./services.repository";

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

export async function listPublishedServices(
  input?: { page?: unknown; limit?: unknown },
): Promise<PublishedListResult<ServiceItem>> {
  const page = clampPage(input?.page);
  const limit = clampLimit(input?.limit);
  const { items, total } = await findPublishedServices({ page, limit });
  return { items, meta: buildPageMeta(total, { page, limit }) };
}

export async function listAllServices(): Promise<ServiceItem[]> {
  return findAllServices();
}

// বিস্তারিত — শুধু প্রকাশিত সেবা, ছবিসহ। খসড়া/অজানা slug-এ 404।
export async function getPublishedServiceBySlug(slugRaw: string): Promise<ServiceDetail> {
  const slug = slugRaw.trim().toLowerCase();
  if (slug === "") throw NotFound("Service not found");
  const item = await findServiceBySlug(slug);
  if (item === null || item.published !== true) throw NotFound("Service not found");
  const images = await findServiceImages(String(item.id));
  return { ...item, images };
}

// অ্যাডমিন বিস্তারিত — সেবা + গ্যালারি ছবিসহ।
export async function getAdminServiceById(idRaw: string): Promise<ServiceDetail> {
  const id = idRaw.trim();
  if (id === "") throw NotFound("Service not found");
  const item = await findServiceById(id);
  if (item === null) throw NotFound("Service not found");
  const images = await findServiceImages(String(item.id));
  return { ...item, images };
}

export async function addServiceImage(
  serviceId: string,
  input: CreateServiceImageInput,
): Promise<ServiceImage> {
  const parsed = createServiceImageSchema.safeParse({ ...input, serviceId });
  if (!parsed.success) throw BadRequest("Invalid image data");
  if (serviceId.trim() === "") throw NotFound("Service not found");
  const existing = await findServiceById(serviceId);
  if (existing === null) throw NotFound("Service not found");
  return addServiceImageRecord(serviceId, {
    imageKey: parsed.data.imageKey,
    ...(parsed.data.alt !== undefined ? { alt: parsed.data.alt } : {}),
    ...(parsed.data.order !== undefined ? { order: parsed.data.order } : {}),
  });
}

export async function removeServiceImage(idRaw: string): Promise<ServiceImage> {
  const id = Number(idRaw);
  if (!Number.isInteger(id) || id <= 0) throw NotFound("Service image not found");
  const removed = await removeServiceImageRecord(id);
  if (removed === null) throw NotFound("Service image not found");
  return removed;
}

export async function createService(input: CreateService): Promise<ServiceItem> {
  const parsed = createServiceSchema.safeParse(input);
  if (!parsed.success) throw BadRequest("Invalid service data");
  const taken = await findServiceBySlug(parsed.data.slug).catch(() => null);
  if (taken !== null) throw Conflict("Slug already exists");
  return createServiceRecord(parsed.data);
}

export async function updateService(id: string, input: UpdateService): Promise<ServiceItem> {
  const parsed = updateServiceSchema.safeParse(input);
  if (!parsed.success) throw BadRequest("Invalid service data");
  if (Object.keys(parsed.data).length === 0) throw BadRequest("Invalid service data");
  if (id.trim() === "") throw NotFound("Service not found");
  const existing = await findServiceById(id);
  if (existing === null) throw NotFound("Service not found");
  if (parsed.data.slug !== undefined && parsed.data.slug !== existing.slug) {
    const taken = await findServiceBySlug(parsed.data.slug).catch(() => null);
    if (taken !== null) throw Conflict("Slug already exists");
  }
  const next = await updateServiceRecord(id, parsed.data);
  if (next === null) throw NotFound("Service not found");
  return next;
}

export async function deleteService(id: string): Promise<ServiceItem> {
  if (id.trim() === "") throw NotFound("Service not found");
  const removed = await deleteServiceRecord(id);
  if (removed === null) throw NotFound("Service not found");
  return removed;
}
