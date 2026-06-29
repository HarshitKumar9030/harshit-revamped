"use client";
import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap } from "@/utils/gsap";
import { ArrowUpRight, X } from "lucide-react";

const PLANS = [
  {
    name: "Launch Page",
    price: "15k",
    color: "#D9ED92",
    text: "#2A2A2A",
    description: "a single page site with killer ui built to feel sharp fast and impossible to forget",
    perks: ["hero-first storytelling", "motion heavy sections", "tuned for speed"],
    footer: "perfect for personal brands startups or getting a fast concept out there",
  },
  {
    name: "Section Add-on",
    price: "+1k",
    color: "#D3D0C7",
    text: "#2A2A2A",
    description: "when your site needs to grow each new section gets priced on its own so we keep things simple",
    perks: ["scales with your scope", "keeps the homepage focused", "works with any stack"],
    footer: "keeps the base light while making sure the design stays looking expensive",
  },
  {
    name: "CMS Website",
    price: "30k–40k",
    color: "#FF9E9E",
    text: "#2A2A2A",
    description: "a polished site with a full cms so you can drop in new content without calling me every time",
    perks: ["easy content updates", "admin friendly workflows", "seo ready structure"],
    footer: "for teams that want full control without ruining the visual system",
  },
  {
    name: "Traffic / Custom",
    price: "80k+",
    color: "#F0EDE5",
    text: "#2A2A2A",
    description: "for sites getting real traffic or needing complex flows custom scope is the only way to go",
    perks: ["high traffic architecture", "custom ux systems", "scalable performance"],
    footer: "if you expect a lot of eyes custom is the safer and better choice",
  },
];

