import PageHero from "@/components/common/PageHero";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import ProjectCTA from "@/components/projects/ProjectCTA";

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

// স্থির পেজ কনটেন্ট — API নেই, আপাতত পেজেই (TODO(M4: এপিআই এলে হুক-পথে নাও))।
// প্রজেক্ট তালিকা হুক দিয়ে আসে (useProjects)।
const hero = {
  image: "/images/projects/project-1.jpeg",
  breadcrumb: [{ label: "Home", href: "/" }, { label: "Projects" }],
  eyebrow: "OUR PROJECTS",
  title: "Spaces Designed To Inspire.",
  description:
    "Explore a curated collection of residential and commercial interiors that showcase Meghduth's commitment to timeless design, craftsmanship, and functionality.",
};

const intro = {
  eyebrow: "FEATURED WORK",
  title: "Every Project Tells A Story.",
  description:
    "From elegant homes to sophisticated commercial environments, every project reflects our passion for thoughtful design and meticulous execution.",
};

export default function ProjectsPage() {
  return (
    <main>
      <PageHero data={hero} />

      <ProjectsGrid intro={intro} />

      <ProjectCTA />
    </main>
  );
}
