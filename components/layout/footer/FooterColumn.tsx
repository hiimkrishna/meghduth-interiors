import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

const FooterColumn = ({ title, links }: FooterColumnProps) => {
  return (
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
        {title}
      </h3>

      <ul
        className="
          space-y-4
        "
      >
        {links.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="
                group
                relative
                inline-flex

                text-sm
                text-neutral-400

                transition-colors
                duration-300

                hover:text-[#B79A6A]
              "
            >
              {item.label}

              {/* Hover underline */}

              <span
                className="
                  absolute
                  -bottom-1
                  left-0

                  h-px
                  w-0

                  bg-[#B79A6A]

                  transition-all
                  duration-300

                  group-hover:w-full
                "
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterColumn;
