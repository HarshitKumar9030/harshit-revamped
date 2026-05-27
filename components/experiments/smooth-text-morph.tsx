"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

interface CharData {
  id: string;
  char: string;
  isSpace: boolean;
  x: number;
  y: number;
  r: number;
}

interface SmoothTextMorphProps {
  primaryText?: string;
  secondaryText?: string;
}

const generateScatterData = (text: string): CharData[] => {
  return text.split("").map((char, i) => {
    if (char === " ") {
      return { id: `space-${i}`, char, isSpace: true, x: 0, y: 0, r: 0 };
    }
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 100;

    return {
      id: `${char}-${i}`,
      char,
      isSpace: false,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 20,
      r: (Math.random() - 0.5) * 60,
    };
  });
};

export function SmoothTextMorph({
  primaryText = "HARSHIT",
  secondaryText = "Hell Yeahh",
}: SmoothTextMorphProps) {
  const [isHovered, setIsHovered] = useState(false);

  const primaryCharData = useMemo(() => generateScatterData(primaryText), [primaryText]);
  const secondaryCharData = useMemo(() => generateScatterData(secondaryText), [secondaryText]);

  return (
    <div 
      className="relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden bg-[#121212] font-['Plus_Jakarta_Sans',sans-serif] antialiased"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
    >
      <div className="pointer-events-none absolute flex items-center justify-center">
        {primaryCharData.map((item, i) => {
          if (item.isSpace) {
            return <span key={item.id} className="w-[0.4em]" />;
          }
          return (
            <motion.span
              key={item.id}
              className="inline-block origin-center text-4xl md:text-6xl font-extrabold text-white tracking-[4px] will-change-transform"
              initial={false}
              animate={
                isHovered
                  ? { x: item.x, y: item.y, rotate: item.r, scale: 0.4, opacity: 0 }
                  : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
              }
              transition={{
                type: "spring",
                bounce: 0,
                duration: isHovered ? 0.7 : 0.9,
                delay: isHovered ? i * 0.02 : 0.1 + i * 0.02,
              }}
            >
              {item.char}
            </motion.span>
          );
        })}
      </div>

      <div className="pointer-events-none absolute flex items-center justify-center">
        {secondaryCharData.map((item, i) => {
          if (item.isSpace) {
            return <span key={item.id} className="w-[0.4em]" />;
          }
          return (
            <motion.span
              key={item.id}
              className="inline-block origin-center text-3xl md:text-5xl font-medium text-zinc-400 tracking-tight will-change-transform pt-2"
              initial={false}
              animate={
                isHovered
                  ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
                  : { x: item.x, y: item.y, rotate: item.r, scale: 0.4, opacity: 0 }
              }
              transition={{
                type: "spring",
                bounce: 0,
                duration: isHovered ? 0.9 : 0.6,
                delay: isHovered ? 0.1 + i * 0.02 : i * 0.015,
              }}
            >
              {item.char}
            </motion.span>
          );
        })}
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-10 text-xs font-extrabold uppercase tracking-[2px] text-zinc-600"
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        Hover Me
      </motion.div>
    </div>
  );
}