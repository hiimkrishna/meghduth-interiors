import Container from "@/components/ui/Container";
import SplitSection from "@/components/common/SplitSection";

const TeamPreview = ({ data }) => {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <Container>
        <SplitSection
          eyebrow={data.eyebrow}
          title={data.title}
          description={data.description}
          image={data.image}
          imageAlt={data.imageAlt}
          button={data.button}
        />
      </Container>
    </section>
  );
};

export default TeamPreview;
