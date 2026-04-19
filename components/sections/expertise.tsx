"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/utils/gsap";

const SERVICES = [
  { id: "01", title: "Frontend Engineering", desc: "Building responsive and high-performance applications using Next.js, React, and Tailwind CSS." },
  { id: "02", title: "Full-Stack Development", desc: "Crafting scalable and maintainable backend systems with a strong command over TypeScript and Node.js." },
  { id: "03", title: "System Prototyping", desc: "Designing and making robust projects leveraging the performance and memory safety of Rust." },
  { id: "04", title: "AI & LLM Integration", desc: "Exploring the vast landscape of Large Language Models (LLMs) and integrating intelligent AI-powered solutions into modern web apps." }
];

export function Expertise() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    registerGsap();
    
    gsap.from(".expertise-item", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-32 bg-[#EAE5D9] text-[#2A2A2A]">
      <div className="px-6 md:px-24 flex flex-col gap-4 mb-24">
        <span className="uppercase text-sm font-bold tracking-widest opacity-60" style={{ fontFamily: "var(--font-heading)" }}>
          Capabilities
        </span>
        <h2 className="text-[12vw] md:text-[8vw] font-bold uppercase tracking-tighter leading-[0.8]" style={{ fontFamily: "var(--font-heading)" }}>
          Services <span className="opacity-50 text-transparent" style={{ WebkitTextStroke: "2px #2A2A2A" }}>&</span><br/>Expertise
        </h2>
      </div>

      <div className="flex flex-col w-full border-t border-[#2A2A2A]/20">
        {SERVICES.map((s) => (
          <div key={s.id} className="expertise-item group flex flex-col md:flex-row md:items-center justify-between border-b border-[#2A2A2A]/20 px-6 md:px-24 py-12 md:py-16 hover:bg-[#2A2A2A] hover:text-[#F0EDE5] transition-colors duration-500">
            <div className="flex items-start gap-8 md:gap-16 md:w-2/3">
              <span className="text-xl md:text-3xl font-bold opacity-40 font-mono tracking-tighter mt-1 group-hover:opacity-60 transition-opacity">
                {s.id}.
              </span>
              <h3 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.9]" style={{ fontFamily: "var(--font-heading)" }}>
                {s.title}
              </h3>
            </div>
            <p className="text-lg md:text-2xl font-medium opacity-80 mt-8 md:mt-0 md:w-1/3 leading-tight group-hover:opacity-100 transition-opacity">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
