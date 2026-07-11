import Hero from "@/components/home/hero";
import FeaturedProjects from "@/components/home/featured-projects";
import WhyChooseMeghdut from "@/components/home/WhyChooseMeghdut";
import AboutMeghdut from "@/components/home/AboutMeghdut";
import ServicesPreview from "@/components/home/ServicesPreview";
import Testimonials from "@/components/home/testimonials/Testimonials";
import CTA from "@/components/home/cta/CTA";


export default function Home() {
  return (
    <main>
      <Hero />

      <FeaturedProjects />

      <WhyChooseMeghdut />

      <AboutMeghdut />

      <ServicesPreview />

      <Testimonials />

      <CTA />
    </main>
  );
}