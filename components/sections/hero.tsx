"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/utils/gsap";
import Image from "next/image";

export function Hero() {
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    registerGsap();
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      if (!desktopRef.current) {
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: desktopRef.current,
          start: "top top",
          end: "+=180%",
          scrub: true,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      tl.to(desktopRef.current.querySelector(".hero-img-container"), {
        width: "100%",
        height: "100vh",
        borderRadius: "0%",
        ease: "power2.inOut",
      }, 0)
        .to(desktopRef.current.querySelector(".hero-text-bottom"), {
          y: -100,
          opacity: 0,
        }, 0)
        .to(desktopRef.current.querySelector(".hero-text-top"), {
          y: 100,
          opacity: 0,
        }, 0);
    });

    mm.add("(max-width: 767px)", () => {
      if (!mobileRef.current) {
        return;
      }

      const tlMobile = gsap.timeline({
        scrollTrigger: {
          trigger: mobileRef.current,
          start: "top top",
          end: "+=180%",
          scrub: true,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      tlMobile.to(mobileRef.current.querySelector(".hero-img-container"), {
        width: "100%",
        height: "100vh",
        borderRadius: "0%",
        ease: "power2.inOut",
      }, 0)
        .to(mobileRef.current.querySelector(".hero-text-bottom"), {
          y: -100,
          opacity: 0,
        }, 0)
        .to(mobileRef.current.querySelector(".hero-text-top"), {
          y: 100,
          opacity: 0,
        }, 0);
    });

    return () => mm.revert();
  });

  return (
    <>
      {/* DESKTOP HERO */}
      <section ref={desktopRef} className="hidden md:flex relative h-screen w-full items-center justify-center bg-[#F0EDE5] overflow-hidden">
        <h1 className="hero-text-top absolute top-[10%] text-[12vw] font-bold leading-none tracking-tighter text-[#2A2A2A] z-0" style={{ fontFamily: "var(--font-heading)" }}>HARSHIT</h1>
        
        <div className="hero-img-container relative w-[40vh] h-[50vh] rounded-[40px] overflow-hidden z-10 will-change-transform">
          <Image
            src="/pix.jpg"
            alt="Harshit"
            fill
            className="object-cover grayscale"
            priority
          />
          <div className="absolute inset-0 bg-[#E5EBF5] mix-blend-multiply opacity-50 pointer-events-none" />
        </div>

        <h1 className="hero-text-bottom absolute bottom-[10%] text-[10vw] font-bold leading-none tracking-tighter text-[#2A2A2A] z-0" style={{ fontFamily: "var(--font-heading)" }}>SINGH</h1>
      </section>

      {/* MOBILE HERO */}
      <section ref={mobileRef} className="flex md:hidden relative h-[100svh] w-full items-center justify-center bg-[#F0EDE5] overflow-hidden">
        <h1 className="hero-text-top absolute top-[12%] text-[16vw] font-bold leading-none tracking-tighter text-[#2A2A2A] z-0" style={{ fontFamily: "var(--font-heading)" }}>HARSHIT</h1>
        
        <div className="hero-img-container relative w-[72vw] h-[48vh] rounded-[40px] overflow-hidden z-10 will-change-transform">
          <Image
            src="/pix.jpg"
            alt="Harshit"
            fill
            className="object-cover grayscale"
            priority
          />
          <div className="absolute inset-0 bg-[#E5EBF5] mix-blend-multiply opacity-50 pointer-events-none" />
        </div>

        <h1 className="hero-text-bottom absolute bottom-[12%] text-[15vw] font-bold leading-none tracking-tighter text-[#2A2A2A] z-0" style={{ fontFamily: "var(--font-heading)" }}>SINGH</h1>
      </section>
    </>
  );
}
