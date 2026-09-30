import { contactCtaFallback } from "@/lib/page-fallbacks/contact";

export interface CtaData {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  background: string;
}

// কোড-ফলব্যাক — অ্যাডমিনে contact.cta সেভ না হওয়া পর্যন্ত এটাই দেখায়।
const ctaData: CtaData = contactCtaFallback;

export default ctaData;
