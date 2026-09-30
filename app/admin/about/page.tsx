// About ট্যাব — About পেজের সব সেকশন + হোম WhyChoose/Stats এক ঠিকানায়।
// হোম শুধু পড়ে (about.whyChoose, about.stats), এডিট এখানেই — কেন্দ্রীয় ডেটা।
"use client";

import type { ReactNode } from "react";
import SectionEditor from "@/features/admin/page-sections/SectionEditor";
import { AdminPageHeader } from "@/features/admin/shared/admin-ui";
import {
  aboutApproachFallback,
  aboutHeroFallback,
  aboutPhilosophyFallback,
  aboutStatsFallback,
  aboutStoryFallback,
  aboutTeamPreviewFallback,
  aboutWhyChooseFallback,
} from "@/lib/page-fallbacks/about";

export default function AdminAboutPage(): ReactNode {
  return (
    <>
      <AdminPageHeader
        title="About"
        subtitle="Every section of the About page — plus the Why Choose and Stats blocks shown on the homepage."
      />
      <div className="space-y-6">
        <SectionEditor
          page="about"
          section="hero"
          title="Page hero"
          hint="Top banner of /about."
          initial={aboutHeroFallback}
          fields={[
            { kind: "text", key: "eyebrow", label: "Eyebrow" },
            { kind: "text", key: "title", label: "Title" },
            { kind: "textarea", key: "description", label: "Description" },
            { kind: "text", key: "image", label: "Image path or key" },
          ]}
        />
        <SectionEditor
          page="about"
          section="story"
          title="Our story"
          hint="Story block on /about."
          initial={aboutStoryFallback}
          fields={[
            { kind: "text", key: "eyebrow", label: "Eyebrow" },
            { kind: "text", key: "title", label: "Title" },
            { kind: "textarea", key: "description", label: "Description" },
            { kind: "text", key: "image", label: "Image path or key" },
            { kind: "text", key: "imageAlt", label: "Image alt text" },
            {
              kind: "list",
              key: "paragraphs",
              label: "Paragraphs",
              addLabel: "Add paragraph",
              itemPrimitive: true,
              itemFields: [{ key: "text", label: "Paragraph", kind: "textarea" }],
            },
          ]}
        />
        <SectionEditor
          page="about"
          section="philosophy"
          title="Philosophy"
          hint="Value cards on /about."
          initial={aboutPhilosophyFallback}
          fields={[
            { kind: "text", key: "eyebrow", label: "Eyebrow" },
            { kind: "text", key: "title", label: "Title" },
            { kind: "textarea", key: "description", label: "Description" },
            {
              kind: "list",
              key: "items",
              label: "Cards",
              addLabel: "Add card",
              itemFields: [
                { key: "icon", label: "Icon name", kind: "text" },
                { key: "title", label: "Title", kind: "text" },
                { key: "description", label: "Description", kind: "textarea" },
              ],
            },
          ]}
        />
        <SectionEditor
          page="about"
          section="approach"
          title="Process"
          hint="Steps on /about."
          initial={aboutApproachFallback}
          fields={[
            { kind: "text", key: "eyebrow", label: "Eyebrow" },
            { kind: "text", key: "title", label: "Title" },
            { kind: "textarea", key: "description", label: "Description" },
            {
              kind: "list",
              key: "steps",
              label: "Steps",
              addLabel: "Add step",
              itemFields: [
                { key: "number", label: "Number (01, 02…)", kind: "text" },
                { key: "title", label: "Title", kind: "text" },
                { key: "description", label: "Description", kind: "textarea" },
                { key: "image", label: "Image path or key", kind: "text" },
                { key: "imageAlt", label: "Image alt text", kind: "text" },
              ],
            },
          ]}
        />
        <SectionEditor
          page="about"
          section="teamPreview"
          title="Team preview"
          hint="Team teaser on /about (button link is fixed)."
          initial={aboutTeamPreviewFallback}
          fields={[
            { kind: "text", key: "eyebrow", label: "Eyebrow" },
            { kind: "text", key: "title", label: "Title" },
            { kind: "textarea", key: "description", label: "Description" },
            { kind: "text", key: "image", label: "Image path or key" },
            { kind: "text", key: "imageAlt", label: "Image alt text" },
          ]}
        />
        <SectionEditor
          page="about"
          section="whyChoose"
          title="Why Choose Meghduth (homepage)"
          hint="This block lives on the homepage — edited here, in the About tab."
          initial={aboutWhyChooseFallback}
          fields={[
            { kind: "text", key: "eyebrow", label: "Eyebrow" },
            { kind: "text", key: "title", label: "Title" },
            {
              kind: "list",
              key: "values",
              label: "Values",
              addLabel: "Add value",
              itemFields: [
                { key: "id", label: "Number (01, 02…)", kind: "text" },
                { key: "title", label: "Title", kind: "text" },
                { key: "description", label: "Description", kind: "textarea" },
              ],
            },
          ]}
        />
        <SectionEditor
          page="about"
          section="stats"
          title="Stats (homepage)"
          hint="The numbers strip on the homepage — edited here, in the About tab."
          initial={aboutStatsFallback}
          fields={[
            {
              kind: "list",
              key: "stats",
              label: "Stats",
              addLabel: "Add stat",
              itemFields: [
                { key: "number", label: "Number (15+, 98%…)", kind: "text" },
                { key: "label", label: "Label", kind: "text" },
              ],
            },
          ]}
        />
      </div>
    </>
  );
}
