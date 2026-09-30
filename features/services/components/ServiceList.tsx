"use client";

import Container from "@/components/ui/Container";
import CommonSectionHeader from "@/components/common/SectionHeader";
import Skeleton from "@/components/ui/Skeleton";
import { useServices } from "../hooks/use-services";
import ServiceCard from "./ServiceCard";

export interface ServicesListIntro {
  eyebrow?: string;
  title: string;
  description?: string;
}

interface ServicesListProps {
  intro: ServicesListIntro;
}

const ServicesList = ({ intro }: ServicesListProps) => {
  const { data: services, loading, error, retry } = useServices();

  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <Container>
        <CommonSectionHeader
          eyebrow={intro.eyebrow}
          title={intro.title}
          description={intro.description}
        />

        {/* লোডিং অবস্থা — কঙ্কাল */}
        {loading && (
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {[0, 1, 2, 3].map((key) => (
              <Skeleton key={key} className="h-80" />
            ))}
          </div>
        )}
        {/* ত্রুটি অবস্থা — বাংলা বার্তা + পুনঃচেষ্টা */}
        {!loading && error !== null && (
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <p className="text-base text-neutral-400">
              Failed to load services: {error}
            </p>
            <button
              type="button"
              onClick={retry}
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-[#B79A6A] hover:text-[#B79A6A]"
            >
              Try again
            </button>
          </div>
        )}
        {/* শূন্য অবস্থা */}
        {!loading && error === null && services.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-base text-neutral-400">No services found.</p>
          </div>
        )}
        {!loading && error === null && services.length > 0 && (
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default ServicesList;
