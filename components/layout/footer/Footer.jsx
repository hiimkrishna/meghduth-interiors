import Link from "next/link";
import BackToTop from "@/components/ui/BackToTop";
import Container from "@/components/ui/Container";

import FooterColumn from "./FooterColumn";
import footerData from "./footerData";

const Footer = () => {
  return (
    <footer
      className="
        border-t
        border-white/10
        bg-[#111315]

        pt-20

        lg:pt-24
      "
    >
      <Container>
        {/* Main Footer */}

        <div
          className="
            grid
            gap-12

            lg:grid-cols-[1.5fr_1fr_1fr_1fr]

            lg:gap-10
          "
        >
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
                "
              >
                Meghdut
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
              {footerData.description}
            </p>
          </div>

          {/* Footer Columns */}

          {footerData.columns.map((column) => (
            <FooterColumn
              key={column.title}
              title={column.title}
              links={column.links}
            />
          ))}

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
              Contact
            </h3>

            <ul
              className="
                space-y-4

                text-sm

                text-neutral-400
              "
            >
              <li>{footerData.contact.phone}</li>

              <li>{footerData.contact.email}</li>

              <li>{footerData.contact.address}</li>
            </ul>
          </div>
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
          <p>{footerData.copyright}</p>

          <div
            className="
      flex
      items-center
      gap-6
    "
          >
            {footerData.socials.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="
            text-neutral-400

            transition-colors
            duration-300

            hover:text-[#B79A6A]
          "
              >
                {social.label}
              </Link>
            ))}

            <BackToTop />
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
