import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type * as React from "react";
import { resolveImageSrc } from "@/lib/image-url";
import { getPublishedServiceBySlug } from "@/server/modules/services/services.service";
import ServiceDetailsView from "./view";

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

// বিস্তারিত পেজ — /services/:slug (SEO শিরোনাম সার্ভারে)।
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const service = await getPublishedServiceBySlug(slug);
    const title = `${service.title} | Meghduth Designs`;
    const description = service.description.slice(0, 160);
    const imageUrl = toAbsoluteImageUrl(service.imageKey);
    return {
      title,
      description,
      alternates: {
        canonical: `/services/${slug}`,
      },
      openGraph: {
        title,
        description,
        type: "article",
        images: [{ url: imageUrl, alt: service.title }],
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

export default function ServiceDetailsPage(): React.JSX.Element {
  return <ServiceDetailsView />;
}
