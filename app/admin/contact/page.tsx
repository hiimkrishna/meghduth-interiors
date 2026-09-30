// Contact ট্যাব — Contact পেজের সব সেকশন + হোম/About-এর CTA স্ট্রিপ এক ঠিকানায়।
// CTA দুই পেজে দেখায়, এডিট এখানেই — কেন্দ্রীয় ডেটা।
"use client";

import type { ReactNode } from "react";
import SectionEditor from "@/features/admin/page-sections/SectionEditor";
import { AdminPageHeader } from "@/features/admin/shared/admin-ui";
import {
  contactCtaFallback,
  contactHeroFallback,
  contactInfoFallback,
  contactLocationFallback,
} from "@/lib/page-fallbacks/contact";

export default function AdminContactPage(): ReactNode {
  return (
    <>
      <AdminPageHeader
        title="Contact"
        subtitle="Every section of the Contact page — plus the call-to-action strip shown on the homepage and About page."
      />
      <div className="space-y-6">
        <SectionEditor
          page="contact"
          section="hero"
          title="Page hero"
          hint="Top banner of /contact."
          initial={contactHeroFallback}
          fields={[
            { kind: "text", key: "eyebrow", label: "Eyebrow" },
            { kind: "text", key: "title", label: "Title" },
            { kind: "textarea", key: "description", label: "Description" },
            { kind: "text", key: "image", label: "Image path or key" },
          ]}
        />
        <SectionEditor
          page="contact"
          section="info"
          title="Get in touch"
          hint="Contact details block on /contact."
          initial={contactInfoFallback}
          fields={[
            { kind: "text", key: "eyebrow", label: "Eyebrow" },
            { kind: "text", key: "title", label: "Title" },
            { kind: "textarea", key: "description", label: "Description" },
            {
              kind: "list",
              key: "details",
              label: "Details",
              addLabel: "Add detail",
              itemFields: [
                { key: "icon", label: "Icon name", kind: "text" },
                { key: "title", label: "Title", kind: "text" },
                { key: "value", label: "Value", kind: "text" },
              ],
            },
          ]}
        />
        <SectionEditor
          page="contact"
          section="location"
          title="Studio location"
          hint="Map block on /contact."
          initial={contactLocationFallback}
          fields={[
            { kind: "text", key: "eyebrow", label: "Eyebrow" },
            { kind: "text", key: "title", label: "Title" },
            { kind: "textarea", key: "description", label: "Description" },
            { kind: "text", key: "address", label: "Address" },
            { kind: "textarea", key: "mapEmbed", label: "Google Maps embed URL", rows: 2 },
          ]}
        />
        <SectionEditor
          page="contact"
          section="cta"
          title="Call-to-action strip (homepage + about)"
          hint="The “Start Your Project” banner — edited here, in the Contact tab."
          initial={contactCtaFallback}
          fields={[
            { kind: "text", key: "badge", label: "Badge" },
            { kind: "text", key: "title", label: "Title" },
            { kind: "textarea", key: "description", label: "Description" },
            { kind: "text", key: "buttonText", label: "Button text" },
            { kind: "text", key: "background", label: "Background image path or key" },
          ]}
        />
      </div>
    </>
  );
}
