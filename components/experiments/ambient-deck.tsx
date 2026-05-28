"use client";

import React, { useState, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";

// --- Types & Data ---
interface CardData {
  id: number;
  url: string;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

const initialCards: CardData[] = [
  { id: 1, url: "https://images.unsplash.com/photo-1485841890310-6a055c88698a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 2, url: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 3, url: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 4, url: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
];

// Cache to avoid recalculating colors for images we've already processed
const colorCache: Record<string, RGB> = {};

// Helper to extract the dominant ambient color from an image URL using a hidden Canvas
const getAverageColor = (url: string): Promise<RGB> => {
  return new Promise((resolve) => {
    if (colorCache[url]) return resolve(colorCache[url]);

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve({ r: 50, g: 50, b: 80 });

      ctx.drawImage(img, 0, 0, 64, 64);
      const data = ctx.getImageData(0, 0, 64, 64).data;
      let r = 0, g = 0, b = 0, count = 0;

      // Sample every 16th pixel for performance
      for (let i = 0; i < data.length; i += 16) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }

      const color = {
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count)
      };

      colorCache[url] = color;
      resolve(color);
    };
    img.onerror = () => resolve({ r: 50, g: 50, b: 80 }); // Fallback on CORS error
  });
};

export default function AmbientDeck() {
  const [cards, setCards] = useState<CardData[]>(initialCards);
  const [ambient1, setAmbient1] = useState<RGB>({ r: 56, g: 31, b: 122 });
  const [ambient2, setAmbient2] = useState<RGB>({ r: 19, g: 78, b: 112 });

  // Update ambient background colors whenever the top cards change
  useEffect(() => {
    const fetchColors = async () => {
      const topColor = await getAverageColor(cards[0].url);
      const nextColor = await getAverageColor(cards[1].url);
      setAmbient1(topColor);
      setAmbient2(nextColor);
    };
    fetchColors();
  }, [cards]);

  // Handle Drag logic
  const handleDragEnd = (event: any, info: PanInfo) => {
    const slideThreshold = 120; // How far to swipe before it shuffles

    // If dragged far enough on the X axis, shuffle
    if (Math.abs(info.offset.x) > slideThreshold) {
      setCards((prev) => {
        const newArray = [...prev];
        const topCard = newArray.shift();
        if (topCard) newArray.push(topCard); // Move top card to back
        return newArray;
      });
    }
  };

  return (
    <div
      className="relative flex items-center justify-center h-full w-full overflow-hidden font-sans"
      style={{ backgroundColor: "#09090b" }}
    >
      {/* Dynamic Ambient Background Layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(${ambient1.r}, ${ambient1.g}, ${ambient1.b}, 0.5) 0%, transparent 60%),
            radial-gradient(circle at 80% 80%, rgba(${ambient2.r}, ${ambient2.g}, ${ambient2.b}, 0.3) 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0px, transparent 100%)
          `
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      {/* Deck Container */}
      <div className="relative w-[260px] h-[360px]">
        {cards.map((card, index) => {
          const isTop = index === 0;

          // Modern layout variables
          const xOffset = index * 8;
          const yOffset = index * -10;
          const scale = 1 - index * 0.04;
          const rotate = index % 2 === 0 ? index * 2 : index * -2;
          const zIndex = cards.length - index;

          return (
            <motion.div
              key={card.id}
              // "layout" prop tells Framer to smoothly animate array re-ordering
              layout
              className="absolute top-0 left-0 w-full h-full rounded-[24px] overflow-hidden"
              style={{
                zIndex,
                transformOrigin: "center center",
                backgroundColor: "#18181b",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: `
                  0 30px 60px -12px rgba(0, 0, 0, 0.6), 
                  0 18px 36px -18px rgba(0, 0, 0, 0.5),
                  inset 0 1px 1px rgba(255, 255, 255, 0.2)
                `,
              }}
              // 1. Initial/Resting State
              animate={{
                x: xOffset,
                y: yOffset,
                scale: scale,
                rotate: rotate,
              }}
              // Framer Motion Spring physics
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 22,
                bounce: 0.4,
              }}
              // 2. Drag Interactivity (Only applied to the top card)
              drag={isTop ? "x" : false}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Snap back to origin
              dragElastic={0.65} // "Bubble" edge resistance
              onDragEnd={handleDragEnd}
              // 3. Hover & Active States
              whileHover={
                isTop
                  ? { y: -15, rotate: 0, scale: 1.02 }
                  : {}
              }
              whileTap={
                isTop
                  ? {
                      scale: 1.08, // Bubble pop feeling when grabbed
                      boxShadow: `
                        0 40px 70px -15px rgba(0,0,0,0.8), 
                        inset 0 1px 1px rgba(255,255,255,0.3)
                      `,
                    }
                  : {}
              }
            >
              <img
                src={card.url}
                alt={`Card ${card.id}`}
                draggable={false} // Disable native HTML image dragging
                className="w-full h-full object-cover pointer-events-none transition-all duration-300 ease-in-out hover:brightness-110 hover:contrast-110"
                style={{
                  filter: isTop
                    ? "brightness(1) contrast(1.1)"
                    : "brightness(0.85) contrast(1.1)",
                }}
              />
            </motion.div>
          );
        })}

        {/* Minimalist modern hint */}
        <div className="absolute -bottom-[70px] left-1/2 -translate-x-1/2 flex items-center gap-2 text-[rgba(255,255,255,0.4)] text-[0.85rem] font-medium tracking-[0.02em]">
          <span>Swipe to explore</span>
        </div>
      </div>
    </div>
  );
}
