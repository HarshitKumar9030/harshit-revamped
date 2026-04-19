"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const ITEMS = [
  { term: "01 / Development", desc: "Next.js, TypeScript, Full-stack Architectures, Tailwind CSS, bleeding-edge deployment strategies, and Rust for high-performance systems." },
  { term: "02 / Intelligence", desc: "Heavy AI work with Python, Large Language Models, deep learning, and integrating context-aware applications into real products." },
  { term: "03 / Principles", desc: "Form follows function. Performance is a feature, never an afterthought." }
];

export function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".manifesto-item", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-[#1A1A1A] text-[#F0EDE5] py-24 md:py-40 px-6 md:px-24 flex flex-col md:flex-row justify-between gap-16 relative z-10">
      <div className="flex flex-col gap-6 md:w-1/2">
        <h2 className="text-[12vw] md:text-[8vw] font-black uppercase tracking-tighter leading-[0.85]" style={{ fontFamily: "var(--font-heading)" }}>
          The <span className="text-[#FF9E9E]">Stack</span> & Mindset
        </h2>
        <p className="text-xl md:text-2xl font-medium opacity-80 leading-relaxed max-w-lg mt-6">
          My approach: ship fast, ship thoughtfully. I value maintainable code, clear UI, and using the right tool for the job whether that&apos;s TypeScript, React, or the latest in AI. Every project is a chance to learn and raise the bar.
        </p>
      </div>

      <div className="flex flex-col gap-12 md:w-1/2 mt-12 md:mt-0">
        {ITEMS.map((item, i) => (
          <div key={i} className="manifesto-item flex flex-col gap-4 border-l-2 border-[#D9ED92] pl-8">
            <span className="text-2xl md:text-3xl font-bold uppercase tracking-tighter" style={{ fontFamily: "var(--font-heading)" }}>
              {item.term}
            </span>
            <p className="text-lg opacity-70 font-medium leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
