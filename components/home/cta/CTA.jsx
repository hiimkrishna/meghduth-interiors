import Image from "next/image";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

import ctaData from "./ctaData";

const CTA = () => {
  return (
    <section
      className="
        relative
        overflow-hidden

        py-24

        lg:py-32
      "
    >
      {/* Background Image */}

      <Image
        src={ctaData.background}
        alt="Luxury interior"
        fill
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
            {ctaData.badge}
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
            {ctaData.title}
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
            {ctaData.description}
          </p>

          {/* Button */}

          <div
            className="
              mt-10
              flex
              justify-center
            "
          >
            <Button>{ctaData.buttonText}</Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTA;
