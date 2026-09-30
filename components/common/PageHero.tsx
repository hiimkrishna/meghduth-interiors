import Image from "next/image";
import { resolveImageSrc } from "@/lib/image-url";

import Container from "@/components/ui/Container";

import Breadcrumb from "./Breadcrumb";

interface PageHeroBreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroData {
  image: string;
  breadcrumb: PageHeroBreadcrumbItem[];
  eyebrow: string;
  title: string;
  description: string;
}

interface PageHeroProps {
  data: PageHeroData;
}

const PageHero = ({ data }: PageHeroProps) => {
  const { image, breadcrumb, eyebrow, title, description } = data;

  return (
    <section
      className="
        relative
        isolate

        flex
        min-h-[60vh]

        items-end

        overflow-hidden

        pt-28

        sm:min-h-[65vh]

        lg:min-h-[70vh]
      "
    >
      {/* Background Image — DB key হলে /uploads/ URL-এ রূপ নেয় */}

      {resolveImageSrc(image) !== undefined ? (
        <Image
          src={resolveImageSrc(image) as string}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="
          object-cover
        "
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#232628] via-[#17191B] to-[#0c0d0e]"
        />
      )}

      {/* Overlay */}

      <div
        className="
          absolute
          inset-0

          bg-gradient-to-b
          from-black/60
          via-black/55
          to-[#111315]
        "
      />

      {/* Decorative Glow */}

      <div
        className="
          absolute

          left-1/2
          top-0

          h-[500px]
          w-[500px]

          -translate-x-1/2

          rounded-full

          bg-[#B79A6A]/10

          blur-[140px]
        "
      />

      {/* Content */}

      <Container className="relative z-10 pb-16 sm:pb-20 lg:pb-24">
        <div
          className="
            flex
            max-w-4xl
            flex-col
            gap-8
          "
        >
          <Breadcrumb items={breadcrumb} />

          {/* শিরোনাম — পেজে একটাই h1 (SectionHeader h2 রেন্ডার করে, তাই এখানে ইনলাইন)। */}
          <div
            className="
              mx-auto
              flex
              max-w-none
              flex-col
              items-start
              text-left
            "
          >
            {eyebrow !== "" && (
              <span
                className="
                  mb-4

                  text-xs
                  font-medium

                  uppercase
                  tracking-[0.35em]

                  text-[#B79A6A]
                "
              >
                {eyebrow}
              </span>
            )}

            <h1
              className="
                font-[family:var(--font-heading)]

                text-4xl
                font-semibold

                leading-tight
                text-white

                sm:text-5xl

                lg:text-6xl
              "
            >
              {title}
            </h1>

            {description !== "" && (
              <p
                className="
                  mt-6

                  text-base
                  leading-8

                  text-neutral-400

                  sm:text-lg
                "
              >
                {description}
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PageHero;
