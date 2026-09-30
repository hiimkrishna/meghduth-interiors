import type * as React from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { getCachedSiteSettings } from "@/server/modules/site-settings/site-settings.service";
import enMessages from "@/messages/en.json";

// পাবলিক সাইটের খোলস — শুধু (site) গ্রুপের পেজে Navbar/Footer থাকে।
// অ্যাডমিন (app/admin) এই লেআউট পায় না, তাই কখনো সংঘর্ষ হয় না।
// v1: default locale (en), no URL prefix. v2 activates /[locale] routing;
// Navbar/Footer already accept messages+locale for that switch.
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  let whatsappHref: string | null = null;

  try {
    const settings = await getCachedSiteSettings();
    const digits = (settings.phone ?? "").replace(/\D/g, "");
    if (digits !== "") whatsappHref = "https://wa.me/" + digits;
  } catch {
    // DB ডাউন থাকলেও লেআউট ভাঙে না — বাটন ছাড়াই রেন্ডার হয়।
  }

  const messages = enMessages as unknown as Record<string, any>;

  return (
    <>
      <Navbar messages={messages} locale="en" />
      {children}
      <Footer messages={messages} locale="en" />
      {whatsappHref !== null && <WhatsAppButton href={whatsappHref} />}
    </>
  );
}
