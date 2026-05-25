"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function ExpandableImage({ src, alt }: { src: string; alt: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className="w-full my-16 relative aspect-[21/9] bg-[#EAE5D9] overflow-hidden group rounded-[2.5rem] cursor-zoom-in"
        onClick={() => setIsOpen(true)}
      >
        <Image 
          src={src} 
          alt={alt || "Scrawl Image"} 
          fill 
          sizes="(max-width: 768px) 100vw, 85ch"
          className="object-cover grayscale-[0.2] brightness-95 group-hover:brightness-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms] ease-out"
        />
        {alt && (
          <span className="absolute bottom-6 right-6 z-20 text-[10px] uppercase font-bold tracking-[0.2em] text-[#111111] bg-[#FDFBF7]/90 backdrop-blur-md px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none">
            {alt}
          </span>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111111]/90 backdrop-blur-xl p-4 md:p-12 cursor-zoom-out"
            onClick={() => setIsOpen(false)}
          >
            <button 
              className="absolute top-8 right-8 z-50 p-4 bg-[#FDFBF7]/10 hover:bg-[#FDFBF7]/20 rounded-full transition-colors text-[#FDFBF7]"
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              aria-label="Close fullscreen image"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full max-w-6xl max-h-[85vh] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()} // keep open if they click the image itself, though we put cursor-zoom-out on bg
            >
              <Image 
                src={src} 
                alt={alt || "Scrawl Image"} 
                fill 
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}