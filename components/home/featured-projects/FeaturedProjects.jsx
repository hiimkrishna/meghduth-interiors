"use client";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

import ProjectCard from "./ProjectCard";
import projects from "./projects";

export default function FeaturedProjects() {
  return (
    // Mobile Optimization: Balanced section heights for smoother scrolling flow
    <section className="bg-[#0F1115] py-16 sm:py-24 md:py-32">
      <Container>
        <SectionHeading
          badge="Portfolio"
          title="Featured Projects"
          description="Every project reflects our commitment to timeless design, meticulous craftsmanship, and spaces that enhance everyday living."
        />

        {/* 
          Mobile Optimization: 
          - Removed `auto-rows-[250px]` from mobile viewports so cards dynamically scale natively.
          - Kept grid columns adaptive (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3`).
        */}
        <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:auto-rows-[250px] gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className={
                project.large
                  ? "sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2"
                  : "col-span-1"
              }
            >
              {/* The underlying Next.js <Image /> warnings are being triggered inside this ProjectCard component */}
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
