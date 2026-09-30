import PageHero from "@/components/common/PageHero";
import ServicesList from "@/components/services/ServiceList";
import ProcessPreview from "@/components/services/ProcessPreview";

import CTA from "@/components/home/cta/CTA";

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

// স্থির পেজ কনটেন্ট — API নেই, আপাতত পেজেই (TODO(M4: এপিআই এলে হুক-পথে নাও))।
// সেবা তালিকা হুক দিয়ে আসে (useServices)।
const hero = {
  image: "/images/hero/hero1.jpeg",
  breadcrumb: [{ label: "Home", href: "/" }, { label: "Services" }],
  eyebrow: "OUR SERVICES",
  title: "Design Solutions Tailored To Every Space.",
  description:
    "From elegant residences to sophisticated commercial environments, Meghduth Design Studio delivers thoughtful interior and architectural solutions designed around your lifestyle and vision.",
};

const intro = {
  eyebrow: "WHAT WE OFFER",
  title: "Comprehensive Interior Design Services.",
  description:
    "We combine creativity, functionality, and craftsmanship to deliver spaces that are timeless, practical, and uniquely yours.",
};

const process = {
  eyebrow: "OUR PROCESS",
  title: "From Vision To Reality.",
  description:
    "Every project follows a carefully structured process that keeps communication transparent while ensuring exceptional design and flawless execution.",
  steps: [
    {
      number: "01",
      icon: "MessageCircle",
      title: "Consultation & Discovery",
      description:
        "We begin with an in-depth consultation to understand your lifestyle, functional needs, aesthetic preferences, budget, and timeline.",
      highlight: "Understanding your vision.",
    },
    {
      number: "02",
      icon: "LayoutGrid",
      title: "Concept & Space Planning",
      description:
        "Our designers create layouts, mood boards, furniture arrangements, and material palettes to shape the overall direction of your project.",
      highlight: "Turning ideas into concepts.",
    },
    {
      number: "03",
      icon: "PencilRuler",
      title: "Design Development",
      description:
        "Detailed drawings, lighting plans, finishes, furniture selections, and technical specifications are finalized before implementation.",
      highlight: "Every detail carefully refined.",
    },
    {
      number: "04",
      icon: "Hammer",
      title: "Execution & Delivery",
      description:
        "We oversee construction, coordinate contractors, monitor quality, and ensure every finishing touch meets our standards before handover.",
      highlight: "Delivered with precision.",
    },
  ],
};

export default function ServicesPage() {
  return (
    <main>
      <PageHero data={hero} />

      <ServicesList intro={intro} />

      <ProcessPreview data={process} />

      <CTA />
    </main>
  );
}
