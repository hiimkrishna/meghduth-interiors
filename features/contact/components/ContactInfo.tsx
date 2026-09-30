import { MapPin, Phone, Mail, Clock3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Container from "@/components/ui/Container";
import CommonSectionHeader from "@/components/common/SectionHeader";
import Card from "@/components/common/Card";

const icons: Record<string, LucideIcon> = {
  MapPin,
  Phone,
  Mail,
  Clock3,
};

export interface ContactDetail {
  icon: string;
  title: string;
  value: string;
}

export interface ContactInfoData {
  eyebrow?: string;
  title: string;
  description?: string;
  details: ContactDetail[];
}

interface ContactInfoProps {
  data: ContactInfoData;
}

const ContactInfo = ({ data }: ContactInfoProps) => {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <Container>
        <CommonSectionHeader
          eyebrow={data.eyebrow}
          title={data.title}
          description={data.description}
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {data.details.map((item) => {
            const Icon = icons[item.icon];

            return (
              <Card key={item.title}>
                {Icon && (
                  <Icon
                    size={34}
                    strokeWidth={1.5}
                    className="text-[#B79A6A]"
                  />
                )}

                <h3 className="mt-6 text-xl font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-neutral-400">{item.value}</p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default ContactInfo;
