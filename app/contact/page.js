import contactPageData from "@/data/contactPageData";

import PageHero from "@/components/common/PageHero";

import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import StudioLocation from "@/components/contact/StudioLocation";

export const metadata = {
  title: "Contact | Meghdut Design Studio",

  description:
    "Get in touch with Meghdut Design Studio to discuss your residential or commercial interior design project.",
};

export default function ContactPage() {
  return (
    <main>
      <PageHero data={contactPageData.hero} />

      <ContactInfo data={contactPageData.info} />

      <ContactForm />

      <StudioLocation data={contactPageData.location} />
    </main>
  );
}