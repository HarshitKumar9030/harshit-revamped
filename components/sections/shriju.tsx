"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Noto_Sans_Devanagari } from "next/font/google";

const hindi = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "700"],
});

const lyricLines = [
  "हो, मन्ने सांभ-सांभ राखे तेरे झांझरा के जोड़े",
  "मेरी गेल रो-रो ये भी छोरी बावले से होरे",
  "मन्ने आए जावे ख्याल तेरे, खाए जावे ख्याल तेरे",
  "जीण कोन्या देती, हाय बैरी तन्हाई मन्ने",
  "गीतां में गाई, कदे छाती के लगाई मन्ने",
  "जित भी गया रे, तेरी याद खड़ी पाई मन्ने",
  "सांभ-सांभ राखी बहुत, छाती के लगाई मन्ने",
  "जित भी गया रे, तेरी याद खड़ी पाई मन्ने",
  "हो, मार्या-मार्या फिरे, देख हाल तू बिचारे का",
  "तेरे बिना जीणा भी के जीणा बंजारे का?",
  "खोया रहूं याद तेरी कर के नादानियां",
  "बटुए में रखूं तेरी सांभ के निशानियां",
  "तेरे बिना काल होरया, ठीक कोन्या हाल मेरा",
  "हाथ जोड़ूं राम, देदे सांसों ते रिहाई मन्ने",
  "गीतां में गाई, कदे छाती के लगाई मन्ने",
  "जित भी गया रे, तेरी याद खड़ी पाई मन्ने",
  "सांभ-सांभ राखी बहुत, छाती के लगाई मन्ने",
  "जित भी गया रे, तेरी याद खड़ी पाई मन्ने",
  "जे तू थोड़ी घबराज्या, मेरी याद तन्ने आ ज्या",
  "तू दे दिए आवाज रे, मैं आ जाऊंगा",
  "तोड़ूं दुनिया की रीत रे, के हार रे, के जीत?",
  "मन्ने चाहिए तेरी प्रीत, मैं निभा जाऊंगा",
  "देख, बावला बनागी, मन्ने लिखणा सिखागी",
  "हाय, नोच-नोच खागी तेरी बैरण जुदाई मन्ने",
  "गीतां में गाई, कदे छाती के लगाई मन्ने",
  "जित भी गया रे, तेरी याद खड़ी पाई मन्ने",
  "आज तै निभाऊं जो सी कसम थी खाई मन्ने",
  "जिंदगी सारी या मेरी तेरे लेखे लाई मन्ने",
];

// User-provided timestamps. Lyrics text stays from the accurate lines above.
const lyricTimes = [
  6, 10, 14, 17, 21, 25, 28, 32, 47, 51, 55, 59, 62, 66,
  70, 74, 77, 81, 95, 99, 103, 106, 110, 114, 118, 122, 126, 138,
];

const syncedLyrics = lyricLines.map((text, index) => ({
  text,
  time: lyricTimes[index] ?? 0,
}));

