import teamPageData from "@/data/teamPageData";

import PageHero from "@/components/common/PageHero";
import TeamMembers from "@/components/team/TeamMembers";
import JoinTeam from "@/components/team/JoinTeam";

import CTA from "@/components/home/cta/CTA";

export const metadata = {
  title: "Our Team | Meghdut Design Studio",

  description:
    "Meet the architects, interior designers, and creative professionals behind Meghdut Design Studio, dedicated to crafting timeless residential and commercial spaces.",
};

export default function TeamPage() {
  return (
    <main>
      <PageHero data={teamPageData.hero} />

      <TeamMembers data={teamPageData} />

      <JoinTeam data={teamPageData.join} />

      <CTA />
    </main>
  );
}