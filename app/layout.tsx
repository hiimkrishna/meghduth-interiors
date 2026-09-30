import { Cormorant_Garamond, Inter } from "next/font/google";
import type { Metadata } from "next";
import type * as React from "react";
import * as Sentry from "@sentry/nextjs";

import "./globals.css";

const headingFont = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim() || "https://meghduthdesign.com";

const SITE_TITLE =
  "Meghduth Design Studio | Luxury Architecture & Interiors in Bangladesh";

const SITE_DESCRIPTION =
  "Meghduth Design Studio is a luxury architecture and interior design studio in Bangladesh, crafting timeless homes, workplaces and hospitality spaces.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "Meghduth Design Studio",
    type: "website",
    images: [
      {
        url: "/images/hero/hero1.jpeg",
        width: 1200,
        height: 630,
        alt: "Luxury interior by Meghduth Design Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/hero/hero1.jpeg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${headingFont.variable} ${bodyFont.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-background text-text antialiased"
      >
        {children}
      </body>
    </html>
  );
}