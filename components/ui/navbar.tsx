"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { useState, useEffect } from "react";
import { HamburgerIcon, LineStyleIcon, Menu, Waves, X } from "lucide-react";

export function Navbar() {
  const lenis = useLenis();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleScroll = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (lenis) {
      lenis.scrollTo(id, { offset: 0 });
    } else {
      document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Work", href: "#work" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-6 px-6 md:px-12 mix-blend-difference text-[#FDFBF7] pointer-events-auto"
      >
        <Link 
          href="/" 
          onClick={() => setIsOpen(false)}
          className="text-xl md:text-2xl font-bold tracking-tighter uppercase relative z-[60]" 
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Harshit
        </Link>
        
        <nav className="hidden md:flex gap-10 items-center text-sm font-medium tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-heading)" }}>
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={handleScroll(link.href)} 
              className="relative group overflow-hidden cursor-pointer"
            >
              <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
                {link.name}
              </span>
              <span className="absolute top-0 left-0 inline-block transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-[#D9ED92]">
                {link.name}
              </span>
            </a>
          ))}
          <Link 
            href="/scrawl" 
            onClick={() => setIsOpen(false)}
            className="relative group overflow-hidden cursor-pointer"
          >
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
              Scrawl
            </span>
            <span className="absolute top-0 left-0 inline-block transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-[#D9ED92]">
              Scrawl
            </span>
          </Link>
        </nav>

        <button
          className="md:hidden relative z-[60] flex items-center justify-center p-2 -mr-2 text-[#FDFBF7]"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
            {isOpen ? <X size={32} /> : <Waves size={32} />}
          </motion.div>
        </button>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-[#111] flex flex-col justify-center items-center text-[#F0EDE5]"
          >
            <nav className="flex flex-col gap-8 text-center">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                >
                  <a
                    href={link.href}
                    onClick={handleScroll(link.href)}
                    className="text-6xl md:text-7xl font-black tracking-tighter uppercase transition-colors hover:text-[#D9ED92] hover:italic"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {link.name}
                  </a>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.1 + navLinks.length * 0.1, duration: 0.5, ease: "easeOut" }}
              >
                <Link
                  href="/scrawl"
                  onClick={() => setIsOpen(false)}
                  className="text-6xl md:text-7xl font-black tracking-tighter uppercase transition-colors hover:text-[#D9ED92] hover:italic block"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Scrawl
                </Link>
              </motion.div>
            </nav>
            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
