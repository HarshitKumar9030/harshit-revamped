"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/utils/gsap";

export function AnimeSpotlight() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useGSAP(() => {
    registerGsap();
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      }
    });

    tl.to(".anime-bg", {
      scale: 1.1,
      ease: "none",
    }, 0).fromTo(".anime-text", {
      x: "-10%",
    }, {
      x: "10%",
      ease: "none",
    }, 0);

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      onClick={() => setIsActive(!isActive)}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A] z-10 cursor-pointer lg:cursor-default"
    >
      <div className="absolute inset-0 z-0 w-full h-full anime-bg">
        <Image
          src="https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2000&auto=format&fit=crop"
          alt="Japanese Architecture Aesthetic"
          fill
          className={`object-cover mix-blend-luminosity transition-all duration-2000 ${isActive ? 'opacity-100 grayscale-0' : 'opacity-60 grayscale md:hover:opacity-100 md:hover:grayscale-0'}`}
        />
        <div className="absolute inset-0 mix-blend-multiply bg-[#BE2A2A] opacity-30 pointer-events-none"></div>
        <div className="absolute inset-0 bg-linear-to-b from-[#0A0A0A]/80 via-transparent to-[#0A0A0A]/90 pointer-events-none"></div>
      </div>
      
      <div className="relative z-10 w-full flex flex-col items-center justify-center pointer-events-none mix-blend-difference">
        <span className="uppercase text-lg font-bold tracking-[0.5em] text-[#F0EDE5] opacity-80 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
          Digital Visceralism
        </span>
        <h2 
          className="anime-text text-[15vw] md:text-[18vw] font-bold text-[#F0EDE5] tracking-tight leading-none text-center whitespace-nowrap mb-4" 
        >
          限界を超えろ
        </h2>
        <h3 className="text-[6vw] md:text-[8vw] font-bold text-transparent mt-[-2%] tracking-tight" style={{ fontFamily: "var(--font-heading)", WebkitTextStroke: "2px #F0EDE5" }}>
          BEYOND LIMITS
        </h3>
      </div>
    </section>
  );
}
