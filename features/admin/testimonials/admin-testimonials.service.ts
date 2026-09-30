import { api } from "@/lib/api";
import { toArray } from "../shared/use-admin-list";
import type {
  CreateTestimonial,
  ModerateTestimonial,
  Testimonial,
  UpdateTestimonial,
} from "@/packages/contracts/src/testimonial.schema";
import type { AdminId } from "../hero-slides/hero-slides.service";

// মতামত — নতুন (create) + অনুমোদন (moderate: status/published)।
export async function listAdminTestimonials(): Promise<Testimonial[]> {
  const data = await api.get<unknown>("/admin/testimonials");
  return toArray<Testimonial>(data);
}

export async function createAdminTestimonial(
  payload: CreateTestimonial,
): Promise<Testimonial> {
  return api.post<Testimonial>("/admin/testimonials", payload);
}

export async function moderateAdminTestimonial(
  id: AdminId,
  payload: ModerateTestimonial,
): Promise<Testimonial> {
  return api.patch<Testimonial>(
    `/admin/testimonials/${String(id)}`,
    payload,
  );
}

// পূর্ণ সম্পাদনা — কনটেন্ট + status/published।
export async function updateAdminTestimonial(
  id: AdminId,
  payload: UpdateTestimonial,
): Promise<Testimonial> {
  return api.patch<Testimonial>(
    `/admin/testimonials/${String(id)}`,
    payload,
  );
}

export async function deleteAdminTestimonial(id: AdminId): Promise<void> {
  await api.del<unknown>(`/admin/testimonials/${String(id)}`);
}
