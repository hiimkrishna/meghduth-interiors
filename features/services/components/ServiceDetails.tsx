"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Breadcrumb from "@/components/common/Breadcrumb";
import { resolveImageSrc } from "@/lib/image-url";
import { useService } from "../hooks/use-service";
import { useServices } from "../hooks/use-services";
import ProjectLightbox, { type LightboxItem } from "@/features/projects/components/ProjectLightbox";

interface ServiceDetailsProps {
  slug: string;
}

// হালকা মার্কডাউন — অ্যাডমিন সাধারণ টেক্সটে লিখলেই রিচ কনটেন্ট:
// "## শিরোনাম" → উপ-শিরোনাম, "- পয়েন্ট" → বুলেট, খালি লাইন → অনুচ্ছেদ।
type BodyBlock =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "ul"; items: string[] };

function parseBody(description: string): BodyBlock[] {
  const chunks = description
    .split(/\n\s*\n/)
    .map((c) => c.trim())
    .filter((c) => c !== "");
  const blocks: BodyBlock[] = [];
  for (const chunk of chunks) {
    if (chunk.startsWith("## ")) {
      blocks.push({ kind: "h", text: chunk.slice(3).trim() });
      continue;
    }
    const lines = chunk
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l !== "");
    if (lines.length > 0 && lines.every((l) => l.startsWith("- "))) {
      blocks.push({ kind: "ul", items: lines.map((l) => l.slice(2).trim()) });
      continue;
    }
    blocks.push({ kind: "p", text: chunk });
  }
  return blocks;
}

export default function ServiceDetails({ slug }: ServiceDetailsProps) {
  const { service, loading, error, retry } = useService(slug);
  const { services } = useServices();
  // লাইটবক্স — কোন ছবিতে আছে (null = বন্ধ)।
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <main className="pt-28 pb-20">
        <Container>
          <Skeleton className="h-[46vh] w-full rounded-3xl" />
          <Skeleton className="mx-auto mt-10 h-10 w-2/3" />
          <Skeleton className="mx-auto mt-4 h-5 w-full max-w-2xl" />
        </Container>
      </main>
    );
  }

  if (error !== null || service === null) {
    return (
      <main className="pt-32 pb-20">
        <Container>
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
            <p className="text-base text-neutral-400">
              {error ?? "Service not found."}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={retry}
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-[#B79A6A] hover:text-[#B79A6A]"
              >
                Try again
              </button>
              <Button href="/services" variant="secondary">
                All services
              </Button>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  const cover = resolveImageSrc(service.imageKey);
  const gallery = (service.images ?? [])
    .map((img) => ({ src: resolveImageSrc(img.imageKey), alt: img.alt ?? service.title }))
    .filter((img): img is { src: string; alt: string } => img.src !== undefined);

  // লাইটবক্স তালিকা — কভার সবার আগে, তারপর গ্যালারি।
  const viewerItems: LightboxItem[] = [
    ...(cover !== undefined ? [{ src: cover, alt: service.title }] : []),
    ...gallery,
  ];
  const theaterOffset = cover !== undefined ? 1 : 0;
  const [first, ...rest] = gallery;
  const blocks = parseBody(service.description);

  return (
    <main>
      {/* Cover — মাঝখানে শিরোনাম + ব্রেডক্রাম্ব */}
      <section className="relative flex min-h-[68vh] items-center justify-center overflow-hidden pt-28 pb-16 text-center">
        {cover !== undefined ? (
          <Image
            src={cover}
            alt={service.title}
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
        <div className="absolute inset-0 bg-black/55" />
        <Container className="relative z-10">
          <div className="flex justify-center">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: service.title },
              ]}
            />
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.1] tracking-tight text-white text-balance">
            {service.title}
          </h1>
        </Container>
      </section>

      {/* Body — বামে সেবা-তালিকা, ডানে কনটেন্ট */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
            {/* Sidebar — সব সেবা, নম্বরসহ */}
            <aside aria-label="All services">
              <div className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible lg:pb-0">
                {services.map((s, i) => {
                  const active = s.slug === service.slug;
                  return (
                    <Link
                      key={String(s.id)}
                      href={`/services/${s.slug}`}
                      aria-current={active ? "page" : undefined}
                      className={`flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-xs font-medium uppercase tracking-wider transition-colors lg:text-[13px] ${
                        active
                          ? "border-[#B79A6A]/60 bg-[#B79A6A]/10 text-[#B79A6A]"
                          : "border-white/10 bg-white/[0.02] text-neutral-400 hover:border-[#B79A6A]/40 hover:text-white"
                      }`}
                    >
                      <span className={active ? "text-[#B79A6A]" : "text-neutral-500"}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="whitespace-nowrap lg:whitespace-normal">
                        {s.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </aside>

            {/* Content */}
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#B79A6A] select-none">
                [ What we offer ]
              </p>
              <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-white text-balance">
                Overview
              </h2>
              <div className="mt-7 space-y-6">
                {blocks.map((b, i) => {
                  if (b.kind === "h") {
                    return (
                      <h3
                        key={i}
                        className="pt-2 text-xl sm:text-2xl font-semibold tracking-tight text-white"
                      >
                        {b.text}
                      </h3>
                    );
                  }
                  if (b.kind === "ul") {
                    return (
                      <ul key={i} className="space-y-3">
                        {b.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-3 text-base sm:text-lg leading-relaxed text-neutral-400">
                            <span
                              aria-hidden="true"
                              className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#B79A6A]"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={i} className="text-base sm:text-lg leading-relaxed text-neutral-400">
                      {b.text}
                    </p>
                  );
                })}
              </div>

              {/* Get started */}
              <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-7 sm:p-9">
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Get Started
                </h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-neutral-400">
                  Tell us about your space — our designers will craft a {service.title.toLowerCase()} plan around your lifestyle, budget, and vision.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <Button href="/contact">Free Consultation</Button>
                  <Button href="/services" variant="secondary">
                    All services
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Gallery — প্রথম ছবি থিয়েটার, বাকিগুলো নিচে */}
      {first !== undefined && (
        <section className="pb-16 sm:pb-20">
          <Container>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Gallery
            </h2>
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
