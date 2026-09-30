"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Skeleton from "@/components/ui/Skeleton";
import ProjectCard from "./ProjectCard";
import TheatricalFeature from "./TheatricalFeature";
import { useFeaturedProjects } from "../hooks/use-featured-projects";

export default function FeaturedProjects() {
  const { projects, loading, error, retry } = useFeaturedProjects();
  const [head, ...rest] = projects;

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
        {/* লোডিং অবস্থা — কঙ্কাল */}
        {loading && (
          <div className="mt-12 sm:mt-16 md:mt-20 space-y-6">
            <Skeleton className="aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9]" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[0, 1].map((key) => (
                <Skeleton key={key} className="min-h-[320px] sm:min-h-[280px]" />
              ))}
            </div>
          </div>
        )}
        {/* ত্রুটি অবস্থা — বাংলা বার্তা + পুনঃচেষ্টা */}
        {!loading && error !== null && (
          <div className="mt-12 flex flex-col items-center gap-4 text-center sm:mt-16 md:mt-20">
            <p className="text-base text-neutral-300">
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
        {!loading && error === null && projects.length === 0 && (
          <div className="mt-12 text-center sm:mt-16 md:mt-20">
            <p className="text-base text-neutral-300">
              No featured projects found.
            </p>
          </div>
        )}
        {!loading && error === null && projects.length > 0 && head !== undefined && (
          <div className="mt-12 sm:mt-16 md:mt-20">
            {/* Theatrical lead — first project, full-bleed cinematic */}
            <TheatricalFeature project={head} indexLabel="01 — Featured" />

            {/* Asymmetric cards — second column drops on desktop for staggered rhythm */}
            {rest.length > 0 && (
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                {rest.map((project, i) => (
                  <div key={project.id} className={i % 2 === 1 ? "md:mt-16" : ""}>
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-12 flex justify-center md:mt-16">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:border-[#B79A6A] hover:text-[#B79A6A]"
              >
                <span>View All Projects</span>
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
