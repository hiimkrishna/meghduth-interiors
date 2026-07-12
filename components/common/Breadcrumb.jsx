import Link from "next/link";
import { ChevronRight } from "lucide-react";

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-sm"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div
            key={item.href ?? item.label}
            className="flex items-center gap-2"
          >
            {isLast ? (
              <span className="text-white">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="
                  text-neutral-300
                  transition-colors
                  duration-300
                  hover:text-[#B79A6A]
                "
              >
                {item.label}
              </Link>
            )}

            {!isLast && <ChevronRight size={14} className="text-neutral-500" />}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
