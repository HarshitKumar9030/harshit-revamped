"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function Marquee() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(".marquee-content", {
      xPercent: -50,
      ease: "none",
      duration: 10,
      repeat: -1,
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full bg-[#1A1A1A] py-6 overflow-hidden flex items-center">
      <div className="marquee-content flex gap-8 w-max whitespace-nowrap text-[#F0EDE5]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-8 items-center">
            <span className="text-3xl md:text-5xl font-bold uppercase tracking-tighter" style={{ fontFamily: "var(--font-heading)" }}>
              Available For Work
            </span>
            <div className="w-3 h-3 rounded-full bg-[#B5D8EB]" />
          </div>
        ))}
      </div>
    </div>
  );
}
