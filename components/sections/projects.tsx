"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/utils/gsap";
import { PROJECTS } from "@/constants";

export function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    registerGsap();
    const slider = scrollRef.current;
    if (!slider) return;

    gsap.to(slider, {
      x: () => -(slider.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () =>
          "+=" +
          (Math.max(slider.scrollWidth - window.innerWidth, 0) +
            window.innerHeight * 0.75),
        pin: true,
        scrub: 1,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section id="work" ref={sectionRef} className="relative h-screen w-full bg-[#2A2A2A] flex flex-col justify-center overflow-hidden">
      <div className="absolute top-24 left-6 md:left-24 z-10 shrink-0">
        <h2 className="text-[#F0EDE5] text-[10vw] md:text-[6vw] font-bold uppercase tracking-tighter mix-blend-difference" style={{ fontFamily: "var(--font-heading)" }}>
          Selected Works
        </h2>
      </div>
      
      <div ref={scrollRef} className="flex h-[60vh] md:h-[55vh] items-center px-6 md:px-24 gap-12 md:gap-24 w-max translate-y-12">
        {PROJECTS.map((p, i) => (
          <a key={i} href={p.link || "#"} target="_blank" rel="noopener noreferrer" className="h-full w-[85vw] md:w-[60vw] shrink-0 flex flex-col justify-between p-8 md:p-12 border-none group cursor-pointer transition-transform duration-500 hover:scale-[1.02]" style={{ backgroundColor: p.color }}>
            <h3 className="text-[10vw] md:text-[6vw] font-bold leading-none tracking-tighter text-[#2A2A2A] flex items-center gap-4" style={{ fontFamily: "var(--font-heading)" }}>
              {p.title}
              {p.link && (
                <svg className="w-8 h-8 md:w-12 md:h-12 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" viewBox="0 0 24 24" fill="none" stroke="#D9ED92" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              )}
            </h3>
            <div className="flex flex-col gap-4">
              <p className="text-lg md:text-3xl text-[#2A2A2A] max-w-lg leading-tight font-medium">{p.desc}</p>
              <span className="text-sm font-bold tracking-widest text-[#2A2A2A]">{p.tech}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
