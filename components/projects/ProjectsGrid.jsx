"use client";

import { useMemo, useState } from "react";

import Container from "@/components/ui/Container";
import SectionHeader from "@/components/common/SectionHeader";

import ProjectFilters from "./ProjectFilters";
import ProjectGallery from "./ProjectGallery";

const ProjectsGrid = ({ data }) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(
    () => [...new Set(data.projects.map((project) => project.category))],
    [data.projects],
  );

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return data.projects;

    return data.projects.filter(
      (project) => project.category === activeCategory,
    );
  }, [activeCategory, data.projects]);

  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow={data.intro.eyebrow}
          title={data.intro.title}
          description={data.intro.description}
        />

        <ProjectFilters
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <ProjectGallery projects={filteredProjects} />
      </Container>
    </section>
  );
};

export default ProjectsGrid;
