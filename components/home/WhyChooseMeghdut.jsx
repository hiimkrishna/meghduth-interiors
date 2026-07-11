import Image from "next/image";
import Container from "@/components/ui/Container";

const VALUES = [
  {
    id: "01",
    title: "Personalized Design",
    description:
      "Every space begins with understanding your lifestyle, preferences, and vision.",
  },
  {
    id: "02",
    title: "Premium Materials",
    description:
      "We select high-quality materials that bring elegance and durability together.",
  },
  {
    id: "03",
    title: "Expert Execution",
    description:
      "Our team ensures flawless execution from concept to final installation.",
  },
];

const WhyChooseMeghdut = () => {
  return (
    <section className="bg-[#F7F5F0] py-24 lg:py-32">
      <Container>
        <div className="px-6 lg:px-0">
          {/* Header */}
          <div className="mb-16">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-500">
              Why Choose Meghdut
            </p>

            <h2 className="max-w-3xl text-4xl font-light leading-tight text-neutral-900 lg:text-6xl">
              We create spaces that
              <br />
              feel like home.
            </h2>
          </div>

          {/* Content */}
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="/images/why-meghdut.jpeg"
                alt="Luxury interior design"
                fill
                className="object-cover"
              />
            </div>

            {/* Values */}
            <div className="space-y-10">
              {VALUES.map((item) => (
                <div key={item.id} className="border-b border-neutral-300 pb-8">
                  <div className="flex gap-6">
                    <span className="text-sm text-neutral-500">{item.id}</span>

                    <div>
                      <h3 className="mb-3 text-2xl font-medium text-neutral-900">
                        {item.title}
                      </h3>

                      <p className="max-w-md leading-relaxed text-neutral-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WhyChooseMeghdut;