export function Shriju({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lyricsScrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [activeLyric, setActiveLyric] = useState<number>(0);

  // Pure aesthetic cinematic component. Zero buttons, pure motion. Click anywhere to close.

  useEffect(() => {
    const header = document.querySelector('header');
    
    const handleTimeUpdate = () => {
      if (!audioRef.current) return;
      const currentTime = audioRef.current.currentTime;
      let currentLine = 0;
      for (let i = 0; i < syncedLyrics.length; i += 1) {
        if (currentTime >= syncedLyrics[i].time) {
          currentLine = i;
        } else {
          break;
        }
      }
      setActiveLyric(currentLine);
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (header) header.style.opacity = '0';
      if (header) header.style.pointerEvents = 'none';
      
      if (!audioRef.current) {
        audioRef.current = new Audio("/bairan.mp3");
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;
      }
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.play().catch(e => {
        console.warn("Autoplay blocked, running purely visual.", e);
      });
    } else {
      document.body.style.overflow = "";
      if (header) header.style.opacity = '1';
      if (header) header.style.pointerEvents = 'auto';
      
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
    return () => { 
      document.body.style.overflow = ""; 
      if (header) header.style.opacity = '1';
      if (header) header.style.pointerEvents = 'auto';
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (lyricsScrollRef.current && activeLyric >= 0) {
      const activeElement = lyricsScrollRef.current.children[0]?.children[activeLyric] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [activeLyric]);

  const imageData = [
    { src: "/shriju/5x.png", r: -5, top: "15%", left: "10%", w: "w-[45vw] md:w-[22vw]", h: "aspect-[3/4]" },
    { src: "/shriju/6x.png", r: 8, top: "8%", left: "55%", w: "w-[50vw] md:w-[25vw]", h: "aspect-[4/3]" },
    { src: "/shriju/IMG-20260208-WA0029.jpg", r: -3, top: "50%", left: "65%", w: "w-[40vw] md:w-[20vw]", h: "aspect-[4/5]" },
    { src: "/shriju/IMG-20260314-WA0048.jpg", r: -8, top: "60%", left: "15%", w: "w-[45vw] md:w-[24vw]", h: "aspect-square" },
    { src: "/shriju/IMG-20260314-WA0055.jpg", r: 4, top: "35%", left: "30%", w: "w-[60vw] md:w-[35vw]", h: "aspect-[16/9]" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#111] overflow-hidden"
        >
          {/* Background Click-to-Close Area */}
          <div 
            className="absolute inset-0 z-0 cursor-pointer" 
            onClick={onClose} 
            title="Click background to close"
          />

          {/* Core Ambient Typography */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="absolute z-0 flex flex-col items-center text-center gap-4 pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <h2 className="text-7xl md:text-9xl font-bold tracking-tighter text-[#FF9E9E]">
              Shriju
            </h2>
            <motion.span 
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 0.8, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 1.5, duration: 2, ease: "easeOut" }}
              className="font-mono text-sm md:text-base tracking-[0.2em] text-[#FF9E9E] lowercase italic"
            >
              i love you
            </motion.span>
          </motion.div>

          {/* Ambient Scrolling Lyrics */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 2 }}
            ref={lyricsScrollRef}
            className="absolute left-6 md:left-12 lg:left-24 top-0 bottom-0 overflow-y-auto z-10 pointer-events-auto cursor-grab active:cursor-grabbing"
            style={{ 
              scrollbarWidth: "none", 
              msOverflowStyle: "none",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)"
            }}
          >
            <div className={`${hindi.className} flex flex-col gap-6 text-[12px] md:text-xl font-medium tracking-wide text-[#F0EDE5] max-w-[250px] md:max-w-[400px] pb-[70vh] pt-[40vh] px-4 transition-all duration-500`}>
              {syncedLyrics.map((line, i) => {
                const isActive = i === activeLyric;
                const isPassed = i < activeLyric;
                
                return (
                  <motion.span 
                    key={i} 
                    layout
                    initial={{ opacity: 0.3 }}
                    animate={{ 
                      opacity: isActive ? 1 : isPassed ? 0.4 : 0.2,
                      scale: isActive ? 1.05 : 1,
                      color: isActive ? "#FF9E9E" : "#F0EDE5",
                      x: isActive ? 10 : 0
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="origin-left cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (audioRef.current) {
                        audioRef.current.currentTime = line.time;
                        setActiveLyric(i);
                      }
                    }}
                  >
                    {line.text}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>

          {/* Cinematic Image Sequence with Draggable Apple-like Spring */}
          <div className="relative z-10 w-full h-full pointer-events-none" ref={containerRef}>
            {imageData.map((img, i) => (
              <motion.div
                key={i}
                className="absolute shadow-none pointer-events-auto"
                style={{ top: img.top, left: img.left, border: "none" }}
                animate={{ 
                  y: [0, -15, 10, 0],
                  x: [0, 10, -5, 0]
                }}
                transition={{ 
                  duration: 15 + i * 2, 
                  ease: "easeInOut", 
                  repeat: Infinity, 
                  repeatType: "mirror" 
                }}
              >
                <motion.div
                  drag
                  dragConstraints={containerRef}
                  dragElastic={0.2}
                  whileDrag={{ scale: 1.15, cursor: "grabbing" }}
                  whileHover={{ scale: 1.05 }}
                  onMouseDown={() => setActiveIdx(i)}
                  onDragStart={() => setActiveIdx(i)}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotate: img.r,
                    zIndex: activeIdx === i ? 100 : 10 + i
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    type: "spring",
                    damping: 18,
                    stiffness: 150,
                    mass: 0.8,
                    delay: i * 0.08,
                    opacity: { duration: 0.8, ease: "easeOut", delay: i * 0.08 }
                  }}
                  className={`relative rounded-[2rem] overflow-hidden cursor-grab ${img.w} ${img.h}`}
                  style={{ touchAction: "none", willChange: "transform" }}
                >
                  <Image 
                    src={img.src} 
                    alt={`Memory ${i}`} 
                    fill 
                    sizes="(max-width: 768px) 70vw, 40vw"
                    className="object-cover pointer-events-none"
                    quality={i === 4 ? 100 : 75} 
                    draggable={false}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
