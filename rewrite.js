const fs = require('fs');

const footer = \"use client";
import { useEffect, useState } from "react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { Shriju } from "@/components/sections/shriju";

export function Footer() {
  const [time, setTime] = useState("");
  const [showShriju, setShowShriju] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative w-full bg-[#111] text-[#F0EDE5] pt-24 md:pt-40 overflow-hidden z-10 selection:bg-[#FF9E9E] selection:text-[#111]">
      <div className="w-full px-6 md:px-24 flex flex-col gap-24 md:gap-32 relative z-20">
        
        {/* TOP ROW: About & Secret Gallery */}
        <div className="flex flex-col md:flex-row justify-between gap-16 md:gap-24">
          <div className="flex flex-col gap-6 md:w-1/2">
             <span className="uppercase text-xs font-bold tracking-[0.3em] font-mono text-[#D9ED92]">About</span>
             <h3 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85]" style={{ fontFamily: "var(--font-heading)" }}>
               Minimalist developer crafting uncompromised digital experiences.
             </h3>
          </div>
          
          <div className="flex flex-col gap-6 md:w-1/3">
             <span className="uppercase text-xs font-bold tracking-[0.3em] font-mono text-[#FF9E9E]">Secret Gallery</span>
             <p className="text-base md:text-lg opacity-60 font-medium leading-relaxed max-w-sm">
               For the one who makes everything better.
             </p>
             <button 
               onClick={() => setShowShriju(true)}
               className="self-start uppercase text-sm md:text-base font-bold tracking-[0.2em] font-mono text-[#FF9E9E] hover:text-[#D9ED92] transition-colors duration-500 mt-2"
             >
               [ Enter Gallery ]
             </button>
          </div>
        </div>

        {/* BOTTOM ROW: Socials & BOM */}
        <div className="flex flex-col gap-8 md:gap-12">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
             
             <div className="flex flex-col gap-6">
               <span className="uppercase text-[10px] font-bold tracking-[0.3em] font-mono text-[#9A8CFF]">Socials</span>
               <div className="flex flex-col sm:flex-row gap-6 font-mono text-sm md:text-base uppercase tracking-widest opacity-80">
                 <a href="#" className="hover:text-[#D9ED92] transition-colors duration-500">Twitter</a>
                 <a href="#" className="hover:text-[#9A8CFF] transition-colors duration-500">GitHub</a>
                 <a href="#" className="hover:text-[#FF9E9E] transition-colors duration-500">Instagram</a>
               </div>
             </div>

             <div className="flex items-center gap-3 font-mono text-xs tracking-widest uppercase opacity-40">
               <div className="w-2 h-2 rounded-full bg-[#D9ED92] animate-pulse"></div>
               <span>BOM — {time || "--:--"}</span>
             </div>
           </div>
        </div>
      </div>

      {/* TEXT HOVER */}
      <div className="w-full h-[30vh] md:h-[45vh] lg:h-[50vh] mt-12 z-0 flex items-end pointer-events-none cursor-default opacity-80">
        <TextHoverEffect text="HARSHIT" />
      </div>

      <Shriju isOpen={showShriju} onClose={() => setShowShriju(false)} />
    </footer>
  );
}
\;

const shriju = \"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Play, Pause } from "lucide-react";

export function Shriju({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (!audioRef.current) {
        audioRef.current = new Audio("/bairan.mp3");
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;
      }
      audioRef.current.play().then(() => setIsPlaying(true)).catch(e => {
        console.warn("Audio autoplay blocked", e);
        setIsPlaying(false);
      });
    } else {
      document.body.style.overflow = "";
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Collage positioning array for the images
  const imageData = [
    { src: "/shriju/5x.png", r: -6, x: "-20vw", y: "-15vh", tw: "w-[45vw] md:w-[25vw] aspect-[2/3]" },
    { src: "/shriju/6x.png", r: 8, x: "18vw", y: "-22vh", tw: "w-[50vw] md:w-[28vw] aspect-[3/2]" },
    { src: "/shriju/IMG-20260208-WA0029.jpg", r: -3, x: "25vw", y: "18vh", tw: "w-[40vw] md:w-[22vw] aspect-square" },
    { src: "/shriju/IMG-20260314-WA0048.jpg", r: -9, x: "-22vw", y: "20vh", tw: "w-[45vw] md:w-[24vw] aspect-[4/5]" },
    { src: "/shriju/IMG-20260314-WA0055.jpg", r: 4, x: "3vw", y: "5vh", tw: "w-[60vw] md:w-[35vw] aspect-[16/9]" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#111] overflow-hidden"
        >
          {/* Aesthetic Background Blobs */}
          <div className="absolute inset-0 z-0">
             <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-[#FF9E9E]/10 rounded-full blur-[120px] pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-[90vw] h-[90vw] bg-[#D9ED92]/10 rounded-full blur-[140px] pointer-events-none delay-1000" />
             <div className="absolute top-1/2 left-1/4 w-[50vw] h-[50vw] bg-[#9A8CFF]/10 rounded-full blur-[100px] pointer-events-none" />
          </div>

          {/* Header & Controls */}
          <div className="absolute top-0 w-full p-8 md:p-12 flex justify-between items-start z-50 pointer-events-none">
            <div className="flex flex-col gap-2 pointer-events-auto">
              <h2 className="text-5xl md:text-7xl font-black uppercase text-[#FF9E9E]" style={{ fontFamily: "var(--font-heading)" }}>
                Shrishti
              </h2>
              <span className="font-mono text-xs uppercase tracking-[0.4em] text-[#F0EDE5] opacity-50">The aesthetic dimension</span>
            </div>
            
            <div className="flex gap-4 pointer-events-auto">
              <button onClick={togglePlay} className="p-3 text-[#D9ED92] hover:text-[#F0EDE5] transition-colors mix-blend-difference">
                {isPlaying ? <Pause size={32} strokeWidth={1.5} /> : <Play size={32} strokeWidth={1.5} />}
              </button>
              <button onClick={onClose} className="p-3 text-[#FF9E9E] hover:text-[#F0EDE5] transition-colors mix-blend-difference">
                <X size={32} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Image Collage */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            {imageData.map((img, i) => {
              const isHovered = hoveredIdx === i;
              return (
                <motion.div
                  key={i}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  initial={{ opacity: 0, scale: 0.5, x: "0vw", y: "0vh", rotate: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isHovered ? 1.05 : 1, 
                    x: img.x, 
                    y: img.y, 
                    rotate: isHovered ? 0 : img.r,
                    zIndex: isHovered ? 50 : i
                  }}
                  transition={{ 
                    duration: isHovered ? 0.3 : 1.2, 
                    ease: "easeOut",
                    delay: isHovered ? 0 : i * 0.1 
                  }}
                  className={\bsolute cursor-pointer \\}
                >
                  <Image 
                    src={img.src} 
                    alt={"Memory " + String(i)} 
                    fill 
                    sizes="(max-width: 768px) 70vw, 40vw"
                    className="object-cover mix-blend-normal"
                    quality={i === 4 ? 100 : 75} 
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
\;

fs.writeFileSync('components/sections/footer.tsx', footer, 'utf-8');
fs.writeFileSync('components/sections/shriju.tsx', shriju, 'utf-8');
