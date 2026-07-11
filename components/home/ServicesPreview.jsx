import Container from "@/components/ui/Container";
import { ArrowUpRight } from "lucide-react"; // Optional: Using lucide-react for the arrow

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
    <section className="bg-white py-24 lg:py-32">
      <Container>
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-3">
            Our Services
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            Designed for the way you live and work.
          </h2>
        </div>

        {/* Services List */}
        <div className="divide-y divide-neutral-200 border-t border-neutral-200">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col md:flex-row md:items-start justify-between py-8 transition-colors duration-300 hover:bg-neutral-50/50 px-4 -mx-4 rounded-lg"
            >
              {/* Number and Title */}
              <div className="flex items-start gap-6 md:w-1/3">
                <span className="text-sm font-medium text-neutral-400 mt-1">
                  {service.id}
                </span>
                <h3 className="text-xl font-semibold text-neutral-900">
                  {service.title}
                </h3>
              </div>

              {/* Description */}
              <div className="mt-2 md:mt-0 md:w-1/2 pr-8">
                <p className="text-base text-neutral-600 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Arrow */}
              <div className="mt-4 md:mt-0 self-end md:self-center text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200">
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
