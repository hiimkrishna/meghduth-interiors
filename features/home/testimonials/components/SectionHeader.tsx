const SectionHeader = () => {
  return (
    <div className="mx-auto mb-16 max-w-3xl text-center">
      <p
        className="
          mb-5
          text-sm
          uppercase
          tracking-[0.35em]
          text-[#B79A6A]
        "
      >
        Testimonials
      </p>

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
        What Our Clients
        <br />
        Say About Us
      </h2>

      <p
        className="
          mx-auto
          mt-6
          max-w-2xl

          text-base
          leading-8
          text-neutral-400

          sm:text-lg
        "
      >
        Every project is a collaboration between our vision and our clients&apos;
        dreams. Discover the experiences of those who trusted Meghduth to
        transform their spaces.
      </p>
    </div>
  );
};

export default SectionHeader;
