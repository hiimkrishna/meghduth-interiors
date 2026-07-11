export default function SectionHeading({
  badge,
  title,
  description,
  align = "center",
}) {
  return (
    <div
      className={`max-w-3xl ${
        align === "center" ? "mx-auto text-center" : "text-left"
      }`}
    >
      <span className="text-sm uppercase tracking-[0.35em] text-[#B79A6A]">
        {badge}
      </span>

      <h2 className="mt-5 text-4xl font-semibold leading-tight text-white md:text-5xl">
        {title}
      </h2>

      <p className="mt-6 text-lg leading-8 text-zinc-400">{description}</p>
    </div>
  );
}
