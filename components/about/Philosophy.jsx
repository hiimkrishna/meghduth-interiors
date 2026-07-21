import Container from "@/components/ui/Container";
import Card from "@/components/common/Card";
import SectionHeader from "@/components/common/SectionHeader";
import { Compass, Users, Diamond } from "lucide-react";

const icons = {
  Compass,
  Users,
  Diamond,
};

const Philosophy = ({ data }) => {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow={data.eyebrow}
          title={data.title}
          description={data.description}
        />

        {/* Philosophy Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.items.map((item) => {
            const Icon = icons[item.icon];

            return (
              <Card key={item.title}>
                {Icon && (
                  <Icon
                    size={36}
                    strokeWidth={1.5}
                    className="text-[#B79A6A]"
                  />
                )}

                <h3 className="mt-6 text-xl font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default Philosophy;
