import PageHero from "@/components/common/PageHero";
import ServicesList from "@/components/services/ServiceList";
import ProcessPreview from "@/components/services/ProcessPreview";

import CTA from "@/components/home/cta/CTA";

import { getCachedSectionData } from "@/server/modules/page-sections/page-sections.service";
import { asSection } from "@/server/modules/page-sections/section-content";
import {
  servicesHeroFallback,
  servicesIntroFallback,
  servicesProcessFallback,
} from "@/lib/page-fallbacks/services";

import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Services | Meghduth Design Studio",
  description:
    "Explore Meghduth Design Studio's residential, commercial, renovation, and space planning services.",
  openGraph: {
    title: "Services | Meghduth Design Studio",
    description: "Explore Meghduth Design Studio's residential, commercial, renovation, and space planning services.",
    type: "website",
    locale: "en_BD",
    url: "/services",
    siteName: "Meghduth Design Studio",
    images: [
      {
        url: "/images/hero/hero1.jpeg",
        width: 1200,
        height: 630,
        alt: "Meghduth Design Studio Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | Meghduth Design Studio",
    description: "Explore Meghduth Design Studio's residential, commercial, renovation, and space planning services.",
    images: ["/images/hero/hero1.jpeg"],
  },
};

// ফলব্যাক — DB-সারি থাকলে getCachedSectionData জেতে (নিচে)। আসল পাঠ lib/page-fallbacks/services.ts-এ।
// সেবা তালিকা হুক দিয়ে আসে (useServices)।
const hero = servicesHeroFallback;

const intro = servicesIntroFallback;

const process = servicesProcessFallback;

// মালিক: Services ট্যাব — services.hero/intro/process।
export default async function ServicesPage() {
  let heroData = hero;
  let introData = intro;
  let processData = process;
  try {
    const [heroSec, introSec, processSec] = await Promise.all([
      getCachedSectionData("services", "hero"),
      getCachedSectionData("services", "intro"),
      getCachedSectionData("services", "process"),
    ]);
    heroData = asSection(heroSec, hero);
    introData = asSection(introSec, intro);
    processData = asSection(processSec, process);
  } catch {
    // DB ডাউন — ফলব্যাকেই রেন্ডার হয়।
  }
  return (
    <main>
      <PageHero data={heroData} />

      <ServicesList intro={introData} />

      <ProcessPreview data={processData} />

      <CTA />
    </main>
  );
}
