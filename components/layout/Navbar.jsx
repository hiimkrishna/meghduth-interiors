"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import navigation from "@/constants/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close mobile navigation drawer instantly on path transitions
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle background scrolling states
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile Optimization: Lock page scroll when mobile full-screen panel is open
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

  return (
    <header className="fixed inset-x-0 top-0 z-50 select-none">
      <nav
        className={`transition-all duration-300 ease-out text-white ${
          isScrolled || isOpen
            ? "h-16 border-b border-white/10 bg-black/80 backdrop-blur-xl shadow-md"
            : "h-20 border-b border-transparent bg-transparent"
        }`}
      >
        <Container className="h-full">
          {/* Replaced inner px-6 layout conflicts with clean responsive padding */}
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

            {/* Mobile Tapping Trigger Menu Controls */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="relative z-50 p-2 -mr-2 text-zinc-200 hover:text-white lg:hidden focus:outline-none"
              aria-label={
                isOpen
                  ? "Close main navigation menu"
                  : "Open main navigation menu"
              }
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </Container>
      </nav>

      {/* Mobile Drawer Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-10%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-10%" }}
            transition={{ duration: 0.3, ease: [0.32, 1, 0.68, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-neutral-950 px-6 pt-28 pb-10 lg:hidden"
          >
            {/* Navigation Drawer Menu Stack */}
            <ul className="flex flex-col gap-5 border-b border-white/5 pb-8">
              {navigation.map((item, index) => (
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={item.title}
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

            {/* Mobile Consultation Target Trigger */}
            <div className="mt-auto w-full">
              <Button
                href="/contact"
                className="w-full text-center justify-center py-4 text-base"
              >
                Free Consultation
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
