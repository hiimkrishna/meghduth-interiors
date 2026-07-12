import Image from "next/image";
import Link from "next/link";

const SplitSection = ({
  eyebrow,
  title,
  description,
  paragraphs = [],
  image,
  imageAlt = "Section image",
  reverse = false,
  button,
}) => {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
        reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Content */}
      <div className={`${reverse ? "lg:order-2" : "lg:order-1"}`}>
        {eyebrow && (
          <span className="text-sm uppercase tracking-[0.25em] text-neutral-500">
            {eyebrow}
          </span>
        )}

        <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-neutral-900">
          {title}
        </h2>

        {description && (
          <p className="mt-6 text-base md:text-lg leading-relaxed text-neutral-600">
            {description}
          </p>
        )}

        {paragraphs.length > 0 && (
          <div className="mt-6 space-y-4 text-base md:text-lg leading-relaxed text-neutral-600">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        {button && (
          <Link
            href={button.href}
            className="inline-flex mt-8 px-6 py-3 rounded-full bg-black text-white"
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
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  );
};

export default SplitSection;
