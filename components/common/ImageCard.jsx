import Image from "next/image";

const ImageCard = ({ image, alt, priority = false, className = "" }) => {
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
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width:1024px)100vw,50vw"
          className="
            object-cover
            transition-transform
            duration-700
            ease-out

            group-hover:scale-105
          "
        />
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
