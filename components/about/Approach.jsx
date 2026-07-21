import Container from "@/components/ui/Container";
import SectionHeader from "@/components/common/SectionHeader";
import SplitSection from "@/components/common/SplitSection";

const Approach = ({ data }) => {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow={data.eyebrow}
          title={data.title}
          description={data.description}
        />

        <div className="mt-20 space-y-24">
          {data.steps.map((step) => (
            <SplitSection
              key={step.number}
              eyebrow={`STEP ${step.number}`}
              title={step.title}
              description={step.description}
              image={step.image}
              imageAlt={step.imageAlt}
              reverse={step.reverse}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Approach;
