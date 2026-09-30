"use client";

import Image from "next/image";
import { useState } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Breadcrumb from "@/components/common/Breadcrumb";
import { resolveImageSrc } from "@/lib/image-url";
import { useProject } from "../hooks/use-project";
import ProjectLightbox, { type LightboxItem } from "./ProjectLightbox";

interface ProjectDetailsProps {
  slug: string;
}

export default function ProjectDetails({ slug }: ProjectDetailsProps) {
  const { project, loading, error, retry } = useProject(slug);
  // লাইটবক্স — কোন ছবিতে আছে (null = বন্ধ)।
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <main className="pt-28 pb-20">
        <Container>
          <Skeleton className="h-[50vh] w-full rounded-3xl" />
          <Skeleton className="mx-auto mt-10 h-10 w-2/3" />
          <Skeleton className="mx-auto mt-4 h-5 w-1/2" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <Skeleton className="h-72" />
            <Skeleton className="h-72" />
          </div>
        </Container>
      </main>
    );
  }

  if (error !== null || project === null) {
    return (
      <main className="pt-32 pb-20">
        <Container>
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
            <p className="text-base text-neutral-400">
              {error ?? "Project not found."}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={retry}
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-[#B79A6A] hover:text-[#B79A6A]"
              >
                Try again
              </button>
              <Button href="/projects" variant="secondary">
                All projects
              </Button>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  const cover = resolveImageSrc(project.imageKey);
  const gallery = (project.images ?? [])
    .map((img) => ({ src: resolveImageSrc(img.imageKey), alt: img.alt ?? project.title }))
    .filter((img): img is { src: string; alt: string } => img.src !== undefined);

  // লাইটবক্স তালিকা — কভার সবার আগে, তারপর গ্যালারি।
  const viewerItems: LightboxItem[] = [
    ...(cover !== undefined ? [{ src: cover, alt: project.title }] : []),
    ...gallery,
  ];

  // গ্যালারি বিন্যাস — প্রথম ছবি থিয়েটার, বাকিগুলো নিচে।
  const [first, ...rest] = gallery;
  const theaterOffset = cover !== undefined ? 1 : 0;

  return (
    <main>
      {/* Cover */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden pt-28">
        {cover !== undefined ? (
          <Image
            src={cover}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-[#232628] via-[#17191B] to-[#0c0d0e]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-[#111315]" />
        <Container className="relative z-10 pb-14 sm:pb-16">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Projects", href: "/projects" },
              { label: project.title },
            ]}
          />
          <p className="mt-6 text-xs sm:text-sm font-medium uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#B79A6A] select-none">
            {project.category}
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.1] tracking-tight text-white text-balance">
            {project.title}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-zinc-300">
            {[project.location, project.year].filter(Boolean).join(" • ")}
          </p>
        </Container>
      </section>

      {/* About */}
      {project.description !== undefined && project.description !== "" && (
        <section className="py-16 sm:py-20">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                About this project
              </h2>
              <p className="mt-5 text-base sm:text-lg leading-relaxed text-neutral-400">
                {project.description}
              </p>
            </div>
          </Container>
        </section>
      )}

      {/* Gallery — প্রথম ছবি থিয়েটার (ফুল-উইডথ), বাকিগুলো নিচে গ্রিডে */}
      {first !== undefined && (
        <section className="pb-16 sm:pb-20">
          <Container>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Gallery
            </h2>
            {/* থিয়েটার — প্রথম ছবি */}
            <button
              type="button"
              onClick={() => setLightboxIndex(theaterOffset)}
              aria-label={`View fullscreen: ${first.alt}`}
              className="group relative mt-8 block h-[46vh] sm:h-[62vh] w-full overflow-hidden rounded-2xl sm:rounded-3xl cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B79A6A]"
            >
              <Image
                src={first.src}
                alt={first.alt}
                fill
                sizes="100vw"
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </button>
            {/* বাকি ছবি */}
            {rest.length > 0 && (
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {rest.map((img, i) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setLightboxIndex(theaterOffset + 1 + i)}
                    aria-label={`View fullscreen: ${img.alt}`}
                    className="group relative h-72 sm:h-80 overflow-hidden rounded-2xl sm:rounded-3xl cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B79A6A]"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            )}
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className="pb-20 sm:pb-24">
        <Container>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button href="/projects" variant="secondary">
              All projects
            </Button>
            <Button href="/contact">Start your project</Button>
          </div>
        </Container>
      </section>

      {/* ফুলস্ক্রিন ভিউয়ার */}
      <ProjectLightbox
        items={viewerItems}
        index={lightboxIndex}
        onSelect={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </main>
  );
}
