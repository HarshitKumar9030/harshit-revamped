"use client";

import React, { useState, useRef, useMemo } from "react";
import { motion, useSpring } from "framer-motion";
import { Battery, Zap, Footprints, ChevronLeft, ChevronRight } from "lucide-react";

// --- Date Formatting Helper ---
function getFormattedDate(dateObj: Date) {
  const month = dateObj.toLocaleDateString("en-US", { month: "short" });
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  
  const ordinal = (day === 1 || day === 21 || day === 31) ? "st" 
                : (day === 2 || day === 22) ? "nd" 
                : (day === 3 || day === 23) ? "rd" : "th";

  return {
    full: `${month} ${day}, ${year}`,
    short: `${month} ${day}${ordinal}`
  };
}

// --- Biometric Simulation & Color Algorithm ---
function simulateWalkProfile(totalStepsInInterval: number, heightCm = 186, weightKg = 70) {
  const minutes = 5; // We are now using 5-minute high-density intervals
  const stepsPerMin = totalStepsInInterval / minutes;
  
  const strideLengthM = (heightCm * 0.414) / 100;
  const distanceKmNum = (totalStepsInInterval * strideLengthM) / 1000;
  const distanceKm = distanceKmNum.toFixed(2);
  
  let status = "Rest";
  let Icon = Battery;
  let paceStr = "-";
  
  // Color assignment based on exact metrics
  let color = "rgba(255, 255, 255, 0.15)"; // Dimmed for Rest

  if (stepsPerMin > 130) {
    status = "Running";
    Icon = Zap;
    color = "#C43114"; // Red highlight for high intensity
  } else if (stepsPerMin > 40) {
    status = "Walking";
    Icon = Footprints;
    color = "rgba(255, 255, 255, 0.9)"; // Solid white for walking
  } else if (stepsPerMin > 10) {
    status = "Moving";
    Icon = Footprints;
    color = "rgba(255, 255, 255, 0.4)"; // Faint white for light movement
  }

  // Calculate Pace (min/km) only if a valid distance was covered
  if (distanceKmNum > 0.02 && (status === "Walking" || status === "Running")) {
    const paceDecimal = minutes / distanceKmNum;
    if (paceDecimal < 20) { // Filter out unrealistically slow paces
      const pMin = Math.floor(paceDecimal);
      const pSec = Math.floor((paceDecimal - pMin) * 60).toString().padStart(2, "0");
      paceStr = `${pMin}:${pSec}/km`;
    }
  }

  return { distanceKm, status, Icon, paceStr, color };
}

