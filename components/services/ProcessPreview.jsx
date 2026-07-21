import Container from "@/components/ui/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Card from "@/components/common/Card";

import { MessageCircle, LayoutGrid, PencilRuler, Hammer } from "lucide-react";

const icons = {
  MessageCircle,
  LayoutGrid,
  PencilRuler,
  Hammer,
};

const ProcessPreview = ({ data }) => {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow={data.eyebrow}
          title={data.title}
          description={data.description}
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {data.steps.map((step) => {
            const Icon = icons[step.icon];

            return (
              <Card key={step.number}>
                <span className="text-5xl font-bold text-[#B79A6A]">
                  {step.number}
                </span>

                {Icon && (
                  <Icon
                    size={34}
                    strokeWidth={1.5}
                    className="mt-6 text-[#B79A6A]"
                  />
                )}

                <h3 className="mt-6 text-2xl font-semibold text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-xs uppercase tracking-[0.3em] text-[#B79A6A]">
                  {step.highlight}
                </p>

                <p className="mt-5 leading-8 text-neutral-400">
                  {step.description}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default ProcessPreview;
