import { describe, it, expect } from "vitest";
import { createHeroSlideSchema, heroSlideSchema } from "./hero.schema";

describe("Hero Slide Schema", () => {
  it("validates a valid hero slide", () => {
    const validSlide = {
      imageKey: "/images/hero/hero1.jpeg",
      badge: "Interior Design",
      title: "Designing Spaces That Inspire",
      description: "Elegant interiors crafted to reflect your lifestyle",
      order: 0,
      published: true,
    };

    const result = createHeroSlideSchema.safeParse(validSlide);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.badge).toBe("Interior Design");
      expect(result.data.published).toBe(true);
    }
  });

  it("rejects missing required fields", () => {
    const invalidSlide = {
      badge: "Interior Design",
      // missing imageKey, title, description
    };

    const result = createHeroSlideSchema.safeParse(invalidSlide);
    expect(result.success).toBe(false);
  });

  it("rejects empty title", () => {
    const invalidSlide = {
      imageKey: "/images/hero/hero1.jpeg",
      badge: "Interior Design",
      title: "",
      description: "Elegant interiors crafted to reflect your lifestyle",
      order: 0,
      published: true,
    };

    const result = createHeroSlideSchema.safeParse(invalidSlide);
    expect(result.success).toBe(false);
  });

  it("validates order is non-negative integer", () => {
    const invalidSlide = {
      imageKey: "/images/hero/hero1.jpeg",
      badge: "Interior Design",
      title: "Designing Spaces",
      description: "Elegant interiors",
      order: -1,
      published: true,
    };

    const result = createHeroSlideSchema.safeParse(invalidSlide);
    expect(result.success).toBe(false);
  });

  it("validates published is boolean", () => {
    const invalidSlide = {
      imageKey: "/images/hero/hero1.jpeg",
      badge: "Interior Design",
      title: "Designing Spaces",
      description: "Elegant interiors",
      order: 0,
      published: "yes", // should be boolean
    };

    const result = createHeroSlideSchema.safeParse(invalidSlide);
    expect(result.success).toBe(false);
  });
});