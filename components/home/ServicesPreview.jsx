import Container from "@/components/ui/Container";
import services from "@/data/services";

const ServicesPreview = () => {
  return (
    // Mobile Optimization: Tamed section padding (py-16 to py-24) to prevent excessive empty space
    <section className="bg-white py-16 sm:py-24 lg:py-32">
      <Container>
        {/* Header Block */}
        <div className="mb-16">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-500">
            Our Services
          </p>

          <h2 className="max-w-3xl text-4xl font-light leading-tight text-neutral-900 lg:text-6xl">
            Designed for the way
            <br />
            you live and work.
          </h2>
        </div>

        {/* Services Interactive Rows */}
        <div className="divide-y divide-neutral-200">
          {services.map((service) => (
            <div
              key={service.id}
              className="group flex items-center justify-between py-10 transition-all duration-300"
            >
              {/* Left */}
              <div className="flex items-start gap-8">
                <span className="text-sm text-neutral-500">{service.id}</span>

                <div>
                  <h3 className="text-2xl font-medium text-neutral-900 transition-transform duration-300 group-hover:translate-x-2">
                    {service.title}
                  </h3>

                  <p className="mt-3 max-w-xl text-neutral-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Right */}
              <span className="text-3xl text-neutral-400 transition-all duration-300 group-hover:translate-x-2 group-hover:text-[#B79A6A]">
                →
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ServicesPreview;
