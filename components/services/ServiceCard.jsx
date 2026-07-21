import Card from "@/components/common/Card";
import Image from "next/image";

const ServiceCard = ({ service }) => {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="relative h-64">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-8">
        <span className="text-[#B79A6A] text-sm tracking-[0.25em] uppercase">
          {service.id}
        </span>

        <h3 className="mt-4 text-2xl font-semibold text-white">
          {service.title}
        </h3>

        <p className="mt-4 leading-8 text-neutral-400">{service.description}</p>
      </div>
    </Card>
  );
};

export default ServiceCard;
