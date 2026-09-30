import { api } from "@/lib/api";
import { cached } from "@/lib/client-cache";
import type { Testimonial } from "@/packages/contracts/src/testimonial.schema";

// মতামত — সরাসরি API থেকে, Envelope lib/api খোলে।
export async function getTestimonials(): Promise<Testimonial[]> {
  return cached("testimonials", () => api.get<Testimonial[]>("/testimonials"));
}
