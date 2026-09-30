import { api } from "@/lib/api";
import { cached } from "@/lib/client-cache";
import type { Project } from "@/packages/contracts/src/project.schema";
import type { ProjectCardItem } from "../components/ProjectCard";

// ফিচার্ড প্রজেক্ট — API থেকে সব এনে ক্লায়েন্টে featured ছেঁকে কার্ড আকৃতিতে রূপান্তর।
export async function getFeaturedProjects(): Promise<ProjectCardItem[]> {
  return cached("featured-projects", async (): Promise<ProjectCardItem[]> => {
    const projects = await api.get<Project[]>("/projects");
    return projects
      .filter((project) => project.featured)
      .map(
        (project): ProjectCardItem => ({
          id: project.id,
          slug: project.slug,
          href: "/projects/" + project.slug,
          title: project.title,
          category: project.category,
          location: project.location,
          year: project.year,
          imageKey: project.imageKey,
          featured: project.featured,
          large: project.featured,
        }),
      );
  });
}
