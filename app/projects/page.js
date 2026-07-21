import projectsPageData from "@/data/projectsPageData";

import PageHero from "@/components/common/PageHero";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import ProjectCTA from "@/components/projects/ProjectCTA";

export const metadata = {
  title: "Projects | Meghdut Design Studio",

  description:
    "Explore Meghdut Design Studio's portfolio of residential and commercial interior design projects.",
};

export default function ProjectsPage() {
  return (
    <main>
      <PageHero data={projectsPageData.hero} />

      <ProjectsGrid data={projectsPageData} />

      <ProjectCTA />
    </main>
  );
}