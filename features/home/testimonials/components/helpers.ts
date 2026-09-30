import type { Testimonial } from "@/packages/contracts/src/testimonial.schema";

export type CardPosition = "left" | "center" | "right" | "hidden";

export type VisibleTestimonial = Testimonial & {
  position: CardPosition;
};

export function getPreviousIndex(current: number, total: number): number {
  return (current - 1 + total) % total;
}

export function getNextIndex(current: number, total: number): number {
  return (current + 1) % total;
}

export function getVisibleTestimonials(
  testimonials: Testimonial[],
  current: number,
): VisibleTestimonial[] {
  const total = testimonials.length;
  if (total === 0) return [];

  const previousIndex = getPreviousIndex(current, total);

  const nextIndex = getNextIndex(current, total);

  return testimonials.map((item, index) => {
    let position: CardPosition = "hidden";

    if (index === previousIndex) {
      position = "left";
    }

    if (index === current) {
      position = "center";
    }

    if (index === nextIndex) {
      position = "right";
    }

    return {
      ...item,
      position,
    };
  });
}
