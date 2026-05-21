"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const greetings = [
  "Hello",
  "Namaste",
  "Bonjour",
  "Konnichiwa",
  "Ni Hao",
  "Ciao",
  "Hola",
  "Hallo",
  "Привет",
];

export function HelloLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Check if the loader has already been shown in this session
    const hasShownLoader = sessionStorage.getItem("hasShownLoader");
    if (hasShownLoader) {
      setIsLoading(false);
      return;
    }

    if (currentIndex < greetings.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 180); // 180ms per word
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("hasShownLoader", "true");
      }, 800); // Wait a bit on the last greeting
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  // If we decided not to show it initially (from sessionStorage), we return null quickly.
  // Wait, framer-motion AnimatePresence requires the element to be there initially to animate out.
  // We'll let it render if isLoading is true.

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#111111] text-[#FDFBF7]"
        >
          <div className="flex items-center gap-4 text-4xl md:text-5xl font-medium tracking-tight">
            <span className="w-3 h-3 rounded-full bg-[#FDFBF7]"></span>
            <div className="relative min-w-[200px] h-[50px] flex items-center overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={currentIndex}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  className="absolute left-0"
                >
                  {greetings[currentIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
