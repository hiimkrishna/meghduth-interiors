import PageHero from "@/components/common/PageHero";
import TeamMembers from "@/components/team/TeamMembers";
import JoinTeam from "@/components/team/JoinTeam";

import CTA from "@/components/home/cta/CTA";

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

// স্থির পেজ কনটেন্ট — API নেই, আপাতত পেজেই (TODO(M4: এপিআই এলে হুক-পথে নাও))।
// সদস্য তালিকা হুক দিয়ে আসে (useTeam)।
const hero = {
  image: "/images/hero/hero2.jpeg",
  breadcrumb: [{ label: "Home", href: "/" }, { label: "Team" }],
  eyebrow: "OUR TEAM",
  title: "The Creative Minds Behind Every Space.",
  description:
    "Meet the architects, designers, and creative professionals who transform ideas into timeless spaces with passion, precision, and purpose.",
};

const intro = {
  eyebrow: "MEET THE TEAM",
  title: "Designing Together, Creating Excellence.",
  description:
    "Every successful project is the result of collaboration, creativity, and a shared commitment to exceptional design.",
};

const join = {
  eyebrow: "WORK WITH US",
  title: "Let's Create Something Exceptional Together.",
  description:
    "Whether you're planning your dream home, a commercial space, or a complete renovation, our team is ready to bring your vision to life.",
  image: "/images/why-meghdut.jpeg",
  imageAlt: "Meghduth Design Studio",
  button: { label: "Contact Us", href: "/contact" },
  reverse: true,
};

export default function TeamPage() {
  return (
    <main>
      <PageHero data={hero} />

      <TeamMembers intro={intro} />

      <JoinTeam data={join} />

      <CTA />
    </main>
  );
}
