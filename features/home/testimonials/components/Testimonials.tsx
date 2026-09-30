import Container from "@/components/ui/Container";
import SectionHeader from "./SectionHeader";
import Carousel from "./Carousel";
import { getCachedSectionData } from "@/server/modules/page-sections/page-sections.service";
import { asSection } from "@/server/modules/page-sections/section-content";
import { homeTestimonialsFallback } from "@/lib/page-fallbacks/home";

// মালিক: Homepage ট্যাব (home.testimonials) — শিরোনাম এখানে এডিট হয়।
const Testimonials = async () => {
  let header = homeTestimonialsFallback;
  try {
    header = asSection(await getCachedSectionData("home", "testimonials"), homeTestimonialsFallback);
  } catch {
    // DB ডাউন — ফলব্যাকেই রেন্ডার হয়।
  }
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
          <SectionHeader
            eyebrow={header.eyebrow}
            title={header.title}
            description={header.description}
          />

          <Carousel />
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
