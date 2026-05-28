import { Metadata } from "next";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/sections/footer";
import { GooeyMask } from "@/components/experiments/gooey-mask";
import { SmoothTextMorph } from "@/components/experiments/smooth-text-morph";
import AmbientDeck from "@/components/experiments/ambient-deck";
import { LaptopFrame } from "@/components/ui/laptop-frame";
import { CodeBlockShell } from "@/components/ui/code-block-shell";
import { gooeyMaskCode, smoothTextMorphCode, ambientDeckCode } from "@/constants/experiments-code";
import { codeToHtml } from "shiki";

export const metadata: Metadata = {
  title: "Experiments | Harshit's Scrawl & Web Components",
  description: "A scratchpad of interactive animations, spring physics, React components, and creative developer experiments.",
  openGraph: {
    title: "Experiments | Harshit",
    description: "A scratchpad of interactive animations, spring physics, React components, and creative developer experiments.",
    images: [{ url: "/ogimagep.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Experiments | Harshit",
    description: "A scratchpad of interactive animations, spring physics, React components, and creative developer experiments.",
    images: ["/ogimagep.png"],
  },
};

export default async function ExperimentsIndex() {
  const gooeyMaskHighlighted = await codeToHtml(gooeyMaskCode, {
    lang: "tsx",
    theme: "github-dark-dimmed", // or whatever dark theme fits best
  });

  const smoothTextMorphHighlighted = await codeToHtml(smoothTextMorphCode, {
    lang: "tsx",
    theme: "github-dark-dimmed",
  });

  const ambientDeckHighlighted = await codeToHtml(ambientDeckCode || "", {
    lang: "tsx",
    theme: "github-dark-dimmed",
  });

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-[#FDFBF7] text-[#111111] selection:bg-[#D9ED92] selection:text-[#111111] flex flex-col pt-32 px-4 md:px-12 relative overflow-clip font-sans">
        
        <main className="max-w-[1400px] w-full mx-auto relative z-10 flex flex-col md:flex-row gap-16 pb-32">
          
          <div className="flex flex-col gap-8 mt-4 md:w-1/4 md:sticky md:top-32 md:h-fit">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-[#111111] tracking-tighter uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
                Experiments
              </h1>
              <p className="text-lg text-[#111111]/70 leading-relaxed mt-4">
                A scratchpad for testing interactions, playing with physics, and pushing the boundaries of web components.
              </p>
            </div>
            
            <nav className="flex flex-col gap-3 mt-4 border-t border-[#111111]/10 pt-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#111111]/40 mb-2">Index</span>
              <a href="#exp-01" className="text-lg font-medium hover:italic transition-all flex items-center gap-4 group">
                <span className="text-xs font-mono text-[#111111]/40 group-hover:text-[#111111]">01</span>
                <span>Gooey Mask</span>
              </a>
              <a href="#exp-02" className="text-lg font-medium hover:italic transition-all flex items-center gap-4 group">
                <span className="text-xs font-mono text-[#111111]/40 group-hover:text-[#111111]">02</span>
                <span>Smooth Text Morph</span>
              </a>
              <a href="#exp-03" className="text-lg font-medium hover:italic transition-all flex items-center gap-4 group">
                <span className="text-xs font-mono text-[#111111]/40 group-hover:text-[#111111]">03</span>
                <span>Ambient Deck</span>
              </a>
              {/* Add more links here later */}
            </nav>
          </div>

          <div className="flex flex-col gap-32 md:w-3/4">
            {/* Experiment 01: Gooey Mask */}
            <div id="exp-01" className="flex flex-col gap-8 scroll-mt-32">
              <LaptopFrame>
                <GooeyMask />
                <div className="absolute top-8 left-8 md:top-12 md:left-12 pointer-events-none">
                  <div className="text-3xl md:text-5xl font-bold tracking-tighter text-[#111111]">
                    harshit<br/>experiments
                  </div>
                </div>
              </LaptopFrame>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-8 px-4 max-w-[1000px] mx-auto w-full">
                <div>
                  <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Gooey Mask Physics</h2>
                  <p className="text-[#111111]/70 mt-2 text-lg max-w-[30ch]">A reactive SVG filter with spring physics and mouse repulsion.</p>
                  <div className="text-sm font-medium tracking-tight bg-[#EAE5D9] px-4 py-2 rounded-full border border-[#111111]/10 mt-6 inline-block">
                    Inspired by the hero section at <a href="https://schaum.cc/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-[#111111]/30 hover:decoration-[#111111] transition-colors">schaum.cc</a>
                    
                  </div>
                </div>
                
                <div className="w-full md:w-[600px] -mt-12 -ml-0 md:-ml-8">
                  <CodeBlockShell>
                    <div 
                      className="text-[13px] leading-relaxed relative z-20 font-mono [&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:!p-0"
                      dangerouslySetInnerHTML={{ __html: gooeyMaskHighlighted }}
                    />
                  </CodeBlockShell>
                </div>
              </div>
            </div>

            {/* Experiment 02: Smooth Text Morph */}
            <div id="exp-02" className="flex flex-col gap-8 scroll-mt-32">
              <LaptopFrame>
                <SmoothTextMorph />
              </LaptopFrame>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-8 px-4 max-w-[1000px] mx-auto w-full">
                <div>
                  <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Smooth Text Morph</h2>
                  <p className="text-[#111111]/70 mt-2 text-lg max-w-[30ch]">A critically damped, scattered spring physics text morpher.</p>
                </div>
                
                <div className="w-full md:w-[600px] -mt-12 -ml-0 md:-ml-8">
                  <CodeBlockShell>
                    <div 
                      className="text-[13px] leading-relaxed relative z-20 font-mono [&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:!p-0"
                      dangerouslySetInnerHTML={{ __html: smoothTextMorphHighlighted }}
                    />
                  </CodeBlockShell>
                </div>
              </div>
            </div>

            {/* Experiment 03: Ambient Deck */}
            <div id="exp-03" className="flex flex-col gap-8 scroll-mt-32">
              <LaptopFrame>
                <AmbientDeck />
              </LaptopFrame>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-8 px-4 max-w-[1000px] mx-auto w-full">
                <div>
                  <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Ambient Deck</h2>
                  <p className="text-[#111111]/70 mt-2 text-lg max-w-[30ch]">Tinder-style card swiper with ambient dynamic background lighting mapping dominant image colors.</p>
                </div>
                
                <div className="w-full md:w-[600px] -mt-12 -ml-0 md:-ml-8">
                  <CodeBlockShell>
                    <div 
                      className="text-[13px] leading-relaxed relative z-20 font-mono [&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:!p-0"
                      dangerouslySetInnerHTML={{ __html: ambientDeckHighlighted }}
                    />
                  </CodeBlockShell>
                </div>
              </div>
            </div>
            
            {/* Future experiments will go here */}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}