import Container from "@/components/ui/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Card from "@/components/common/Card";

import { MapPin, Phone, Mail, Clock3 } from "lucide-react";

const icons = {
  MapPin,
  Phone,
  Mail,
  Clock3,
};

const ContactInfo = ({ data }) => {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <Container>
        <SectionHeader
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
