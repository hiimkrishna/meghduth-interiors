import PageHero from "@/components/common/PageHero";

import Story from "@/components/about/Story";
import Philosophy from "@/components/about/Philosophy";
import Approach from "@/components/about/Approach";
import TeamPreview from "@/components/about/TeamPreview";

import CTA from "@/components/home/cta/CTA";

import { getCachedSectionData } from "@/server/modules/page-sections/page-sections.service";
import { asSection } from "@/server/modules/page-sections/section-content";
import {
  aboutApproachFallback,
  aboutHeroFallback,
  aboutPhilosophyFallback,
  aboutStoryFallback,
  aboutTeamPreviewFallback,
} from "@/lib/page-fallbacks/about";

import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About | Meghduth Design Studio",
  description:
    "Learn about Meghduth Design Studio, our philosophy, our approach, and the people behind our timeless interior and architectural designs.",
  openGraph: {
    title: "About | Meghduth Design Studio",
    description: "Learn about Meghduth Design Studio's philosophy, approach, and team.",
    type: "website",
    locale: "en_BD",
    url: "/about",
    siteName: "Meghduth Design Studio",
    images: [
      {
        url: "/images/about/about-hero.webp",
        width: 1200,
        height: 630,
        alt: "Meghduth Design Studio Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Meghduth Design Studio",
    description: "Learn about Meghduth Design Studio's philosophy, approach, and team.",
    images: ["/images/about/about-hero.webp"],
  },
};

// ফলব্যাক — DB-সারি থাকলে getCachedSectionData জেতে (নিচে)। আসল পাঠ lib/page-fallbacks/about.ts-এ।
const hero = aboutHeroFallback;

const story = aboutStoryFallback;

const philosophy = aboutPhilosophyFallback;

const approach = aboutApproachFallback;

const teamPreview = aboutTeamPreviewFallback;

// মালিক: About ট্যাব — about.hero/story/philosophy/approach/teamPreview।
// সারি না থাকলে নিচের কোড-ফলব্যাকই দেখায়, তাই প্রথম দিনেও পেজ হুবহু একই থাকে।
export default async function AboutPage() {
  let heroData = hero;
  let storyData = story;
  let philosophyData = philosophy;
  let approachData = approach;
  let teamPreviewData = teamPreview;
  try {
    const [heroSec, storySec, philosophySec, approachSec, teamPreviewSec] =
      await Promise.all([
        getCachedSectionData("about", "hero"),
        getCachedSectionData("about", "story"),
        getCachedSectionData("about", "philosophy"),
        getCachedSectionData("about", "approach"),
        getCachedSectionData("about", "teamPreview"),
      ]);
    heroData = asSection(heroSec, hero);
    storyData = asSection(storySec, story);
    philosophyData = asSection(philosophySec, philosophy);
    approachData = asSection(approachSec, approach);
    teamPreviewData = asSection(teamPreviewSec, teamPreview);
  } catch {
    // DB ডাউন — ফলব্যাকেই রেন্ডার হয়।
  }
  return (
    <main>
      <PageHero data={heroData} />

      <Story data={storyData} />

      <Philosophy data={philosophyData} />

      <Approach data={approachData} />

      <TeamPreview data={teamPreviewData} />

      <CTA />
    </main>
  );
}
