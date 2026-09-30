import Container from "@/components/ui/Container";
import SplitSection from "@/components/common/SplitSection";

export interface StoryData {
  eyebrow?: string;
  title: string;
  description?: string;
  paragraphs?: string[];
  image: string;
  imageAlt?: string;
  button?: { label: string; href: string };
  reverse?: boolean;
}

interface StoryProps {
  data: StoryData;
}

const Story = ({ data }: StoryProps) => {
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
