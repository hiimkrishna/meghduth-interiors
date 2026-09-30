import { describe, expect, it } from "vitest";
import {
  pageSectionsQuerySchema,
  upsertPageSectionSchema,
} from "./page-section.schema";

describe("upsertPageSectionSchema", () => {
  it("accepts a valid about section", () => {
    const parsed = upsertPageSectionSchema.safeParse({
      page: "about",
      section: "whyChoose",
      data: { title: "Hello" },
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects an unknown page", () => {
    const parsed = upsertPageSectionSchema.safeParse({
      page: "blog",
      section: "hero",
      data: {},
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects an invalid section key", () => {
    const parsed = upsertPageSectionSchema.safeParse({
      page: "contact",
      section: "Bad Section!",
      data: {},
    });
    expect(parsed.success).toBe(false);
  });
});

describe("pageSectionsQuerySchema", () => {
  it("accepts page-only query", () => {
    const parsed = pageSectionsQuerySchema.safeParse({ page: "home" });
    expect(parsed.success).toBe(true);
  });
});
