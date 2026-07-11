import Image from "next/image";
import Container from "@/components/ui/Container";

const STATS = [
  {
    number: "15+",
    label: "Years Experience",
  },
  {
    number: "120+",
    label: "Completed Projects",
  },
  {
    number: "98%",
    label: "Client Satisfaction",
  },
];

const AboutMeghdut = () => {
  return (
    <section className="bg-white py-24 lg:py-32">
      <Container>
        <div className="px-6 lg:px-0">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
            {/* Content */}
            <div>
              <p className="mb-5 text-sm uppercase tracking-[0.3em] text-neutral-500">
                About Meghdut
              </p>

              <h2 className="text-4xl font-light leading-tight text-neutral-900 lg:text-6xl">
                Spaces designed with emotion, elegance, and purpose.
              </h2>

              <p className="mt-8 max-w-xl leading-relaxed text-neutral-600">
                Meghdut is an interior design studio dedicated to creating
                timeless spaces that blend functionality with refined
                aesthetics. We transform ideas into beautiful experiences.
              </p>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <h3 className="text-3xl font-light text-neutral-900 lg:text-4xl">
                      {stat.number}
                    </h3>

                    <p className="mt-2 text-sm text-neutral-500">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <button className="mt-12 border border-neutral-900 px-8 py-3 text-sm tracking-wide text-neutral-900 transition hover:bg-neutral-900 hover:text-white">
                Discover More
              </button>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="/images/about-meghdut.jpeg"
                alt="About Meghdut"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutMeghdut;
