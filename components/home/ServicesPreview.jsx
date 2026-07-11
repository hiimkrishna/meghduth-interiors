import Container from "@/components/ui/Container";
import { ArrowUpRight } from "lucide-react";

const SERVICES = [
  {
    id: "01",
    title: "Residential Interior Design",
    description:
      "Creating elegant homes that reflect your personality, lifestyle, and comfort.",
  },
  {
    id: "02",
    title: "Commercial Interior Design",
    description: "Designing inspiring workspaces and commercial environments.",
  },
  {
    id: "03",
    title: "Renovation & Remodeling",
    description:
      "Transforming existing spaces with thoughtful planning and execution.",
  },
  {
    id: "04",
    title: "Space Planning",
    description:
      "Optimizing layouts to balance beauty, movement, and functionality.",
  },
];

const ServicesPreview = () => {
  return (
    // Mobile Optimization: Tamed section padding (py-16 to py-24) to prevent excessive empty space
    <section className="bg-white py-16 sm:py-24 lg:py-32">
      <Container>
        {/* Header Block */}
        <div className="mb-10 sm:mb-16 max-w-2xl px-4 sm:px-0">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-2 sm:mb-3">
            Our Services
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl text-balance">
            Designed for the way you live and work.
          </h2>
        </div>

        {/* Services Interactive Rows */}
        <div className="divide-y divide-neutral-200 border-t border-neutral-200 px-4 sm:px-0">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col md:flex-row md:items-start justify-between py-6 sm:py-8 transition-colors duration-300 hover:bg-neutral-50/70 rounded-lg md:px-4 md:-mx-4"
            >
              {/* Left Column: Number, Title, and Mobile Arrow Icon */}
              <div className="flex items-start justify-between gap-4 w-full md:w-1/3">
                <div className="flex items-start gap-4 sm:gap-6">
                  <span className="text-xs sm:text-sm font-medium text-neutral-400 mt-1 select-none">
                    {service.id}
                  </span>
                  <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 pr-2">
                    {service.title}
                  </h3>
                </div>

                {/* Arrow Icon variant shown only on smaller viewports */}
                <div className="text-neutral-400 group-hover:text-neutral-900 transition-colors duration-200 md:hidden mt-1 flex-shrink-0">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              {/* Center Column: Description Content */}
              <div className="mt-2 md:mt-0 w-full md:w-1/2 md:pr-8 pl-8 md:pl-0">
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Right Column: Desktop-only Arrow Icon Layout */}
              <div className="hidden md:block text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200 self-center flex-shrink-0">
                <ArrowUpRight className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ServicesPreview;
