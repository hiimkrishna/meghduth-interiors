import Image from "next/image";
import Link from "next/link";
import Card from "@/components/common/Card";
import { resolveImageSrc } from "@/lib/image-url";

// ServiceList (পেজ data: image) ও ভবিষ্যৎ API (ServiceItem: imageKey) — দুটোই চলে।
export interface ServiceCardItem {
  id: string | number;
  slug?: string;
  title: string;
  description: string;
  imageKey?: string;
  image?: string;
}

interface ServiceCardProps {
  service: ServiceCardItem;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  if (!service) return null;

  // ছবি না থাকলে খালি src-তে <Image> রেন্ডার নিষেধ (ব্রাউজার ওয়ার্নিং হয়) —
  // একই জায়গায় গ্রেডিয়েন্ট ফলব্যাক থাকে, লেআউট হুবহু থাকে।
  // DB-তে শুধু key থাকে — resolveImageSrc দেখানোর URL বানায় (খালি হলে ফলব্যাক)।
  const imageSrc: string | undefined = resolveImageSrc(service.imageKey ?? service.image);

  return (
    <Card className="p-0 overflow-hidden">
      <div className="relative h-64">
        {imageSrc !== undefined && imageSrc !== "" ? (
          <Image
            src={imageSrc}
            alt={service.title}
            fill
            className="object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-[#232628] via-[#17191B] to-[#0c0d0e]"
          />
        )}
      </div>

      <div className="p-8">
        <span className="text-[#B79A6A] text-sm tracking-[0.25em] uppercase">
          {service.id}
        </span>

        <h3 className="mt-4 text-2xl font-semibold text-white">
          {service.title}
        </h3>

        <p className="mt-4 leading-8 text-neutral-400">{service.description}</p>

        {service.slug !== undefined && service.slug !== "" && (
          <Link
            href={`/services/${service.slug}`}
            aria-label={`Read more about ${service.title}`}
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#B79A6A] transition-colors hover:text-[#c7ac7c]"
          >
            Learn more
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </Card>
  );
};

export default ServiceCard;
