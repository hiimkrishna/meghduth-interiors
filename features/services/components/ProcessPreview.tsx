import {
  MessageCircle,
  LayoutGrid,
  PencilRuler,
  Hammer,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Container from "@/components/ui/Container";
import CommonSectionHeader from "@/components/common/SectionHeader";
import Card from "@/components/common/Card";

const icons: Record<string, LucideIcon> = {
  MessageCircle,
  LayoutGrid,
  PencilRuler,
  Hammer,
};

export interface ProcessStep {
  number: string;
  icon: string;
  title: string;
  highlight?: string;
  description: string;
}

export interface ProcessPreviewData {
  eyebrow?: string;
  title: string;
  description?: string;
  steps: ProcessStep[];
}

interface ProcessPreviewProps {
  data: ProcessPreviewData;
}

const ProcessPreview = ({ data }: ProcessPreviewProps) => {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <Container>
        <CommonSectionHeader
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
