import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type * as React from "react";
import { resolveImageSrc } from "@/lib/image-url";
import { getPublishedProjectBySlug } from "@/server/modules/projects/projects.service";
import ProjectDetailsView from "./view";

const FALLBACK_OG_IMAGE = "/images/hero/hero1.jpeg";

// সাইট-ভিত্তি — env থেকে, অনুপস্থিত হলে প্রোডাকশন-ফলব্যাক।
function getSiteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  const base = raw !== "" ? raw : "https://meghduthdesign.com";
  return base.replace(/\/+$/, "");
}

// OG-ছবি — সবসময় পরম URL (লোকাল key হলে /uploads/ পথে, metadataBase-সাপেক্ষে)।
function toAbsoluteImageUrl(imageKey: string | undefined): string {
  const resolved = resolveImageSrc(imageKey) ?? FALLBACK_OG_IMAGE;
  if (resolved.startsWith("http://") || resolved.startsWith("https://")) {
    return resolved;
  }
  const path = resolved.startsWith("/") ? resolved : `/${resolved}`;
  return `${getSiteUrl()}${path}`;
}

// বিস্তারিত পেজ — /projects/:slug (SEO শিরোনাম সার্ভারে)।
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await getPublishedProjectBySlug(slug);
    const title = `${project.title} | Meghduth Designs`;
    const fallbackDescription = `${project.title} — ${project.category} project by Meghduth Design Studio.`;
    const description = (project.description ?? fallbackDescription).slice(0, 160);
    const imageUrl = toAbsoluteImageUrl(project.imageKey);
    return {
      title,
      description,
      alternates: {
        canonical: `/projects/${slug}`,
      },
      openGraph: {
        title,
        description,
        type: "article",
        images: [{ url: imageUrl, alt: project.title }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch {
    notFound();
  }
}

export default function ProjectDetailsPage(): React.JSX.Element {
  return <ProjectDetailsView />;
}
