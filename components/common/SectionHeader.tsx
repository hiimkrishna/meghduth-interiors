interface SectionHeaderProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  align?: "left" | "center" | "right";
  maxWidth?: string;
}

const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "center",
  maxWidth = "max-w-3xl",
}: SectionHeaderProps) => {
  const alignment: Record<NonNullable<SectionHeaderProps["align"]>, string> = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  return (
    <div
      className={`
        flex
        flex-col
        ${alignment[align]}
        ${maxWidth}
        mx-auto
      `}
    >
      {eyebrow && (
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

      <h2
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
      </h2>

      {description && (
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
  );
};

export default SectionHeader;
