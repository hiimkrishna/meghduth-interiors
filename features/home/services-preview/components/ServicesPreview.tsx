"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";
import { useServicesPreview } from "../hooks/use-services-preview";

const ServicesPreview = () => {
  const { services, loading, error, retry } = useServicesPreview();

  return (
    // Mobile Optimization: Tamed section padding (py-16 to py-24) to prevent excessive empty space
    <section className="bg-white py-16 sm:py-24 lg:py-32">
      <Container>
        {/* Header Block */}
        <div className="mb-16">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-500">
            Our Services
          </p>

          <h2 className="max-w-3xl text-4xl font-light leading-tight text-neutral-900 lg:text-6xl">
            Designed for the way
            <br />
            you live and work.
          </h2>
        </div>

        {/* লোডিং অবস্থা — কঙ্কাল */}
        {loading && (
          <div className="divide-y divide-neutral-200">
            {[0, 1, 2, 3].map((key) => (
              <div key={key} className="py-10">
                <Skeleton className="h-8 max-w-md bg-neutral-200" />
                <Skeleton className="mt-3 h-5 max-w-xl bg-neutral-200" />
              </div>
            ))}
          </div>
        )}
        {/* ত্রুটি অবস্থা — বাংলা বার্তা + পুনঃচেষ্টা */}
        {!loading && error !== null && (
          <div className="flex flex-col items-start gap-4">
            <p className="text-base text-neutral-600">
              Failed to load services: {error}
            </p>
            <button
              type="button"
              onClick={retry}
              className="rounded-full border border-neutral-900 px-6 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
            >
              Try again
            </button>
          </div>
        )}
        {/* শূন্য অবস্থা */}
        {!loading && error === null && services.length === 0 && (
          <p className="text-base text-neutral-600">No services found.</p>
        )}
        {/* Services Interactive Rows — প্রতিটি নিজের পেজে যায় */}
        {!loading && error === null && services.length > 0 && (
          <div className="divide-y divide-neutral-200">
            {services.map((service, index) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                aria-label={`Read more about ${service.title}`}
                className="group flex items-center justify-between py-10 transition-all duration-300"
              >
                {/* Left */}
                <div className="flex items-start gap-8">
                  <span className="text-sm text-neutral-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3 className="text-2xl font-medium text-neutral-900 transition-transform duration-300 group-hover:translate-x-2">
                      {service.title}
                    </h3>

                    <p className="mt-3 max-w-xl text-neutral-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <span className="text-3xl text-neutral-400 transition-all duration-300 group-hover:translate-x-2 group-hover:text-[#B79A6A]">
                  →
                </span>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default ServicesPreview;
