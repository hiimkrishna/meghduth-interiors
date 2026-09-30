"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { resolveImageSrc } from "@/lib/image-url";
import type { ProjectCardItem } from "./ProjectCard";

interface TheatricalFeatureProps {
  project: ProjectCardItem;
  indexLabel: string;
}

export default function TheatricalFeature({ project, indexLabel }: TheatricalFeatureProps) {
  if (!project) return null;

  const imageSrc: string | undefined = resolveImageSrc(project.imageKey ?? project.image);
  const detailsHref: string | undefined =
    project.slug !== undefined && project.slug !== ""
      ? `/projects/${project.slug}`
      : project.href;

  const inner = (
    <>
      {imageSrc !== undefined && imageSrc !== "" ? (
        <Image
          src={imageSrc}
          alt={project.title || "Featured interior design project"}
          fill
          priority
          className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04] will-change-transform"
          sizes="100vw"
          quality={80}
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#232628] via-[#17191B] to-[#0c0d0e]"
        />
      )}

      {/* Cinematic grade — left-heavy, floor-weighted */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      {/* Top row: index + circular link */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6 sm:p-10">
        <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.3em] text-white/70 select-none">
          {indexLabel}
        </span>
        {detailsHref !== undefined && (
          <span
            aria-hidden="true"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition-all duration-300 group-hover:border-[#B79A6A] group-hover:bg-[#B79A6A] group-hover:text-neutral-950 sm:h-14 sm:w-14"
          >
            <ArrowUpRight size={22} />
          </span>
        )}
      </div>

      {/* Title block: bottom-left */}
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12">
        <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#B79A6A] select-none">
          {project.category}
        </p>
        <h2 className="mt-3 sm:mt-4 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight text-white text-balance">
          {project.title}
        </h2>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-zinc-300">
          {project.location} • {project.year}
        </p>
      </div>
    </>
  );

  return (
    <div className="group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl">
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
        {detailsHref !== undefined ? (
          <Link href={detailsHref} aria-label={`View ${project.title}`} className="absolute inset-0">
            {inner}
          </Link>
        ) : (
          inner
        )}
      </div>
    </div>
  );
}