// --- High-Density Daily Data (288 bars) ---
const generateFullDayData = (dateSeed: Date | number) => {
  const numericSeed = typeof dateSeed === 'number' ? dateSeed : dateSeed.getTime();
  return Array.from({ length: 288 }).map((_, i) => {
    // Math to simulate natural daily workouts (Morning Run & Evening Walk)
    const isMorningRun = i > 75 && i < 90; // ~6:15 AM - 7:30 AM
    const isEveningWalk = i > 210 && i < 230; // ~5:30 PM - 7:10 PM
    
    const seedRandom = Math.sin(numericSeed + i) * 10000;
    const randomVal = seedRandom - Math.floor(seedRandom);
    
    const isActive = isMorningRun || isEveningWalk || randomVal > 0.85;

    let steps = 0;
    if (isMorningRun) {
      steps = Math.floor(randomVal * 400) + 650; // Forces Running metric (>130 spm)
    } else if (isEveningWalk) {
      steps = Math.floor(randomVal * 300) + 200; // Forces Walking metric
    } else if (isActive) {
      steps = Math.floor(randomVal * 250); // Light movement
    }

    const stats = simulateWalkProfile(steps, 186, 70);
    
    // Time formatting for 5-minute blocks
    const totalMinutes = i * 5;
    const hour = Math.floor(totalMinutes / 60);
    const min = totalMinutes % 60;
    const timeStr = `${hour === 0 || hour === 12 ? 12 : hour % 12}:${min.toString().padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;

    return {
      id: i,
      timeStr,
      steps,
      ...stats,
      // Scale height based on ~900 max possible steps in a 5 min sprint
      heightPercent: Math.max((steps / 900) * 100, 2), 
    };
  });
};

export default function RunVisualizer() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 29));
  const dateStrings = getFormattedDate(currentDate);

  const data = useMemo(() => generateFullDayData(currentDate.getTime()), [currentDate]);
  
  const chartRef = useRef<HTMLDivElement>(null);
  const lastHoveredId = useRef<number | null>(null); 
  
  const [hoveredBar, setHoveredBar] = useState<any>(null);
  const [isInside, setIsInside] = useState(false);
  
  const cursorX = useSpring(0, { stiffness: 500, damping: 40 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 40 });
  const cursorWidth = useSpring(32, { stiffness: 500, damping: 40 });
  const cursorHeight = useSpring(32, { stiffness: 500, damping: 40 });
  const cursorRadius = useSpring(16, { stiffness: 500, damping: 40 });

  const playScrubSound = () => {
    const sounds = ['/sounds/Run.wav', '/sounds/Run_2.wav', '/sounds/Run_3.wav'];
    const randomUrl = sounds[Math.floor(Math.random() * sounds.length)];
    const audio = new Audio(randomUrl);
    audio.volume = 0.4;
    audio.play().catch(() => {}); 
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsInside(true);
    if (!chartRef.current) return;

    const rect = chartRef.current.getBoundingClientRect();
    const isHoveringChart = e.clientY >= rect.top - 40 && e.clientY <= rect.bottom + 40;

    if (isHoveringChart) {
      const clampedX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentX = clampedX / rect.width;
      const index = Math.min(Math.floor(percentX * data.length), data.length - 1);
      const activeItem = data[index];

      if (lastHoveredId.current !== activeItem.id) {
        lastHoveredId.current = activeItem.id;
        setHoveredBar(activeItem);
        playScrubSound();
      }

      const snappedX = rect.left + (index / (data.length - 1)) * rect.width;
      
      cursorX.set(snappedX - 0.75); 
      cursorY.set(rect.top - 20); 
      cursorWidth.set(1.5); 
      cursorHeight.set(rect.height + 40); 
      cursorRadius.set(0);

    } else {
      lastHoveredId.current = null;
      setHoveredBar(null);
      
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      cursorWidth.set(32);
      cursorHeight.set(32);
      cursorRadius.set(16);
    }
  };

  const handlePrevDay = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1));
  const handleNextDay = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1));

  return (
    <div 
      className="w-full h-screen bg-[#111111] overflow-hidden font-mono relative cursor-none select-none"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        setIsInside(false);
        lastHoveredId.current = null;
      }}
    >
      {/* Morphing Custom Cursor */}
      {isInside && (
        <motion.div
          className="fixed top-0 left-0 bg-[#C43114] z-50 pointer-events-none origin-top"
          style={{ x: cursorX, y: cursorY, width: cursorWidth, height: cursorHeight, borderRadius: cursorRadius }}
        >
          {/* Top Info Context */}
          <div className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[#a8a8a8] text-[14px] font-medium flex items-center gap-2.5">
            {hoveredBar ? (
              <>
                <hoveredBar.Icon size={16} className="text-[#e2e2e2]" />
                <span className="text-white text-[15px]">{hoveredBar.status}</span>
                {hoveredBar.status !== "Rest" && (
                  <span className="ml-1 text-[#888888] text-[14px]">
                    {hoveredBar.distanceKm}km {hoveredBar.paceStr !== "-" && `• ${hoveredBar.paceStr}`}
                  </span>
                )}
              </>
            ) : (
               <span className="text-[14px]">{dateStrings.short}</span>
            )}
          </div>

          {/* Bottom Info Time */}
          <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[#777777] text-[14px] font-medium tracking-wide">
            {hoveredBar ? hoveredBar.timeStr : ""}
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="absolute top-8 left-8 text-white/90 z-10 flex items-center gap-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v.01M5 12l4-2 2.5 3.5 3-3 4 2M8 20v-3l-2-2M16 20v-2l-2-3"/>
        </svg>
        <h1 className="text-[13px] font-serif tracking-wide text-[#d1d1d1]">
          There's no tomorrow like today
        </h1>
      </div>

      {/* Date Switcher */}
      <div className="absolute top-8 right-8 z-20 flex flex-col items-end gap-3 pointer-events-auto">
        <div className="flex items-center gap-4 text-white/40 text-[11px] uppercase tracking-widest font-semibold">
          <button onClick={handlePrevDay} className="hover:text-white transition-colors p-1">
            <ChevronLeft size={16} />
          </button>
          <span className="w-[100px] text-center text-white/80">
            {dateStrings.full}
          </span>
          <button onClick={handleNextDay} className="hover:text-white transition-colors p-1">
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="text-[10px] text-white/20 uppercase tracking-widest mr-1">
          186cm • 70kg Profile
        </div>
      </div>

      {/* High Density Chart Wrapper */}
      <div className="absolute bottom-16 w-full px-12">
        <div ref={chartRef} className="w-full flex items-end justify-between h-[35vh] relative">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 z-10"
              style={{
                width: "1.5px", 
                height: `${item.heightPercent}%`,
                backgroundColor: item.color, // Color injected based on metrics
                opacity: hoveredBar?.id === item.id ? 0 : 1,
                // Transition applies to color as well so switching dates smoothly morphs the red bars
                transition: "height 0.6s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.6s ease, opacity 0.1s"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}