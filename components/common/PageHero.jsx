import Image from "next/image";

import Container from "@/components/ui/Container";

import Breadcrumb from "./Breadcrumb";
import SectionHeader from "./SectionHeader";

const PageHero = ({ data }) => {
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
      {/* Background Image */}

      <Image
        src={image}
        alt={title}
        fill
        priority
        sizes="100vw"
        className="
          object-cover
        "
      />

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

          <SectionHeader
            align="left"
            eyebrow={eyebrow}
            title={title}
            description={description}
            maxWidth="max-w-none"
          />
        </div>
      </Container>
    </section>
  );
};

export default PageHero;
