"use client";

import { useMemo, useState } from "react";
import Container from "@/components/ui/Container";
import CommonSectionHeader from "@/components/common/SectionHeader";
import Skeleton from "@/components/ui/Skeleton";
import type { ProjectCardItem } from "@/features/home/featured-projects/components/ProjectCard";
import type { Project } from "@/packages/contracts/src/project.schema";
import { useProjects } from "../hooks/use-projects";
import ProjectFilters from "./ProjectFilters";
import ProjectGallery from "./ProjectGallery";

export interface ProjectsGridIntro {
  eyebrow?: string;
  title: string;
  description?: string;
}

interface ProjectsGridProps {
  intro: ProjectsGridIntro;
}

// API আকৃতি → কার্ড আকৃতি (slug দিয়ে href গড়া)।
const toCardItem = (project: Project): ProjectCardItem => ({
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
});

const ProjectsGrid = ({ intro }: ProjectsGridProps) => {
  const { data: projects, loading, error, retry } = useProjects();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const cards = useMemo(() => projects.map(toCardItem), [projects]);

  const categories = useMemo(
    () => [...new Set(cards.map((project) => project.category))],
    [cards],
  );

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return cards;

    return cards.filter((project) => project.category === activeCategory);
  }, [activeCategory, cards]);

  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <Container>
        <CommonSectionHeader
          eyebrow={intro.eyebrow}
          title={intro.title}
          description={intro.description}
        />

        {/* লোডিং অবস্থা — কঙ্কাল */}
        {loading && (
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {[0, 1, 2, 3].map((key) => (
              <Skeleton key={key} className="h-80" />
            ))}
          </div>
        )}
        {/* ত্রুটি অবস্থা — বাংলা বার্তা + পুনঃচেষ্টা */}
        {!loading && error !== null && (
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <p className="text-base text-neutral-400">
              Failed to load projects: {error}
            </p>
            <button
              type="button"
              onClick={retry}
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-[#B79A6A] hover:text-[#B79A6A]"
            >
              Try again
            </button>
          </div>
        )}
        {/* শূন্য অবস্থা */}
        {!loading && error === null && filteredProjects.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-base text-neutral-400">
              No projects found.
            </p>
          </div>
        )}
        {!loading && error === null && filteredProjects.length > 0 && (
          <>
            <ProjectFilters
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            <ProjectGallery projects={filteredProjects} />
          </>
        )}
      </Container>
    </section>
  );
};

export default ProjectsGrid;
