import aboutData from "@/data/aboutData";

import PageHero from "@/components/common/PageHero";

import Story from "@/components/about/Story";
import Philosophy from "@/components/about/Philosophy";
import Approach from "@/components/about/Approach";
import TeamPreview from "@/components/about/TeamPreview";

import CTA from "@/components/home/cta/CTA";

export const metadata = {
  title: "About | Meghdut Design Studio",

  description:
    "Learn about Meghdut Design Studio, our philosophy, our approach, and the people behind our timeless interior and architectural designs.",
};

export default function AboutPage() {
  return (
    <main>
      <PageHero data={aboutData.hero} />

      <Story data={aboutData.story} />

      <Philosophy data={aboutData.philosophy} />

      <Approach data={aboutData.approach} />

      <TeamPreview data={aboutData.teamPreview} />

      <CTA />
    </main>
  );
}
