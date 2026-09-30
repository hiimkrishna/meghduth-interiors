import type { Metadata } from "next";
import Hero from "@/components/home/hero";
import FeaturedProjects from "@/components/home/featured-projects";
import WhyChooseMeghdut from "@/components/home/WhyChooseMeghdut";
import AboutMeghdut from "@/components/home/AboutMeghdut";
import ServicesPreview from "@/components/home/ServicesPreview";
import Testimonials from "@/components/home/testimonials/Testimonials";
import CTA from "@/components/home/cta/CTA";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Meghduth Design Studio | Luxury Architecture & Interiors in Bangladesh",
  description:
    "Meghduth Design Studio is a luxury architecture and interior design studio in Bangladesh, crafting timeless homes, workplaces and hospitality spaces.",
  openGraph: {
    title: "Meghduth Design Studio | Luxury Architecture & Interiors",
    description: "Meghduth Design Studio creates timeless homes, workplaces and hospitality spaces in Bangladesh.",
    type: "website",
    locale: "en_BD",
    url: "/",
    siteName: "Meghduth Design Studio",
    images: [
      {
        url: "/images/hero/hero1.jpeg",
        width: 1200,
        height: 630,
        alt: "Meghduth Design Studio - Luxury Interior Design",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meghduth Design Studio",
    description: "Meghduth Design Studio creates timeless homes, workplaces and hospitality spaces in Bangladesh.",
    images: ["/images/hero/hero1.jpeg"],
  },
  alternates: {
    canonical: "/",
  },
};


export default function Home() {
  return (
    <main>
      <Hero />

      <FeaturedProjects />

      <WhyChooseMeghdut />

      <AboutMeghdut />

      <ServicesPreview />

      <Testimonials />

      <CTA />
    </main>
  );
}
