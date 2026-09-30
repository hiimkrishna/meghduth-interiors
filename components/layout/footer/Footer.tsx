import type * as React from "react";
import { cache } from "react";
import Link from "next/link";
import { Globe } from "lucide-react";
import BackToTop from "@/components/ui/BackToTop";
import Container from "@/components/ui/Container";
import FooterColumn from "./FooterColumn";
import FooterNewsletter from "./FooterNewsletter";
import { listPublishedServices } from "@/server/modules/services/services.service";
import { listPublishedProjects } from "@/server/modules/projects/projects.service";
import { getCachedSiteSettings } from "@/server/modules/site-settings/site-settings.service";

interface FooterProps {
  messages: Record<string, any>;
  locale: string;
}

// অনুরোধ-স্কোপ মেমোইজ — layout-এর getCachedSiteSettings-এর সাথে DB-হিট ভাগ হয়,
// একই রেন্ডারে ফুটার তালিকাগুলোও একবারই পড়া হয়।
const getCachedServices = cache(() => listPublishedServices());
const getCachedProjects = cache(() => listPublishedProjects());

// সার্ভার ফুটার — লিংক DB থেকে সরাসরি আসে (সবসময় তাজা, SEO-তে থাকে)।
// অ্যাডমিনে সেবা/প্রজেক্ট যোগ-লুকালে পরের লোডেই ফুটারে প্রতিফলিত হয়।

interface SocialLink {
  label: string;
  href: string;
}

// ব্র্যান্ড আইকন — ইনলাইন SVG (lucide-স্ট্রোক স্টাইলে, ডিপেন্ডেন্সি ছাড়াই)।
function BrandSvg({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function SocialIcon({ label }: { label: string }): React.JSX.Element {
  const key = label.trim().toLowerCase();
  if (key.includes("facebook"))
    return (
      <BrandSvg>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </BrandSvg>
    );
  if (key.includes("instagram"))
    return (
      <BrandSvg>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </BrandSvg>
    );
  if (key.includes("linkedin"))
    return (
      <BrandSvg>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </BrandSvg>
    );
  if (key.includes("youtube"))
    return (
      <BrandSvg>
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </BrandSvg>
    );
  if (key.includes("twitter") || key === "x")
    return (
      <BrandSvg>
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </BrandSvg>
    );
  return <Globe size={18} />;
}

const COMPANY_LINKS: SocialLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

const FALLBACK_DESCRIPTION =
  "Creating timeless interiors that blend elegance, functionality, and your personal story.";

export default async function Footer({ messages, locale }: FooterProps): Promise<React.JSX.Element> {
  const t = messages.common;
  const navT = messages.navigation;
  const footerT = messages.footer;
  void locale;

  // DB-driven columns — DB ডাউন থাকলেও ফুটার ভাঙে না, ফলব্যাক দেখায়।
  let serviceLinks: SocialLink[] = [];
  let projectLinks: SocialLink[] = [];
  try {
    const [servicesResult, projectsResult] = await Promise.all([
      getCachedServices(),
      getCachedProjects(),
    ]);
    serviceLinks = servicesResult.items.map((it) => ({
      label: it.title,
      href: `/services/${it.slug}`,
    }));
    projectLinks = projectsResult.items.map((it) => ({
      label: it.title,
      href: `/projects/${it.slug}`,
    }));
  } catch {
    // DB ডাউন — খালি কলামে ফলব্যাক বার্তা দেখায়।
  }

  let socials: SocialLink[] = [];
  let phone = "+880 1712345678";
  let email = "info@meghduth.com";
  let address = "Dhaka, Bangladesh";
  let description = FALLBACK_DESCRIPTION;
  let copyright = `© ${new Date().getFullYear()} Meghduth Designs. All rights reserved.`;
  try {
    const settings = await getCachedSiteSettings();
    socials = settings.socials ?? [];
    if (settings.phone) phone = settings.phone;
    if (settings.email) email = settings.email;
    if (settings.address) address = settings.address;
    if (settings.footerDescription) description = settings.footerDescription;
    if (settings.copyright) copyright = settings.copyright;
  } catch {
    // DB ডাউন থাকলেও লেআউট ভাঙে না — ফলব্যাক মানেই রেন্ডার হয়।
  }

  return (
    <footer className="pt-16 sm:pt-20 lg:pt-24">
      <Container>
        <div className="lg:grid lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] lg:gap-10 gap-6">

          {/* Brand */}

          <div>
            <Link
              href="/"
              className="
                inline-flex
                flex-col
              "
            >
              <span
                className="
                  font-[family:var(--font-heading)]
                  text-3xl
                  font-semibold
                  tracking-wide
                  text-white
                  sm:text-4xl
                  sm:text-5xl
                  sm:truncate
                "
              >
                Meghduth
              </span>

              <span
                className="
                  -mt-1
                  text-[10px]
                  uppercase
                  tracking-[0.4em]
                  text-zinc-400
                "
              >
                Design Studio
              </span>
            </Link>

            <p
              className="
                mt-6

                max-w-sm

                text-sm

                leading-7

                text-neutral-400
              "
            >
              {description}
            </p>
          </div>

          {/* Footer Columns */}

          {serviceLinks.length === 0 ? (
            <div>
              <h3
                className="
                  mb-6

                  text-sm

                  uppercase

                  tracking-[0.25em]

                  text-[#B79A6A]
                "
              >
                {t.services || "Services"}
              </h3>
              <p className="text-sm text-neutral-500">{t.noData}</p>
            </div>
          ) : (
            <FooterColumn title={t.services || "Services"} links={serviceLinks} />
          )}
          {projectLinks.length > 0 && (
            <FooterColumn title={t.projects || "Projects"} links={projectLinks} />
          )}
          <FooterColumn title={navT.company || "Company"} links={COMPANY_LINKS} />

          {/* Contact */}

          <div>
            <h3
              className="
                mb-6

                text-sm

                uppercase

                tracking-[0.25em]

                text-[#B79A6A]
              "
            >
              {t.contact || "Contact"}
            </h3>

            <ul
              className="
                space-y-4

                text-sm

                text-neutral-400
              "
            >
              <li>{phone}</li>

              <li>{email}</li>

              <li>{address}</li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}

        <div
          className="
            mt-16

            flex
            flex-col
            gap-6

            border-t
            border-white/10

            pt-10

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            <p
              className="
                text-sm
                uppercase
                tracking-[0.25em]
                text-[#B79A6A]
              "
            >
              {footerT.newsletter || "Newsletter"}
            </p>
            <p className="mt-3 text-sm leading-7 text-neutral-400">
              {footerT.newsletterDesc || "Design ideas and project stories — straight to your inbox."}
            </p>
          </div>
          <FooterNewsletter />
        </div>

        {/* Bottom Bar */}

        <div
          className="
    mt-16

    flex
    flex-col
    gap-6

    border-t
    border-white/10

    py-8

    text-sm
    text-neutral-500

    sm:flex-row
    sm:items-center
    sm:justify-between
  "
        >
          <p>{copyright}</p>

          <div
            className="
      flex
      items-center
      gap-6
    "
          >
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="
            text-neutral-400

            transition-colors
            duration-300

            hover:text-[#B79A6A]
          "
              >
                <SocialIcon label={social.label} />
              </Link>
            ))}

            <BackToTop />
          </div>
        </div>
      </Container>
    </footer>
  );
}