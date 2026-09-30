import Image from "next/image";
import Container from "@/components/ui/Container";
import { getCachedSectionData } from "@/server/modules/page-sections/page-sections.service";
import { asList } from "@/server/modules/page-sections/section-content";
import { aboutStatsFallback } from "@/lib/page-fallbacks/about";

interface StatItem {
  number: string;
  label: string;
}

// কোড-ফলব্যাক — অ্যাডমিনে about.stats সেভ না হওয়া পর্যন্ত এটাই দেখায়।
const FALLBACK_STATS: StatItem[] = aboutStatsFallback.stats;

// মালিক: About ট্যাব (about.stats)। হোম শুধু পড়ে, এডিট About-এ।
const AboutMeghdut = async () => {
  let stats = FALLBACK_STATS;
  try {
    const data = await getCachedSectionData("about", "stats");
    if (data !== null) stats = asList<StatItem>(data.stats, FALLBACK_STATS);
  } catch {
    // DB ডাউন — ফলব্যাকেই রেন্ডার হয়।
  }
  return (
    <section className="bg-white py-16 sm:py-24 lg:py-32">
      <Container>
        {/* Fixed double horizontal padding conflict by relying on Container constraints */}
        <div className="px-4 sm:px-6 lg:px-0">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-24">
            {/* Image Layer - Re-ordered using order-last lg:order-first to sit beautifully on top of text fields on mobile */}
            <div className="relative order-first lg:order-last aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] overflow-hidden rounded-xl sm:rounded-2xl shadow-sm">
              <Image
                src="/images/about-meghdut.jpeg"
                alt="Minimal luxury living room layout designed by Meghduth"
                fill
                // Optimized image source scaling hints for mobile viewports
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                className="object-cover"
                loading="lazy" // Changed from priority since this section typically lives below the initial fold line
                quality={80}
              />
            </div>

            {/* Content Layer */}
            <div className="order-last lg:order-first">
              <p className="mb-3 sm:mb-5 text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-neutral-500">
                About Meghduth
              </p>

              <h2 className="text-3xl sm:text-4xl font-light leading-tight tracking-tight text-neutral-900 lg:text-6xl text-balance">
                Spaces designed with emotion, elegance, and purpose.
              </h2>

              <p className="mt-4 sm:mt-8 max-w-xl text-sm sm:text-base leading-relaxed text-neutral-600">
                Meghduth is an interior design studio dedicated to creating
                timeless spaces that blend functionality with refined
                aesthetics. We transform ideas into beautiful experiences.
              </p>

              {/* Stats Grid - Fixed mobile layout stacking constraints */}
              <div className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 border-t border-neutral-100 pt-8">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="col-span-1 last:col-span-2 sm:last:col-span-1"
                  >
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light text-neutral-900">
                      {stat.number}
                    </h3>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-neutral-500 max-w-[120px] sm:max-w-none">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mobile Accessible CTA Button */}
              <button
                type="button"
                className="mt-10 sm:mt-12 w-full sm:w-auto inline-flex justify-center items-center border border-neutral-900 px-8 py-3.5 text-sm font-medium tracking-wide text-neutral-900 transition duration-300 hover:bg-neutral-900 hover:text-white active:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
              >
                Discover More
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutMeghdut;
