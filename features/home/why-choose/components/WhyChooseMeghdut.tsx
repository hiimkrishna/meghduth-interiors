import Image from "next/image";
import Container from "@/components/ui/Container";
import { getCachedSectionData } from "@/server/modules/page-sections/page-sections.service";
import { asList, asSection } from "@/server/modules/page-sections/section-content";
import { aboutWhyChooseFallback } from "@/lib/page-fallbacks/about";

interface ValueItem {
  id: string;
  title: string;
  description: string;
}

interface WhyChooseContent {
  eyebrow: string;
  title: string;
  values: ValueItem[];
}

// কোড-ফলব্যাক — অ্যাডমিনে about.whyChoose সেভ না হওয়া পর্যন্ত এটাই দেখায়।
const FALLBACK: WhyChooseContent = aboutWhyChooseFallback;

// মালিক: About ট্যাব (about.whyChoose)। হোম শুধু পড়ে, এডিট About-এ।
const WhyChooseMeghdut = async () => {
  let content = FALLBACK;
  try {
    const data = await getCachedSectionData("about", "whyChoose");
    const merged = asSection(data, FALLBACK);
    content = {
      ...merged,
      values: asList<ValueItem>(merged.values, FALLBACK.values),
    };
  } catch {
    // DB ডাউন — ফলব্যাকেই রেন্ডার হয়।
  }
  const { eyebrow, title, values } = content;
  return (
    // Mobile Optimization: Balanced section heights for smoother scrolling profiles
    <section className="bg-[#F7F5F0] py-16 sm:py-24 lg:py-32">
      <Container>
        {/* Adjusted padding wrapper to respect Container boundaries natively */}
        <div className="px-4 sm:px-6 lg:px-0">
          {/* Header Block */}
          <div className="mb-12 sm:mb-16">
            <p className="mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-neutral-500">
              {eyebrow}
            </p>

            {/* Mobile Optimization: Removed rigid <br /> tags in favor of responsive flow */}
            <h2 className="max-w-3xl text-3xl font-light leading-tight tracking-tight text-neutral-900 sm:text-4xl lg:text-6xl text-balance">
              {title}
            </h2>
          </div>

          {/* Core Content Grid */}
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            {/* Image Box: Dynamically scales down aspect ratio for mobile landscape frames */}
            <div className="relative aspect-[16/10] sm:aspect-[4/5] overflow-hidden rounded-xl sm:rounded-2xl shadow-sm">
              <Image
                src="/images/why-meghdut.jpeg"
                alt="Luxury architectural interior styling design showcase"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                className="object-cover"
                loading="lazy" // Optimized deferred loading for components below the landing screen fold
                quality={80}
              />
            </div>

            {/* Value Highlights List */}
            <div className="space-y-6 sm:space-y-10">
              {values.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-neutral-300 pb-6 sm:pb-8 last:border-none last:pb-0"
                >
                  <div className="flex gap-4 sm:gap-6 items-start">
                    <span className="text-xs sm:text-sm font-medium text-neutral-400 select-none mt-1">
                      {item.id}
                    </span>

                    <div className="w-full">
                      <h3 className="mb-2 text-xl sm:text-2xl font-medium text-neutral-900">
                        {item.title}
                      </h3>

                      <p className="text-sm sm:text-base leading-relaxed text-neutral-600 max-w-md">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WhyChooseMeghdut;
