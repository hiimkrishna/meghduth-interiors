import Image from "next/image";
import { resolveImageSrc } from "@/lib/image-url";

interface ImageCardProps {
  image: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

const ImageCard = ({ image, alt, priority = false, className = "" }: ImageCardProps) => {
  return (
    <div
      className={`
        group
        relative
        overflow-hidden

        rounded-[2rem]

        bg-neutral-900

        ${className}
      `}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {resolveImageSrc(image) !== undefined ? (
          <Image
            src={resolveImageSrc(image) as string}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="
            object-cover
            transition-transform
            duration-700
            ease-out

            group-hover:scale-105
          "
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-[#232628] via-[#17191B] to-[#0c0d0e]"
          />
        )}
      </div>

      {/* Gradient */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          bg-linear-to-t

          from-black/25
          via-transparent
          to-transparent
        "
      />
    </div>
  );
};

export default ImageCard;
