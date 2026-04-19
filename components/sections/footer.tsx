"use client";
import { useState } from "react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { Shriju } from "@/components/sections/shriju";

export function Footer() {
  const [showShriju, setShowShriju] = useState(false);

  return (
    <footer className="w-full bg-[#111111] text-[#FDFBF7] relative flex flex-col overflow-hidden px-4 md:px-12 py-16 md:py-24 border-none rounded-t-[2.5rem] -mt-8 z-20">
      
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 border-b border-[#FDFBF7]/10 pb-16 z-10 w-full">
        
        <div className="flex flex-col gap-4 max-w-lg w-full">
          <button
            type="button"
            onClick={() => setShowShriju(true)}
            className="w-fit text-3xl tracking-tighter font-black uppercase cursor-pointer"
            style={{ fontFamily: "var(--font-heading)" }}
            aria-label="Open Shriju"
          >
            Harshit <span className="text-[#D9ED92]">2026</span>
          </button>
          <p className="text-sm md:text-base opacity-50 font-medium leading-relaxed">
            I design and engineer interactive web, software, and AI projects with a focus on clarity, performance, and meaningful user experience. Every project is an opportunity to blend technical depth with visual impact.
          </p>
        </div>
        
        <div className="flex gap-16 md:gap-32 w-full md:w-auto">
          <div className="flex flex-col gap-8">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30">Connect</span>
            <div className="flex flex-col gap-4 font-bold text-base md:text-xl uppercase tracking-wider">
              <a href="https://github.com/harshitkumar9030" target="_blank" rel="noopener noreferrer" className="hover:text-[#DBC2FC] transition-colors duration-300 flex items-center gap-2 group"><span className="w-0 group-hover:w-4 transition-all duration-300 h-0.5 bg-[#DBC2FC]"></span> Github</a>
              <a href="https://instagram.com/_harshit.xd" target="_blank" rel="noopener noreferrer" className="hover:text-[#D9ED92] transition-colors duration-300 flex items-center gap-2 group"><span className="w-0 group-hover:w-4 transition-all duration-300 h-0.5 bg-[#D9ED92]"></span> Instagram</a>
              <a href="https://www.linkedin.com/in/harshit-singh-44a029371/" target="_blank" rel="noopener noreferrer" className="hover:text-[#EAE5D9] transition-colors duration-300 flex items-center gap-2 group"><span className="w-0 group-hover:w-4 transition-all duration-300 h-0.5 bg-[#EAE5D9]"></span> LinkedIn</a>
            </div>
          </div>
        </div>

      </div>
      
      {/* Bottom Legal / Time */}
      {/* <div className="pt-16 pb-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase opacity-40 z-10 relative">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <span>ALL RIGHTS RESERVED</span>
          <span className="hidden md:block w-[0.5px] h-3 bg-[#F0EDE5]"></span>
          <span>EST. 2026</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#D9ED92]"></div>
          <span className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-[#F0EDE5] opacity-60">
            [ BOM — {time || "--:--"} ]
          </span>
        </div>
      </div> */}
      
      {/* Massive Typography */}
      <div 
        className="w-full flex justify-center items-center mt-auto md:mt-24 select-none z-0 relative group py-12 cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label="Open Shriju"
        onClick={() => setShowShriju(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setShowShriju(true);
          }
        }}
      >
        <div className="w-full max-w-[90vw] md:max-w-none h-[20vh] md:h-[35vh]">
          <TextHoverEffect text="HARSHIT" />
        </div>
      </div>

      <Shriju isOpen={showShriju} onClose={() => setShowShriju(false)} />
    </footer>
  );
}
