// Homepage ট্যাব — হিরো স্লাইড (নিজস্ব কনটেন্ট) + কম্পোজিশন ঝলক।
// বাকি সব সেকশন মালিক ট্যাবে এডিট হয়, এখানে শুধু দেখায় — কেন্দ্রীয় ডেটা।
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import HeroSlidesManager from "@/features/admin/hero-slides/HeroSlidesManager";
import SectionEditor from "@/features/admin/page-sections/SectionEditor";
import {
  AdminCard,
  AdminPageHeader,
} from "@/features/admin/shared/admin-ui";
import {
  homeAboutFallback,
  homeFeaturedFallback,
  homeServicesPreviewFallback,
  homeTestimonialsFallback,
} from "@/lib/page-fallbacks/home";

// হোমপেজ কম্পোজিশন — সেকশন → মালিক ট্যাব। নতুন সেকশন এলে এখানে এক সারি যোগই যথেষ্ট।
const COMPOSITION: Array<{ section: string; owner: string; href: string; note: string }> = [
  {
    section: "Hero slideshow",
    owner: "Homepage",
    href: "/admin/homepage",
    note: "Managed in the Hero Slides section below.",
  },
  {
    section: "Featured Projects",
    owner: "Projects",
    href: "/admin/projects",
    note: "Set the “featured” flag on projects — homepage shows them automatically.",
  },
  {
    section: "Why Choose Meghduth",
    owner: "About",
    href: "/admin/about",
    note: "Edit values in the About tab — homepage reads them from there.",
  },
  {
    section: "About + Stats",
    owner: "About",
    href: "/admin/about",
    note: "Edit stats in the About tab — homepage reads them from there.",
  },
  {
    section: "Services Preview",
    owner: "Services",
    href: "/admin/services",
    note: "Published services appear automatically.",
  },
  {
    section: "Testimonials",
    owner: "Testimonials",
    href: "/admin/testimonials",
    note: "Approved testimonials appear automatically.",
  },
  {
    section: "CTA strip",
    owner: "Contact",
    href: "/admin/contact",
    note: "Edit the call-to-action in the Contact tab.",
  },
];

export default function AdminHomepagePage(): ReactNode {
  return (
    <>
      <AdminPageHeader
        title="Homepage"
        subtitle="Hero slides live here. Everything else is owned by its own tab and shown here automatically."
      />

      <div className="mb-6">
        <HeroSlidesManager />
      </div>

      <div className="mb-6 space-y-6">
        <SectionEditor
          page="home"
          section="featured"
          title="Featured projects header"
          hint="Title block above the theatrical showcase."
          initial={homeFeaturedFallback}
          fields={[
            { kind: "text", key: "badge", label: "Badge" },
            { kind: "text", key: "title", label: "Title" },
            { kind: "textarea", key: "description", label: "Description" },
          ]}
        />
        <SectionEditor
          page="home"
          section="servicesPreview"
          title="Services preview header"
          hint="Title block above the services list."
          initial={homeServicesPreviewFallback}
          fields={[
            { kind: "text", key: "eyebrow", label: "Eyebrow" },
            { kind: "text", key: "title", label: "Title" },
          ]}
        />
        <SectionEditor
          page="home"
          section="testimonials"
          title="Testimonials header"
          hint="Title block above the testimonial carousel."
          initial={homeTestimonialsFallback}
          fields={[
            { kind: "text", key: "eyebrow", label: "Eyebrow" },
            { kind: "text", key: "title", label: "Title" },
            { kind: "textarea", key: "description", label: "Description" },
          ]}
        />
        <SectionEditor
          page="home"
          section="about"
          title="About block"
          hint="Homepage about teaser (stats are edited in the About tab)."
          initial={homeAboutFallback}
          fields={[
            { kind: "text", key: "eyebrow", label: "Eyebrow" },
            { kind: "text", key: "title", label: "Title" },
            { kind: "textarea", key: "description", label: "Description" },
            { kind: "text", key: "buttonLabel", label: "Button label" },
          ]}
        />
      </div>

      <AdminCard>
        <h3 className="mb-1 text-base font-semibold text-[#f5f5f2]">
          Page composition
        </h3>
        <p className="mb-4 text-xs text-[#7a828c]">
          Where each homepage section is edited — one source of truth, no duplicates.
        </p>
        <ul className="divide-y divide-[#2d3238]">
          {COMPOSITION.map((c) => (
            <li key={c.section} className="flex flex-wrap items-center gap-3 py-3">
              <div className="min-w-0 flex-1 basis-48">
                <p className="text-sm font-medium text-[#f5f5f2]">{c.section}</p>
                <p className="mt-0.5 text-xs text-[#7a828c]">{c.note}</p>
              </div>
              <Link
                href={c.href}
                className="rounded-lg border border-[#2d3238] px-3 py-1.5 text-xs font-medium text-[#b6bcc5] hover:border-[#b79a6a] hover:text-[#f5f5f2]"
              >
                {c.owner} →
              </Link>
            </li>
          ))}
        </ul>
      </AdminCard>
    </>
  );
}
