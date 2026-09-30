import PageHero from "@/components/common/PageHero";
import TeamMembers from "@/components/team/TeamMembers";
import JoinTeam from "@/components/team/JoinTeam";

import CTA from "@/components/home/cta/CTA";

import { getCachedSectionData } from "@/server/modules/page-sections/page-sections.service";
import { asSection } from "@/server/modules/page-sections/section-content";
import {
  teamHeroFallback,
  teamIntroFallback,
  teamJoinFallback,
} from "@/lib/page-fallbacks/team";

import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Our Team | Meghduth Design Studio",
  description:
    "Meet the architects, interior designers, and creative professionals behind Meghduth Design Studio, dedicated to crafting timeless residential and commercial spaces.",
  openGraph: {
    title: "Our Team | Meghduth Design Studio",
    description: "Meet the architects, interior designers, and creative professionals behind Meghduth Design Studio.",
    type: "website",
    locale: "en_BD",
    url: "/team",
    siteName: "Meghduth Design Studio",
    images: [
      {
        url: "/images/hero/hero2.jpeg",
        width: 1200,
        height: 630,
        alt: "Meghduth Design Studio Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Team | Meghduth Design Studio",
    description: "Meet the architects, interior designers, and creative professionals behind Meghduth Design Studio.",
    images: ["/images/hero/hero2.jpeg"],
  },
};

// ফলব্যাক — DB-সারি থাকলে getCachedSectionData জেতে (নিচে)। আসল পাঠ lib/page-fallbacks/team.ts-এ।
// সদস্য তালিকা হুক দিয়ে আসে (useTeam)।
const hero = teamHeroFallback;

const intro = teamIntroFallback;

const join = teamJoinFallback;

// মালিক: Team ট্যাব — team.hero/intro/join।
export default async function TeamPage() {
  let heroData = hero;
  let introData = intro;
  let joinData = join;
  try {
    const [heroSec, introSec, joinSec] = await Promise.all([
      getCachedSectionData("team", "hero"),
      getCachedSectionData("team", "intro"),
      getCachedSectionData("team", "join"),
    ]);
    heroData = asSection(heroSec, hero);
    introData = asSection(introSec, intro);
    joinData = asSection(joinSec, join);
  } catch {
    // DB ডাউন — ফলব্যাকেই রেন্ডার হয়।
  }
  return (
    <main>
      <PageHero data={heroData} />

      <TeamMembers intro={introData} />

      <JoinTeam data={joinData} />

      <CTA />
    </main>
  );
}
