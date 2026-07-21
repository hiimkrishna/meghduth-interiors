import servicesPageData from "@/data/servicesPageData";

import PageHero from "@/components/common/PageHero";
import ServicesList from "@/components/services/ServiceList";
import ProcessPreview from "@/components/services/ProcessPreview";

import CTA from "@/components/home/cta/CTA";

export const metadata = {
  title: "Services | Meghdut Design Studio",

  description:
    "Explore Meghdut Design Studio's residential, commercial, renovation, and space planning services.",
};

export default function ServicesPage() {
  return (
    <main>
      <PageHero data={servicesPageData.hero} />

      <ServicesList data={servicesPageData} />

      <ProcessPreview data={servicesPageData.process} />

      <CTA />
    </main>
  );
}