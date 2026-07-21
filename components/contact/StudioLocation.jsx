import Container from "@/components/ui/Container";
import SectionHeader from "@/components/common/SectionHeader";

const StudioLocation = ({ data }) => {
  return (
    <section className="pb-20 lg:pb-32">
      <Container>
        <SectionHeader
          eyebrow={data.eyebrow}
          title={data.title}
          description={data.description}
        />

        <div className="mt-16 overflow-hidden rounded-3xl border border-white/10">
          <iframe
            src={data.mapEmbed}
            width="100%"
            height="500"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Container>
    </section>
  );
};

export default StudioLocation;
