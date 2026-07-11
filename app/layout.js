import { Cormorant_Garamond, Inter } from "next/font/google";

import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer/Footer";


const headingFont = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: [
    "300",
    "400",
    "500",
    "600",
    "700",
  ],
});


const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});


export const metadata = {
  title: "Meghduth Designs",
  description:
    "Luxury Architecture & Interior Design Studio creating timeless spaces.",
};


export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable}`}
    >

      <body
        className="
          bg-background
          text-text
          antialiased
        "
      >

        <Navbar />

        {children}

        <Footer />

      </body>

    </html>
  );
}