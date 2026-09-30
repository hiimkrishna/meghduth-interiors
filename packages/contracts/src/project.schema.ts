import { z } from "zod";
import {
  imageKeySchema,
  nonEmptyString,
  orderSchema,
  publishedSchema,
  slugSchema,
} from "./common";

// প্রজেক্ট — data/projects.js, projectsPageData ও featured-projects-এর একক সত্য।
export const projectCategorySchema = z.string().trim().min(1).max(120);

export const projectSchema = z.object({
  id: z.string().uuid().or(z.number().int().positive()),
  slug: slugSchema,
  title: nonEmptyString(200),
  category: projectCategorySchema,
  location: z.string().trim().max(200).optional(),
  year: z.string().trim().max(16).optional(),
  description: nonEmptyString(4000).optional(),
  imageKey: imageKeySchema.optional(),
  featured: z.boolean().default(false),
  order: orderSchema.optional(),
  published: publishedSchema.optional(),
});

export type Project = z.infer<typeof projectSchema>;
export const createProjectSchema = z.object({
  slug: slugSchema,
  title: nonEmptyString(200),
  category: projectCategorySchema,
  location: z.string().trim().max(200).optional(),
  year: z.string().trim().max(16).optional(),
  description: nonEmptyString(4000).optional(),
  imageKey: imageKeySchema.optional(),
  featured: z.boolean().default(false),
  order: orderSchema,
  published: publishedSchema,
});

export type CreateProject = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.partial();

export type UpdateProject = z.infer<typeof updateProjectSchema>;

export const projectImageSchema = z.object({
  id: z.string().uuid().or(z.number().int().positive()),
  projectId: z.string().uuid().or(z.number().int().positive()),
  imageKey: imageKeySchema,
  alt: z.string().trim().max(255).optional(),
  order: orderSchema.optional(),
});

export type ProjectImage = z.infer<typeof projectImageSchema>;

// বিস্তারিত পেজ — প্রজেক্ট + গ্যালারি ছবি একসাথে।
export const projectDetailSchema = projectSchema.extend({
  images: z.array(projectImageSchema).default([]),
});

export type ProjectDetail = z.infer<typeof projectDetailSchema>;

export const createProjectImageSchema = z.object({
  projectId: z.string().min(1).or(z.number().int().positive()),
  imageKey: imageKeySchema,
  alt: z.string().trim().max(255).optional(),
  order: orderSchema,
});

export type CreateProjectImage = z.infer<typeof createProjectImageSchema>;

export const projectListSchema = z.array(projectSchema);
