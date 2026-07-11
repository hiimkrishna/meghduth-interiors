"use client";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

import ProjectCard from "./ProjectCard";
import projects from "./projects";

export default function FeaturedProjects() {
  return (
    <section className="bg-[#0F1115] py-24 md:py-32">
      <Container>
        <SectionHeading
          badge="Portfolio"
          title="Featured Projects"
          description="Every project reflects our commitment to timeless design, meticulous craftsmanship, and spaces that enhance everyday living."
        />

        <div className="mt-20 grid gap-6 md:grid-cols-3 auto-rows-[250px]">
          {projects.map((project) => (
            <div
              key={project.id}
              className={project.large ? "md:col-span-2 md:row-span-2" : ""}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
