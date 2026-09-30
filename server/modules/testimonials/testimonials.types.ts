import type { Testimonial } from "@/packages/contracts/src/testimonial.schema";

export type { Testimonial };

// পেজ আকার — তালিকা + মোট সংখ্যা।
export interface TestimonialPage {
  items: Testimonial[];
  total: number;
}
