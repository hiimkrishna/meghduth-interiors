"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function ProjectCard({ project }) {
  if (!project) return null;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl w-full h-full transition-all duration-300 ${
        project.large ? "md:col-span-2" : ""
      }`}
    >
      {/* Container aspect ratio management */}
      <div className="relative w-full h-full min-h-[320px] sm:min-h-[280px] flex flex-col justify-end">
        <Image
          src={project.image}
          alt={project.title || "Interior design project showcase"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
          // 🚀 FIXES ERROR: Downserves mobile-optimized asset sizes based on grid layouts
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          // 🚀 FIXES ERROR: Matches the explicit Next.js strict configuration pipeline quality threshold
          quality={75}
          loading="lazy"
        />

        {/* Overlay: Slightly darkened by default on mobile for text readability since mobile has no hover state */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/10 md:bg-black/20 transition-all duration-500 md:group-hover:bg-black/60 z-10" />

        {/* Content Container */}
        <div className="absolute inset-0 flex items-end p-6 sm:p-8 z-20 pointer-events-none">
          {/* Mobile Optimization: Removed translate-y and opacity blocks on small viewports so content is immediately readable */}
          <div className="transform-none md:translate-y-6 transition-all duration-500 md:group-hover:translate-y-0 w-full">
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#B79A6A] select-none">
              {project.category}
            </p>

            <h3 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-semibold text-white tracking-tight text-balance">
              {project.title}
            </h3>

            <p className="mt-1.5 sm:mt-3 text-sm sm:text-base text-zinc-300">
              {project.location} • {project.year}
            </p>

            {/* View Link: Always visible on mobile screens, animated only on desktop link frames */}
            <div className="mt-4 sm:mt-6 flex items-center gap-2 text-sm sm:text-base font-medium text-white opacity-100 md:opacity-0 transition-all duration-500 md:group-hover:opacity-100">
              <span>View Project</span>
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 md:group-hover:translate-x-1 md:group-hover:-translate-y-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
