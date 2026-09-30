import Container from "@/components/ui/Container";
import SectionHeader from "./SectionHeader";
import Carousel from "./Carousel";

const Testimonials = () => {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#111315]

        py-24

        lg:py-32

        before:absolute
        before:inset-0
        before:bg-[radial-gradient(circle_at_center,rgba(183,154,106,0.08),transparent_45%)]
        before:pointer-events-none
      "
    >
      <Container>
        <div className="relative z-10">
          <SectionHeader />

          <Carousel />
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
