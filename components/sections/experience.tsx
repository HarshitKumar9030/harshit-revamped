"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/utils/gsap";

const EXPERIENCES = [
  {
    year: "Current",
    role: "Full-Stack Dev",
    company: "Freelance",
    desc: "End-to-End Modern Web Apps"
  },
  {
    year: "Recent",
    role: "AI & LLM Integration",
    company: "Independent",
    desc: "Intelligent AI Features"
  },
  {
    year: "Ongoing",
    role: "Project Architecture",
    company: "Open Source",
    desc: "TypeScript, Node.js & Rust"
  }
];

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    registerGsap();
    
    gsap.from(".exp-col", {
      scaleY: 0,
      transformOrigin: "bottom center",
      duration: 1,
      stagger: 0.1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
      }
    });

    gsap.from(".exp-text", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.5,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-[#111] text-[#F0EDE5] py-24 md:py-32 overflow-hidden">
      <div className="px-6 md:px-24 mb-20 flex flex-col gap-4">
        <h2 className="text-[14vw] md:text-[10vw] font-black uppercase tracking-tighter leading-none text-transparent mix-blend-difference" style={{ fontFamily: "var(--font-heading)", WebkitTextStroke: "2px #D9ED92" }}>
          TIMELINE
        </h2>
      </div>

      <div className="flex flex-col md:flex-row w-full h-auto md:h-[60vh] border-y-2 border-[#D9ED92]">
        {EXPERIENCES.map((exp, i) => (
          <div 
            key={i} 
            className="exp-col flex-1 border-b-2 md:border-b-0 md:border-r-2 border-[#D9ED92] bg-[#D9ED92] text-[#111] p-8 md:p-12 flex flex-col justify-between hover:bg-[#FF9E9E] transition-colors duration-500 group relative overflow-hidden"
          >
            <div className="exp-text text-6xl md:text-8xl font-black opacity-20 tracking-tighter mix-blend-color-burn transition-all duration-300 group-hover:opacity-40" style={{ fontFamily: "var(--font-heading)" }}>
              {exp.year}
            </div>
            <div className="exp-text flex flex-col gap-4 mt-16 md:mt-0">
              <h3 className="text-4xl md:text-5xl font-black uppercase leading-none tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                {exp.role}
              </h3>
              <div className="w-full h-[2px] bg-[#111]"></div>
              <div className="flex justify-between items-end">
                <span className="font-bold uppercase tracking-widest text-sm">{exp.company}</span>
                <span className="text-xs font-mono font-medium max-w-[150px] text-right tracking-tight">{exp.desc}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
