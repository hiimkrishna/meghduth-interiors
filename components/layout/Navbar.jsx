"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import navigation from "@/constants/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const drawerItem = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    show: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.35,
      },
    }),
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[60] select-none">
      <nav
        className={`transition-all duration-300 ease-out text-white ${
          isScrolled || isOpen
            ? "h-16 border-b border-white/10 bg-black/80 backdrop-blur-xl shadow-md"
            : "h-20 border-b border-transparent bg-transparent"
        }`}
      >
        <Container className="h-full">
          <div className="flex h-full items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative z-50 flex flex-col">
              <span
                className="
                  font-[family:var(--font-heading)]
                  text-2xl
                  font-semibold
                  tracking-wide
                  text-white
                  sm:text-3xl
                "
              >
                Meghdut
              </span>

              <span
                className="
                  -mt-1
                  text-[9px]
                  uppercase
                  tracking-[0.4em]
                  text-zinc-400
                  sm:text-[10px]
                "
              >
                DESIGN STUDIO
              </span>
            </Link>

            {/* Desktop Navigation */}
            <ul
              className="
                hidden
                items-center
                gap-8
                lg:flex
                xl:gap-10
              "
            >
              {navigation.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      pathname === item.href
                        ? "text-[#B79A6A]"
                        : "text-zinc-300 hover:text-[#B79A6A]"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <Button href="/contact" variant="secondary">
                Free Consultation
              </Button>
            </div>

            {/* Placeholder to reserve space and keep alignment perfect */}
            <div className="w-10 h-10 lg:hidden" />
          </div>
        </Container>
      </nav>

      {/* 🛠️ FIXED TRIGGER: Removed broken class, forced absolute dimensions */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="
          fixed
          right-4
          z-[70]
          flex
          h-10
          w-10
          items-center
          justify-center
          text-white
          lg:hidden
          focus:outline-none
          pointer-events-auto
          sm:right-6
          transition-all
          duration-300
        "
        style={{
          top: isScrolled || isOpen ? "12px" : "20px"
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          className="stroke-current fill-none stroke-[2] stroke-linecap-round"
        >
          {/* Top Line */}
          <motion.path
            animate={
              isOpen ? { d: "M 4 17 L 18 4" } : { d: "M 3 5 L 19 5" }
            }
            transition={{ duration: 0.25 }}
          />

          {/* Middle Line */}
          <motion.path
            d="M 3 11 L 19 11"
            animate={
              isOpen
                ? {
                    opacity: 0,
                  }
                : {
                    opacity: 1,
                  }
            }
            transition={{ duration: 0.2 }}
          />

          {/* Bottom Line */}
          <motion.path
            animate={
              isOpen ? { d: "M 4 4 L 18 17" } : { d: "M 3 17 L 19 17" }
            }
            transition={{ duration: 0.25 }}
          />
        </svg>
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: "-8%",
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: "-8%",
            }}
            transition={{
              duration: 0.3,
            }}
            className="
              fixed
              inset-0
              z-40
              flex
              flex-col
              bg-neutral-950
              px-6
              pt-24
              pb-8
              lg:hidden
            "
          >
            <div
              className="
                flex
                h-full
                flex-col
                justify-between
              "
            >
              {/* Navigation Links */}
              <ul
                className="
                  flex
                  flex-col
                  gap-5
                "
              >
                {navigation.map((item, index) => (
                  <motion.li
                    key={item.title}
                    custom={index}
                    variants={drawerItem}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    <Link
                      href={item.href}
                      className={`block py-2 text-xl font-light tracking-wide transition-colors ${
                        pathname === item.href
                          ? "text-[#B79A6A]"
                          : "text-zinc-300 hover:text-[#B79A6A]"
                      }`}
                    >
                      {item.title}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Consultation Target Button */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 20,
                }}
                transition={{
                  delay: 0.2,
                  duration: 0.3,
                }}
                className="
                  w-full
                  pb-[max(1.5rem,env(safe-area-inset-bottom))]
                "
              >
                <Button
                  href="/contact"
                  variant="primary"
                  className="
                    w-full
                    justify-center
                    py-4
                    text-base
                  "
                >
                  Free Consultation
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}