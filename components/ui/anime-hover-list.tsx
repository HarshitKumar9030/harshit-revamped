"use client";

import { useRef, useState, useEffect, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

export type CrunchyDisplayItem = {
  key: string;
  title: string;
  detail: string;
  slug: string;
  image?: string;
};

export function AnimeHoverList({
  watching,
  history,
}: {
  watching?: CrunchyDisplayItem[];
  history?: CrunchyDisplayItem[];
}) {
  const [hoveredItem, setHoveredItem] = useState<CrunchyDisplayItem | null>(null);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const watchingItems = watching ?? [];
  const historyItems = history ?? [];

  useEffect(() => {
    setMounted(true);

    return () => {
      if (imageRef.current) {
        gsap.killTweensOf(imageRef.current);
      }
    };
  }, []);

  const movePreview = (x: number, y: number) => {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, {
      x,
      y,
      duration: 0.22,
      ease: "power2.out",
      overwrite: true,
    });
  };

  const handlePointerEnter = (event: PointerEvent<HTMLElement>, item: CrunchyDisplayItem) => {
    if (event.pointerType === "touch") return;
    setHoveredItem(item);
    movePreview(event.clientX, event.clientY);
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    if (!hoveredItem) return;
    movePreview(event.clientX, event.clientY);
  };

  const handlePointerLeave = () => {
    setHoveredItem(null);
  };

  return (
    <section 
      className="w-full bg-[#111] py-24 md:py-32 px-6 md:px-8 lg:px-24 text-[#F0EDE5] flex flex-col md:flex-row gap-16 lg:gap-32 relative overflow-hidden cursor-default"
      ref={containerRef}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D9ED92]/5 to-[#FF9E9E]/5 opacity-20 pointer-events-none"></div>

      {/* Floating Image Preview */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {hoveredItem && (
              <div ref={imageRef} className="fixed top-0 left-0 w-0 h-0 pointer-events-none z-[9999]">
                <motion.div
                  key={hoveredItem.key}
                  initial={{ opacity: 0, scale: 0.86 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.86 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="-translate-x-1/2 -translate-y-1/2"
                >
                  {hoveredItem.image ? (
                    <img
                      src={hoveredItem.image}
                      alt={hoveredItem.title + " preview"}
                      className="w-64 md:w-80 aspect-video object-cover rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.45)]"
                    />
                  ) : (
                    <div className="w-64 md:w-80 aspect-video rounded-2xl bg-gradient-to-br from-[#D9ED92] via-[#B8D874] to-[#FF9E9E] text-[#111] px-5 py-4 shadow-[0_30px_70px_rgba(0,0,0,0.45)] flex items-end">
                      <span className="text-sm font-bold uppercase tracking-[0.12em] leading-snug line-clamp-3">
                        {hoveredItem.title}
                      </span>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      <div className="flex-1 flex flex-col gap-12 relative z-10">
        <div className="flex flex-col gap-2 pb-6">
          <div className="flex items-center gap-3">
            <span className="uppercase text-xs font-bold tracking-[0.3em] text-[#D9ED92]/80">Now Watching</span>
          </div>
          <h2
            className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mt-4 text-[#D9ED92]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Current
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          {watchingItems.map((item, i) => (
            <a
              key={item.key}
              href={`https://crunchyroll.com/search?q=${encodeURIComponent(item.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-2 group py-4 hover:-translate-y-1 rounded-xl transition-all duration-500 relative z-10"
              onPointerEnter={(event) => handlePointerEnter(event, item)}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4 md:gap-6">
                  <span className="text-sm md:text-base font-mono opacity-20 group-hover:text-[#D9ED92] group-hover:opacity-100 transition-colors mt-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-[#F0EDE5]/90 group-hover:text-[#D9ED92] transition-colors leading-none" style={{ fontFamily: "var(--font-heading)" }}>
                      {item.title}
                    </h3>
                    <span className="text-xs md:text-sm font-mono opacity-40 tracking-wider uppercase group-hover:opacity-100 transition-opacity text-[#D9ED92]/60">{item.detail}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-12 relative z-10">
        <div className="flex flex-col gap-2 pb-6">
          <div className="flex items-center gap-3">
            <span className="uppercase text-xs font-bold tracking-[0.3em] text-[#FF9E9E]/80">Watch History</span>
          </div>
          <h2
            className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mt-4 text-[#FF9E9E]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            History
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          {historyItems.map((item) => (
            <a
              key={item.key}
              href={`https://crunchyroll.com/search?q=${encodeURIComponent(item.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-2 group py-4 hover:-translate-y-1 rounded-xl transition-all duration-500 relative z-10"
              onPointerEnter={(event) => handlePointerEnter(event, item)}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <span className="text-xl md:text-2xl font-bold text-[#F0EDE5]/80 group-hover:text-[#FF9E9E] transition-colors leading-tight">{item.title}</span>
                  <span className="text-[10px] md:text-xs opacity-40 uppercase tracking-widest font-mono group-hover:opacity-100 transition-opacity text-[#FF9E9E]/60">{item.detail}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}