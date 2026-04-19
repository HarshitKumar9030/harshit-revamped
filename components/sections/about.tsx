"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/utils/gsap";

const text = "Hello there! This is Harshit (LeonCyriac), a self-taught full-stack developer and student from India. I specialize in Next.js, TypeScript, and Tailwind CSS for modern web apps, use Rust for high-performance systems, and do heavy AI work with Python especially LLMs and deep learning. Always learning, always building.";

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    registerGsap();
    gsap.from(".word", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        end: "center center",
        scrub: 1,
      },
      opacity: 0.1,
      y: 20,
      stagger: 0.1,
      ease: "none"
    });
  }, { scope: containerRef });

  return (
    <section id="about" ref={containerRef} className="min-h-screen bg-[#F5E6E8] flex items-center px-6 md:px-24 py-32 z-10 relative">
      <div className="max-w-6xl">
        <h2 className="text-[10vw] md:text-[6vw] leading-[1.1] font-medium tracking-tight text-[#2A2A2A] flex flex-wrap gap-x-3 gap-y-2">
          {text.split(" ").map((word, i) => (
            <span key={i} className="word inline-block">{word}</span>
          ))}
        </h2>
      </div>
    </section>
  );
}
