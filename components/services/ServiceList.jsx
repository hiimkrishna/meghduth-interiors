import Container from "@/components/ui/Container";
import SectionHeader from "@/components/common/SectionHeader";
import ServiceCard from "./ServiceCard";

const ServicesList = ({ data }) => {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow={data.intro.eyebrow}
          title={data.intro.title}
          description={data.intro.description}
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {data.services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ServicesList;
