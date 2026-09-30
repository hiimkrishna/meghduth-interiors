import Container from "@/components/ui/Container";
import CommonSectionHeader from "@/components/common/SectionHeader";

export interface StudioLocationData {
  eyebrow?: string;
  title: string;
  description?: string;
  mapEmbed: string;
  address?: string;
}

interface StudioLocationProps {
  data: StudioLocationData;
}

const FALLBACK_ADDRESS = "Dhaka, Bangladesh";

const StudioLocation = ({ data }: StudioLocationProps) => {
  const address =
    data.address !== undefined && data.address.trim() !== ""
      ? data.address
      : FALLBACK_ADDRESS;
  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <section className="pb-20 lg:pb-32">
      <Container>
        <CommonSectionHeader
          eyebrow={data.eyebrow}
          title={data.title}
          description={data.description}
        />

        <div className="mt-16 overflow-hidden rounded-3xl border border-white/10">
          <iframe
            src={data.mapEmbed}
            title="Studio location map"
            width="100%"
            height="500"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-neutral-300 sm:text-base">{address}</p>
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#B79A6A] underline underline-offset-4 hover:text-[#c9ab7d]"
          >
            Get Directions
          </a>
        </div>
      </Container>
    </section>
  );
};

export default StudioLocation;