export function MyPlans() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  useGSAP(() => {
    registerGsap();
    gsap.registerPlugin(ScrollTrigger);

    // Animate Header
    gsap.fromTo(
      ".plans-header",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );

    // Individual scroll triggers for each card
    const cards = gsap.utils.toArray<HTMLElement>(".plan-card");
    
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { 
          y: 120, 
          opacity: 0,
          scale: 0.95,
          rotateX: 5 // subtle 3D tilt on enter
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 0.8,
          ease: "back.out(1.2)", // snappy brutalist bounce
          scrollTrigger: {
            trigger: card,
            start: "top 85%", // Triggers right as the card peeks into the bottom 15% of the screen
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <>
      <section id="plans" ref={sectionRef} className="relative w-full bg-[#2A2A2A] px-6 py-24 md:px-24 md:py-32 flex flex-col justify-center perspective-[1000px]">
        
        {/* Header */}
        <div className="plans-header mb-16 md:mb-24">
          <h2 className="text-[#F0EDE5] text-[12vw] md:text-[8vw] font-bold tracking-tighter leading-none" style={{ fontFamily: "var(--font-heading)" }}>
            Website Plans
          </h2>
          <p className="mt-6 max-w-2xl text-xl md:text-3xl text-[#F0EDE5]/70 leading-tight font-medium">
            simple pricing amazing ui and fast sites for every build
          </p>
        </div>
        
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          
          {PLANS.map((p, i) => (
            <div 
              key={i} 
              onClick={() => setIsModalOpen(true)}
              className="plan-card flex flex-col justify-between p-8 md:p-12 min-h-[500px] md:min-h-[600px] border-none group cursor-pointer transition-transform duration-500 hover:scale-[1.02]" 
              style={{ backgroundColor: p.color, color: p.text }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setIsModalOpen(true)}
            >
              
              {/* Top: Name & Animated Arrow */}
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-[10vw] md:text-[5.5vw] font-bold leading-none tracking-tighter" style={{ fontFamily: "var(--font-heading)" }}>
                  {p.name}
                </h3>
                
                <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden shrink-0 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  <svg className="absolute w-full h-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                  <svg className="absolute w-full h-full -translate-x-[150%] translate-y-[150%] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-0 group-hover:translate-y-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </div>
              </div>

              {/* Middle: Description & Perks */}
              <div className="flex flex-col gap-6 mt-12 md:mt-auto mb-12">
                <p className="text-lg md:text-3xl max-w-lg leading-tight font-medium">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {p.perks.map((perk, idx) => (
                    <span key={idx} className="text-base md:text-xl font-bold flex items-center gap-3">
                      <span className="w-2.5 h-2.5 bg-current" />
                      {perk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom: Use Case & Price */}
              <div className="flex flex-col-reverse md:flex-row md:items-end justify-between gap-8 border-t-4 border-current/20 pt-8">
                <div className="max-w-[280px]">
                  <p className="text-base font-bold opacity-50 mb-1">target use case</p>
                  <p className="text-lg md:text-xl font-bold leading-tight">{p.footer}</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[12vw] md:text-[6vw] font-bold leading-none tracking-tighter" style={{ fontFamily: "var(--font-heading)" }}>
                    {p.price}
                  </span>
                  <span className="text-2xl md:text-3xl font-bold opacity-60">
                    INR
                  </span>
                </div>
              </div>

            </div>
          ))}

          {/* The Fine Print blocks */}
          <div className="plan-card lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-6 md:mt-10 origin-center">
            <div 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1A1A1A] p-8 md:p-12 text-[#F0EDE5] border-none transition-transform duration-500 hover:scale-[1.02] cursor-pointer group h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <p className="text-3xl md:text-4xl font-bold tracking-tight">Maintenance</p>
                  <ArrowUpRight className="w-8 h-8 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-[#D9ED92]" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-[#D9ED92] mt-2">999 / mo recurring</p>
              </div>
              <p className="text-lg md:text-2xl font-medium leading-tight mt-12 md:mt-16 opacity-80 max-w-md">
                best for low scale sites where the workload stays super chill and stable
              </p>
            </div>

            <div 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1A1A1A] p-8 md:p-12 text-[#F0EDE5] border-none transition-transform duration-500 hover:scale-[1.02] cursor-pointer group h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <p className="text-3xl md:text-4xl font-bold tracking-tight">Traffic rule</p>
                  <ArrowUpRight className="w-8 h-8 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-[#FF9E9E]" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-[#FF9E9E] mt-2">Custom preferred</p>
              </div>
              <p className="text-lg md:text-2xl font-medium leading-tight mt-12 md:mt-16 opacity-80 max-w-md">
                high traffic means tailored caching and architecture generic plans just break under scale
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Connect Modal Overlay */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isModalOpen ? "opacity-100 visible bg-[#111111]/80 backdrop-blur-md" : "opacity-0 invisible bg-transparent backdrop-blur-none"
        }`}
        onClick={() => setIsModalOpen(false)}
      >
        <div 
          className={`relative w-full max-w-3xl bg-[#F0EDE5] text-[#2A2A2A] p-8 md:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.5)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            isModalOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-12"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 p-2 text-[#2A2A2A] hover:opacity-50 transition-opacity"
            aria-label="Close modal"
          >
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          <h3 className="text-5xl md:text-7xl font-black tracking-tighter mb-12" style={{ fontFamily: "var(--font-heading)" }}>
            Let&apos;s Talk
          </h3>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4 font-bold text-2xl md:text-4xl tracking-tight">
              <a href="mailto:hey@harshit.page" className="hover:text-[#D9ED92] transition-colors duration-300 flex items-center gap-3 group w-fit">
                <span className="w-0 group-hover:w-6 transition-all duration-300 h-1.5 md:h-2 bg-[#D9ED92]"></span>
                hey@harshit.page
              </a>
              <a href="mailto:harshitkumar9030@gmail.com" className="hover:text-[#FF9E9E] transition-colors duration-300 flex items-center gap-3 group w-fit">
                <span className="w-0 group-hover:w-6 transition-all duration-300 h-1.5 md:h-2 bg-[#FF9E9E]"></span>
                harshitkumar9030@gmail.com
              </a>
            </div>

            <div className="border-t-4 border-[#2A2A2A]/10 pt-8 flex flex-col gap-4 font-bold text-2xl md:text-4xl tracking-tight">
              <a href="https://github.com/harshitkumar9030" target="_blank" rel="noopener noreferrer" className="hover:text-[#DBC2FC] transition-colors duration-300 flex items-center gap-3 group w-fit">
                <span className="w-0 group-hover:w-6 transition-all duration-300 h-1.5 md:h-2 bg-[#DBC2FC]"></span> 
                Github
              </a>
              <a href="https://www.linkedin.com/in/harshit-singh-44a029371/" target="_blank" rel="noopener noreferrer" className="hover:text-[#A2C3E8] transition-colors duration-300 flex items-center gap-3 group w-fit">
                <span className="w-0 group-hover:w-6 transition-all duration-300 h-1.5 md:h-2 bg-[#A2C3E8]"></span> 
                LinkedIn
              </a>
              <a href="https://instagram.com/_harshit.xd" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF9E9E] transition-colors duration-300 flex items-center gap-3 group w-fit">
                <span className="w-0 group-hover:w-6 transition-all duration-300 h-1.5 md:h-2 bg-[#FF9E9E]"></span> 
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}