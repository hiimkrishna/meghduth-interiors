import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/hero";
import FeaturedProjects from "@/components/home/featured-projects";
import WhyChooseMeghdut from "@/components/home/WhyChooseMeghdut";
import AboutMeghdut from "@/components/home/AboutMeghdut";
import ServicesPreview from "@/components/home/ServicesPreview"

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <FeaturedProjects />
        <WhyChooseMeghdut/>
        <AboutMeghdut/>
        <ServicesPreview/>
      </main>
    </>
  );
}