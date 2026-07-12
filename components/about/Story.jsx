import Container from "@/components/ui/Container";
import SplitSection from "@/components/common/SplitSection";

const Story = ({ data }) => {
  return (
    <section
      className="
        py-20

        sm:py-24

        lg:py-32
      "
    >
      <Container>
        <SplitSection
          eyebrow={data.eyebrow}
          title={data.title}
          description={data.description}
          paragraphs={data.paragraphs}
          image={data.image}
          imageAlt={data.imageAlt}
          button={data.button}
          reverse={data.reverse}
        />
      </Container>
    </section>
  );
};

export default Story;
