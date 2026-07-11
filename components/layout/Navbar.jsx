"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import navigation from "@/constants/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const linkVariants = {
    initial: { opacity: 0, x: -16 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    exit: { opacity: 0, x: -12, transition: { duration: 0.15 } },
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 select-none">
      <nav
        className={`relative transition-all duration-300 ease-out text-white z-50 ${
          isScrolled || isOpen
            ? "h-16 border-b border-white/10 bg-black/80 backdrop-blur-xl shadow-md"
            : "h-20 border-b border-transparent bg-transparent"
        }`}
      >
        <Container className="h-full">
          <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-0">
            {/* Logo */}
            <Link
              href="/"
              className="relative z-50 flex flex-col focus:outline-none"
            >
              <span className="font-[family:var(--font-heading)] text-2xl sm:text-3xl font-semibold tracking-wide">
                Meghdut
              </span>
              <span className="-mt-1 text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-zinc-400">
                DESIGN STUDIO
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="hidden items-center gap-8 xl:gap-10 lg:flex">
              {navigation.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className={`text-sm font-medium transition duration-200 focus:outline-none ${
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

            {/* Desktop Call To Action */}
            <div className="hidden lg:block">
              <Button href="/contact" variant="secondary">
                Free Consultation
              </Button>
            </div>

            {/* 🛠️ MATHEMATICALLY SYMMETRICAL SVG MORPHING TRIGGER */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="relative z-50 flex h-10 w-10 items-center justify-center rounded-md text-zinc-200 hover:text-white lg:hidden focus:outline-none"
              aria-label="Toggle main navigation menu"
              aria-expanded={isOpen}
            >
              <svg
                width="23"
                height="23"
                viewBox="0 0 23 23"
                className="fill-transparent stroke-current stroke-[2] stroke-linecap-round"
              >
                {/* Top Line */}
                <motion.path
                  animate={
                    isOpen
                      ? { d: "M 3 16.5 L 17 2.5" }
                      : { d: "M 2 2.5 L 20 2.5" }
                  }
                  transition={{ duration: 0.3 }}
                />
                {/* Middle Line */}
                <motion.path
                  d="M 2 9.423 L 20 9.423"
                  animate={
                    isOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }
                  }
                  transition={{ duration: 0.2 }}
                />
                {/* Bottom Line */}
                <motion.path
                  animate={
                    isOpen
                      ? { d: "M 3 2.5 L 17 16.5" }
                      : { d: "M 2 16.346 L 20 16.346" }
                  }
                  transition={{ duration: 0.3 }}
                />
              </svg>
            </button>
          </div>
        </Container>
      </nav>

      {/* Mobile Drawer Panel Overlay */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-neutral-950 px-6 pt-28 pb-10 lg:hidden overflow-hidden"
          >
            <ul className="flex flex-col gap-5 border-b border-white/5 pb-8">
              {navigation.map((item, index) => (
                <motion.li
                  key={item.title}
                  variants={linkVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: index * 0.04 }}
                >
                  <Link
                    href={item.href}
                    className={`block py-2 text-xl font-light tracking-wide ${
                      pathname === item.href
                        ? "text-[#B79A6A]"
                        : "text-zinc-300"
                    }`}
                  >
                    {item.title}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.15 }}
              className="mt-auto w-full"
            >
              <Button
                href="/contact"
                className="w-full text-center justify-center py-4 text-base"
              >
                Free Consultation
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
