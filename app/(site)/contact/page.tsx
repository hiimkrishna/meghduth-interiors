import PageHero from "@/components/common/PageHero";

import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import StudioLocation from "@/components/contact/StudioLocation";

import { getCachedSectionData } from "@/server/modules/page-sections/page-sections.service";
import { asSection } from "@/server/modules/page-sections/section-content";
import {
  contactHeroFallback,
  contactInfoFallback,
  contactLocationFallback,
} from "@/lib/page-fallbacks/contact";

import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact | Meghduth Design Studio",
  description:
    "Get in touch with Meghduth Design Studio to discuss your residential or commercial interior design project.",
  openGraph: {
    title: "Contact | Meghduth Design Studio",
    description: "Get in touch with Meghduth Design Studio to discuss your interior design project.",
    type: "website",
    locale: "en_BD",
    url: "/contact",
    siteName: "Meghduth Design Studio",
    images: [
      {
        url: "/images/hero/hero1.jpeg",
        width: 1200,
        height: 630,
        alt: "Meghduth Design Studio Contact",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Meghduth Design Studio",
    description: "Get in touch with Meghduth Design Studio to discuss your interior design project.",
    images: ["/images/hero/hero1.jpeg"],
  },
};

// ফলব্যাক — DB-সারি থাকলে getCachedSectionData জেতে (নিচে)। আসল পাঠ lib/page-fallbacks/contact.ts-এ।
const hero = contactHeroFallback;

const info = contactInfoFallback;

const location = contactLocationFallback;

// মালিক: Contact ট্যাব — contact.hero/info/location।
// সারি না থাকলে নিচের কোড-ফলব্যাকই দেখায়, তাই প্রথম দিনেও পেজ হুবহু একই থাকে।
export default async function ContactPage() {
  let heroData = hero;
  let infoData = info;
  let locationData = location;
  try {
    const [heroSec, infoSec, locationSec] = await Promise.all([
      getCachedSectionData("contact", "hero"),
      getCachedSectionData("contact", "info"),
      getCachedSectionData("contact", "location"),
    ]);
    heroData = asSection(heroSec, hero);
    infoData = asSection(infoSec, info);
    locationData = asSection(locationSec, location);
  } catch {
    // DB ডাউন — ফলব্যাকেই রেন্ডার হয়।
  }
  return (
    <main>
      <PageHero data={heroData} />

      <ContactInfo data={infoData} />

      <ContactForm />

      <StudioLocation data={locationData} />
    </main>
  );
}
