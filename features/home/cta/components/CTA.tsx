"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { resolveImageSrc } from "@/lib/image-url";
import { useCta } from "../hooks/use-cta";

const CTA = () => {
  const { cta, loading, error, retry } = useCta();

  // লোডিং অবস্থা — কঙ্কাল (বাইরের কাঠামো হুবহু)।
  if (loading) {
    return (
      <section
        className="
        relative
        overflow-hidden

        py-24

        lg:py-32
      "
      >
        <Container>
          <div
            className="
            relative
            z-10

            mx-auto

            max-w-4xl

            text-center
          "
          >
            <Skeleton className="mx-auto h-10 max-w-2xl sm:h-14" />
            <Skeleton className="mx-auto mt-6 h-5 max-w-xl" />
            <Skeleton className="mx-auto mt-10 h-12 w-48 rounded-full" />
          </div>
        </Container>
      </section>
    );
  }

  // ত্রুটি অবস্থা — বাংলা বার্তা + পুনঃচেষ্টা।
  if (error !== null) {
    return (
      <section
        className="
        relative
        overflow-hidden

        py-24

        lg:py-32
      "
      >
        <Container>
          <div
            className="
            relative
            z-10

            mx-auto

            max-w-4xl

            text-center
          "
          >
            <p className="text-base leading-8 text-neutral-300">
              Failed to load: {error}
            </p>
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={retry}
                className="rounded-full border border-white/20 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:border-[#B79A6A] hover:text-[#B79A6A]"
              >
                Try again
              </button>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  // শূন্য অবস্থা।
  if (cta === null) {
    return (
      <section
        className="
        relative
        overflow-hidden

        py-24

        lg:py-32
      "
      >
        <Container>
          <div
            className="
            relative
            z-10

            mx-auto

            max-w-4xl

            text-center
          "
          >
          <p className="text-base leading-8 text-neutral-300">
            No content available.
          </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      className="
        relative
        overflow-hidden

        py-24

        lg:py-32
      "
    >
      {/* Background Image — DB key হলে /uploads/ URL-এ রূপ নেয় */}

      <Image
        src={resolveImageSrc(cta.background) ?? "/images/cta/cta-bg.webp"}
        alt="Luxury interior"
        fill
        sizes="100vw"
        loading="lazy"
        className="
          object-cover
        "
      />

      {/* Dark Overlay */}

      <div
        className="
          absolute
          inset-0
          bg-black/60
        "
      />

      {/* Gold Ambient Glow */}

      <div
        className="
          absolute
          left-1/2
          top-1/2

          h-[500px]
          w-[500px]

          -translate-x-1/2
          -translate-y-1/2

          rounded-full

          bg-[#B79A6A]/10

          blur-3xl
        "
      />

      {/* Content */}

      <Container>
        <div
          className="
            relative
            z-10

            mx-auto

            max-w-4xl

            text-center
          "
        >
          {/* Badge */}

          <p
            className="
              mb-6

              text-sm
              uppercase
              tracking-[0.35em]

              text-[#B79A6A]
            "
          >
            {cta.badge}
          </p>

          {/* Heading */}

          <h2
            className="
              text-4xl
              font-light
              leading-tight
              text-white

              sm:text-5xl

              lg:text-6xl
            "
          >
            {cta.title}
          </h2>

          {/* Description */}

          <p
            className="
              mx-auto
              mt-6

              max-w-2xl

              text-base
              leading-8

              text-neutral-300

              sm:text-lg
            "
          >
            {cta.description}
          </p>

          {/* Button */}

          <div
            className="
              mt-10
              flex
              justify-center
            "
          >
            <Button>{cta.buttonText}</Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTA;
