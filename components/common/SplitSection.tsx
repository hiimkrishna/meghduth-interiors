import Image from "next/image";
import Link from "next/link";
import { resolveImageSrc } from "@/lib/image-url";

interface SplitSectionButton {
  label: string;
  href: string;
}

interface SplitSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  paragraphs?: string[];
  image: string;
  imageAlt?: string;
  reverse?: boolean;
  button?: SplitSectionButton;
}

const SplitSection = ({
  eyebrow,
  title,
  description,
  paragraphs = [],
  image,
  imageAlt = "Section image",
  reverse = false,
  button,
}: SplitSectionProps) => {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
        reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Content */}
      <div className={`${reverse ? "lg:order-2" : "lg:order-1"}`}>
        {eyebrow && (
          <span className="text-sm uppercase tracking-[0.25em] text-[#B79A6A]">
            {eyebrow}
          </span>
        )}

        <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-6 text-base md:text-lg leading-relaxed text-neutral-400">
            {description}
          </p>
        )}

        {paragraphs.length > 0 && (
          <div className="mt-6 space-y-4 text-base md:text-lg leading-relaxed text-neutral-400">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        {button && (
          <Link
            href={button.href}
            className="inline-flex mt-8 px-6 py-3 rounded-full bg-[#B79A6A] text-neutral-950 text-sm font-medium transition-colors hover:bg-[#c7ac7c]"
          >
            {button.label}
          </Link>
        )}
      </div>

      {/* Image */}
      <div
        className={`relative h-[350px] md:h-[450px] overflow-hidden rounded-2xl ${
          reverse ? "lg:order-1" : "lg:order-2"
        }`}
      >
        {resolveImageSrc(image) !== undefined ? (
          <Image
            src={resolveImageSrc(image) as string}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-[#232628] via-[#17191B] to-[#0c0d0e]"
          />
        )}
      </div>
    </div>
  );
};

export default SplitSection;
