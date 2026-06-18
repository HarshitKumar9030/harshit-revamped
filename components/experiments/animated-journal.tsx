"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// --- Mock Journal Data ---
// Set around the current date: May 30, 2026
const JOURNAL_ENTRIES = [
  {
    id: 1,
    date: "May 30, 2026",
    time: "01:15 AM",
    content: "Couldn't sleep. The integration specs for the Android app are finally mapped out. Thinking about how data density changes the way we perceive our own habits. A 5-minute interval feels entirely different than a 10-minute one. Need to test the sensor batching tomorrow morning.",
    tags: ["architecture", "late-night", "thoughts"],
  },
  {
    id: 2,
    date: "May 29, 2026",
    time: "08:42 PM",
    content: "Ran 7.5km tonight. The air was incredibly heavy, but keeping the pace under 5:30/km felt effortless. There's a specific kind of clarity that only comes after the 5th kilometer when the noise in your head finally shuts off.",
    tags: ["running", "clarity"],
  },
  {
    id: 3,
    date: "May 29, 2026",
    time: "09:15 AM",
    content: "Decided to strip all box-shadows and borders from the UI. It's fascinating how removing visual boundaries actually makes the interface feel more structured. Relying purely on typography and negative space is much harder, but the result is absolute.",
    tags: ["design", "minimalism"],
  },
  {
    id: 4,
    date: "May 28, 2026",
    time: "11:04 PM",
    content: "Read an article about how hardware step counters natively batch data to save battery. It's a perfect metaphor for how we should handle personal energy—don't react to every single step, batch your responses. Save the CPU.",
    tags: ["metaphor", "reading"],
  }
];

export default function JournalShowcase() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="w-full min-h-screen bg-[#111111] text-[#e2e2e2] font-mono selection:bg-[#C43114] selection:text-white py-24 px-8 sm:px-16 flex justify-center">
      
      <div className="w-full max-w-2xl relative">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-20 text-white/90">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
          <h1 className="text-[13px] font-serif tracking-wide text-[#d1d1d1]">
            Personal Journal • Private Logs
          </h1>
        </div>

        {/* Timeline Line */}
        {/* We use an absolute line that runs down the left side, acting as the spine of the journal */}
        <div className="absolute left-[5px] top-[100px] bottom-0 w-[1px] bg-white/10 z-0" />

        {/* Journal Entries List */}
        <div className="flex flex-col gap-16 relative z-10">
          {JOURNAL_ENTRIES.map((entry) => {
            const isHovered = hoveredId === entry.id;
            const isFaded = hoveredId !== null && hoveredId !== entry.id;

            return (
              <motion.div
                key={entry.id}
                className="relative pl-10 group cursor-default"
                onMouseEnter={() => setHoveredId(entry.id)}
                onMouseLeave={() => setHoveredId(null)}
                // Smoothly dim entries that are not being hovered
                animate={{
                  opacity: isFaded ? 0.3 : 1,
                  filter: isFaded ? "blur(1px)" : "blur(0px)",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Timeline Dot */}
                <div 
                  className={`absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-[2px] transition-colors duration-300 ${
                    isHovered 
                      ? "border-[#C43114] bg-[#C43114]" 
                      : "border-[#333333] bg-[#111111]"
                  }`}
                />

                {/* Date & Time Metadata */}
                <div className="flex items-baseline gap-4 mb-3">
                  <span className={`text-[11px] uppercase tracking-widest font-semibold transition-colors duration-300 ${isHovered ? "text-[#C43114]" : "text-white/40"}`}>
                    {entry.date}
                  </span>
                  <span className="text-[10px] text-white/20 tracking-wider">
                    {entry.time}
                  </span>
                </div>

                {/* Journal Content (Slightly larger, highly legible serif or clean sans) */}
                <p className="text-[15px] leading-relaxed text-white/80 font-sans tracking-wide mb-4">
                  {entry.content}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-3">
                  {entry.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className={`text-[10px] tracking-widest lowercase transition-colors duration-300 ${
                        isHovered ? "text-white/50" : "text-white/20"
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* End of Line Indicator */}
        <div className="relative pl-10 mt-16 text-[10px] text-white/20 uppercase tracking-widest flex items-center">
          <div className="absolute left-[3px] w-[5px] h-[5px] rounded-full bg-white/20" />
          End of Logs
        </div>

      </div>
    </div>
  );
}