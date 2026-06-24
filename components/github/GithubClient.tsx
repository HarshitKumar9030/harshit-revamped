"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap } from "@/utils/gsap";

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function levelClass(level: number): string {
  switch (level) {
    case 4: return "bg-[#1A1A1A]";
    case 3: return "bg-[#4A4A4A]";
    case 2: return "bg-[#7A7A7A]";
    case 1: return "bg-[#A3A3A3]";
    default: return "bg-[#E5E2DA]";
  }
}

// --- 3D Hover Card Component ---
function TiltCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Calculate rotation based on mouse position relative to card center
    const x = (e.clientX - rect.left - rect.width / 2) / 25; 
    const y = -(e.clientY - rect.top - rect.height / 2) / 25;
    setTilt({ x, y, active: true });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0, active: false });

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transform: tilt.active
          ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale3d(1.02, 1.02, 1.02)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: tilt.active ? "transform 0.1s ease-out" : "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Optional: Add an inner shadow/glare that moves opposite to the tilt for extra realism */}
      {children}
    </div>
  );
}

// --- Main Layout ---
export default function GithubClient({ data }: { data: any }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { profile, totalContributions, isLoaded, heatmapDays, metrics, peakLabel, username } = data;

  useGSAP(() => {
    registerGsap();
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
      }
    });

    // Reveal Header
    tl.fromTo(".gh-header", 
      { y: 60, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }
    );

    // Stagger in the 3D grid cards
    tl.fromTo(".gh-card", 
      { y: 100, opacity: 0, rotateX: 10 },
      { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)" },
      "-=0.6"
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="github" className="relative w-full bg-[#2A2A2A] px-6 py-24 md:px-24 md:py-32 flex flex-col justify-center overflow-hidden">
      
      {/* Header with Launching Arrow */}
      <div className="gh-header z-10 shrink-0 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <h2 className="text-[#F0EDE5] text-[12vw] md:text-[8vw] font-bold uppercase tracking-tighter mix-blend-difference leading-none" style={{ fontFamily: "var(--font-heading)" }}>
          GitHub Signal
        </h2>
        
        <Link
          href={profile?.htmlUrl ?? `https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 text-[#F0EDE5] hover:text-[#D9ED92] transition-colors duration-300 pb-2 md:pb-6 cursor-pointer"
        >
          <span className="text-sm font-bold tracking-widest uppercase">
            @{profile?.login ?? username}
          </span>
          
          {/* Animated Launch Arrow */}
          <div className="relative w-6 h-6 overflow-hidden flex items-center justify-center">
            {/* Initial Arrow (Flys out top-right) */}
            <svg className="absolute w-6 h-6 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
            {/* Replacement Arrow (Flys in from bottom-left) */}
            <svg className="absolute w-6 h-6 -translate-x-[150%] translate-y-[150%] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-0 group-hover:translate-y-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        
        <TiltCard className="gh-card lg:col-span-2 bg-[#D9ED92] p-8 md:p-12 flex flex-col justify-between text-[#2A2A2A] shadow-[0_20px_40px_rgba(0,0,0,0.15)] cursor-default">
          <span className="text-sm font-bold tracking-widest uppercase mb-16">Annual Commits</span>
          <div>
            <h3 className="text-[15vw] md:text-[8vw] font-bold leading-none tracking-tighter" style={{ fontFamily: "var(--font-heading)" }}>
              {isLoaded ? formatNumber(totalContributions) : "—"}
            </h3>
            <p className="text-lg md:text-3xl max-w-lg leading-tight font-medium mt-4">
              Total public commits, PRs, and issues pushed this year.
            </p>
          </div>
        </TiltCard>

        <TiltCard className="gh-card bg-[#FF9E9E] p-8 md:p-12 flex flex-col justify-between text-[#2A2A2A] shadow-[0_20px_40px_rgba(0,0,0,0.15)] cursor-default">
          <span className="text-sm font-bold tracking-widest uppercase mb-16">Current Rhythm</span>
          <div>
            <h3 className="text-[15vw] md:text-[8vw] font-bold leading-none tracking-tighter" style={{ fontFamily: "var(--font-heading)" }}>
              {isLoaded ? metrics.currentStreak : "—"}
            </h3>
            <p className="text-lg md:text-3xl leading-tight font-medium mt-4">Day streak</p>
          </div>
        </TiltCard>

        <TiltCard className="gh-card lg:col-span-2 bg-[#F0EDE5] p-8 md:p-12 flex flex-col justify-between text-[#2A2A2A] shadow-[0_20px_40px_rgba(0,0,0,0.15)] cursor-default">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-sm font-bold tracking-widest uppercase block mb-2">Last 8 Weeks</span>
              <p className="text-sm md:text-base font-medium max-w-sm">The 56-day public work rhythm compressed into a single grid.</p>
            </div>
            <span className="text-sm font-bold tracking-widest uppercase bg-[#2A2A2A] text-[#F0EDE5] px-4 py-2 rounded-none md:rounded-sm">
              Peak: {isLoaded ? peakLabel : "—"}
            </span>
          </div>

          <div className="grid grid-flow-col grid-rows-7 gap-1.5 md:gap-2 overflow-hidden w-max">
            {heatmapDays.map((day: any) => (
              <div
                key={day.date}
                title={day.date.length > 10 ? `${day.date}: ${day.count} contributions` : `${day.date} · ${day.count} contributions`}
                className={`h-4 w-4 md:h-6 md:w-6 rounded-[2px] transition-transform duration-300 hover:scale-125 ${levelClass(day.level)}`}
              />
            ))}
          </div>
        </TiltCard>

        <TiltCard className="gh-card bg-[#D3D0C7] p-8 md:p-12 flex flex-col justify-between text-[#2A2A2A] shadow-[0_20px_40px_rgba(0,0,0,0.15)] cursor-default">
          <span className="text-sm font-bold tracking-widest uppercase mb-10 block">Metrics</span>
          
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end border-b border-[#2A2A2A]/20 pb-3">
              <span className="text-lg font-medium">Followers</span>
              <span className="text-3xl font-bold tracking-tighter" style={{ fontFamily: "var(--font-heading)" }}>
                {isLoaded ? formatNumber(profile?.followers ?? 0) : "—"}
              </span>
            </div>
            <div className="flex justify-between items-end border-b border-[#2A2A2A]/20 pb-3">
              <span className="text-lg font-medium">Repositories</span>
              <span className="text-3xl font-bold tracking-tighter" style={{ fontFamily: "var(--font-heading)" }}>
                {isLoaded ? formatNumber(profile?.publicRepos ?? 0) : "—"}
              </span>
            </div>
            <div className="flex justify-between items-end border-b border-[#2A2A2A]/20 pb-3">
              <span className="text-lg font-medium">Longest Streak</span>
              <span className="text-3xl font-bold tracking-tighter" style={{ fontFamily: "var(--font-heading)" }}>
                {isLoaded ? metrics.longestStreak : "—"}
              </span>
            </div>
          </div>
        </TiltCard>

      </div>
    </section>
  );
}