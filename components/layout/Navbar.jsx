"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import navigation from "@/constants/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className={`transition-all duration-700 ease-out ${
          isScrolled
            ? "h-16 border-b border-white/10 bg-black/40 backdrop-blur-2xl shadow-lg"
            : "h-20 border-b border-transparent bg-transparent"
        }`}
      >
        <Container>
          <div className="flex h-full items-center justify-between px-6 lg:px-8">
            {/* Logo */}
            <Link href="/" className="flex flex-col">
              <span className="font-[family:var(--font-heading)] text-3xl font-semibold tracking-wide">
                Meghdut
              </span>

              <span className="-mt-1 text-[10px] uppercase tracking-[0.4em] text-zinc-400">
                DESIGN STUDIO
              </span>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden items-center gap-10 lg:flex">
              {navigation.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className={`text-sm transition duration-300 ${
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

            {/* CTA */}
            <div className="hidden lg:block">
              <Button variant="secondary">Free Consultation</Button>
            </div>

            {/* Mobile */}
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </Container>
      </nav>
    </header>
  );
}