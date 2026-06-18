"use client";

import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Footprints } from "lucide-react";
import { useState, useEffect } from "react";

type StepWidgetProps = {
  steps: number;
  dateLabel: string;
};

export function StepWidget({ steps, dateLabel }: StepWidgetProps) {
  const { scrollY } = useScroll();
  const yOffset = useTransform(scrollY, [0, 300], [100, 0]);
  const opacity = useTransform(scrollY, [0, 300], [0, 1]);

  const [isExpanded, setIsExpanded] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 300 && !hasScrolled) {
      setHasScrolled(true);
    }
  });

  useEffect(() => {
    if (hasScrolled) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [hasScrolled]);

  return (
    <motion.div
      style={{ y: yOffset, opacity }}
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-60 flex origin-bottom-right cursor-pointer items-center rounded-full border border-[#2A2A2A]/5 bg-[#FDFBF7] p-2 shadow-[0_8px_30px_rgba(42,42,42,0.12)] transition-colors hover:border-[#2A2A2A]/15"
    >
      <motion.div 
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2A2A2A] text-[#D9ED92]"
        whileHover={{ rotate: 15 }}
      >
        <Footprints className="h-5 w-5" />
      </motion.div>
      
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col overflow-hidden whitespace-nowrap"
          >
            <div className="flex flex-col pl-3 pr-2">
              <span className="text-sm font-bold leading-tight text-[#2A2A2A]" style={{ fontFamily: "var(--font-inter)" }}>
                {steps.toLocaleString()}
              </span>
              <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[#6D6558]">
                Steps
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}