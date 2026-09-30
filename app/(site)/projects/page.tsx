import PageHero from "@/components/common/PageHero";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import ProjectCTA from "@/components/projects/ProjectCTA";

import { getCachedSectionData } from "@/server/modules/page-sections/page-sections.service";
import { asSection } from "@/server/modules/page-sections/section-content";
import {
  projectsHeroFallback,
  projectsIntroFallback,
} from "@/lib/page-fallbacks/projects";

import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Projects | Meghduth Design Studio",
  description:
    "Explore Meghduth Design Studio's portfolio of residential and commercial interior design projects.",
  openGraph: {
    title: "Projects | Meghduth Design Studio",
    description: "Explore Meghduth Design Studio's portfolio of residential and commercial interior design projects.",
    type: "website",
    locale: "en_BD",
    url: "/projects",
    siteName: "Meghduth Design Studio",
    images: [
      {
        url: "/images/projects/project-1.jpeg",
        width: 1200,
        height: 630,
        alt: "Meghduth Design Studio Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Meghduth Design Studio",
    description: "Explore Meghduth Design Studio's portfolio of residential and commercial interior design projects.",
    images: ["/images/projects/project-1.jpeg"],
  },
};

// ফলব্যাক — DB-সারি থাকলে getCachedSectionData জেতে (নিচে)। আসল পাঠ lib/page-fallbacks/projects.ts-এ।
// প্রজেক্ট তালিকা হুক দিয়ে আসে (useProjects)।
const hero = projectsHeroFallback;

const intro = projectsIntroFallback;

// মালিক: Projects ট্যাব — projects.hero/intro।
export default async function ProjectsPage() {
  let heroData = hero;
  let introData = intro;
  try {
    const [heroSec, introSec] = await Promise.all([
      getCachedSectionData("projects", "hero"),
      getCachedSectionData("projects", "intro"),
    ]);
    heroData = asSection(heroSec, hero);
    introData = asSection(introSec, intro);
  } catch {
    // DB ডাউন — ফলব্যাকেই রেন্ডার হয়।
  }
  return (
    <main>
      <PageHero data={heroData} />

      <ProjectsGrid intro={introData} />

      <ProjectCTA />
    </main>
  );
}
