// Homepage ট্যাব — হিরো স্লাইড (নিজস্ব কনটেন্ট) + কম্পোজিশন ঝলক।
// বাকি সব সেকশন মালিক ট্যাবে এডিট হয়, এখানে শুধু দেখায় — কেন্দ্রীয় ডেটা।
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import HeroSlidesManager from "@/features/admin/hero-slides/HeroSlidesManager";
import {
  AdminCard,
  AdminPageHeader,
} from "@/features/admin/shared/admin-ui";

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
