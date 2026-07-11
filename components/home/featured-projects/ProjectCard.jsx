"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function ProjectCard({ project }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl ${
        project.large ? "md:col-span-2" : ""
      }`}
    >
      <div className="relative h-full min-h-[280px]">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/20 transition-all duration-500 group-hover:bg-black/50" />

        <div className="absolute inset-0 flex items-end p-8">
          <div className="translate-y-6 transition-all duration-500 group-hover:translate-y-0">
            <p className="text-sm uppercase tracking-[0.3em] text-[#B79A6A]">
              {project.category}
            </p>

            <h3 className="mt-3 text-3xl font-semibold text-white">
              {project.title}
            </h3>

            <p className="mt-3 text-zinc-300">
              {project.location} • {project.year}
            </p>

            <div className="mt-6 flex items-center gap-2 text-white opacity-0 transition-all duration-500 group-hover:opacity-100">
              <span>View Project</span>

              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
