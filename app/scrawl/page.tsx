import Link from "next/link";
import Image from "next/image";
import { getAllScrawls } from "@/lib/mdx";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/sections/footer";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scrawl",
  description: "Writings and notes on interactive web applications, AI, and software engineering.",
  openGraph: {
    title: "Scrawl",
    description: "Writings and notes on interactive web applications, AI, and software engineering.",
    images: [{ url: "/ogimagep.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scrawl",
    description: "Writings and notes on interactive web applications, AI, and software engineering.",
    images: ["/ogimagep.png"],
  },
};

const getPlaceholderImage = (i: number) => {
  const images = [
    "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2000&auto=format&fit=crop", // Left huge
    "", // middle green
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop", // right blue img
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop", // bottom mid
    "" // bottom right
  ];
  return images[i % 5];
};

export default async function ScrawlIndex() {
  const scrawls = await getAllScrawls();
  
  // Fill array for testing the layout so the Bento box is fully populated
  const displayScrawls = [...scrawls, ...scrawls, ...scrawls, ...scrawls, ...scrawls].slice(0, 5);

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-[#FDFBF7] text-[#111111] selection:bg-[#D9ED92] selection:text-[#111111] flex flex-col pt-32 px-4 md:px-12 relative overflow-hidden font-sans">
        
        <main className="max-w-[1400px] w-full mx-auto relative z-10 flex flex-col gap-12 pb-32">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-4">
            <h1 
              className="text-8xl md:text-[10vw] font-black tracking-tighter uppercase leading-[0.8] text-[#111111]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              SCRAWL
            </h1>
            <Link href="/scrawl/all" className="bg-[#EAE5D9]/50 hover:bg-[#EAE5D9] transition-colors rounded-full px-8 py-4 flex items-center gap-4 group self-start md:self-auto mb-4">
              <span className="font-medium text-sm text-[#111111] tracking-wide">Read Our Scrawls</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {/* Bento Box Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[450px]">
            {displayScrawls.map((scrawl, i) => {
              const idx = i % 5;
              const img = scrawl.image || getPlaceholderImage(i);

              if (idx === 0) {
                return (
                  <Link
                    key={`${scrawl.slug}-${i}`}
                    href={`/scrawl/${scrawl.slug}`}
                    className="col-span-1 md:col-span-5 row-span-2 relative bg-[#EAE5D9] rounded-[2.5rem] overflow-hidden group flex flex-col justify-end"
                  >
                    {img && <Image src={img} alt="Post Cover" fill className="object-cover absolute inset-0 z-0 grayscale-[0.2] group-hover:scale-105 group-hover:grayscale-0 transition-transform duration-[2000ms]" />}
                    
                    <div className="absolute top-8 left-8 w-12 h-12 bg-[#FDFBF7]/40 backdrop-blur-md rounded-full flex items-center justify-center text-xl z-20">🔥</div>

                    <div className="relative z-10 bg-[#FDFBF7] w-[90%] rounded-tr-[2.5rem] pt-8 pr-12 pb-2">
                       <div className="absolute bottom-full left-0 w-12 h-12 bg-transparent rounded-bl-[2.5rem] shadow-[-1.5rem_1.5rem_0_0_#FDFBF7] pointer-events-none"></div>

                       <div className="flex gap-2 items-center text-xs font-bold uppercase tracking-widest text-white/40 mb-4 mix-blend-difference">
                        <span className="text-white/20">{scrawl.tags?.[0] || 'Insight'}</span>
                        <span className="w-[1px] h-3 bg-[#111]/20"></span>
                        <span>{new Date(scrawl.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</span>
                       </div>
                       <h2 className="text-3xl md:text-[2.75rem] p-1 font-black uppercase tracking-tighter leading-[0.9] text-[#111111]" style={{ fontFamily: 'var(--font-heading)' }}>
                         {scrawl.title} 
                       </h2>
                    </div>
                  </Link>
                );
              }

              if (idx === 1) {
                return (
                  <Link
                    key={`${scrawl.slug}-${i}`}
                    href={`/scrawl/${scrawl.slug}`}
                    className="col-span-1 md:col-span-4 row-span-1 bg-[#D9ED92] rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between group overflow-hidden relative"
                  >
                    <div className="absolute top-8 right-8 w-10 h-10 bg-[#FDFBF7]/80 rounded-full flex items-center justify-center group-hover:bg-[#FDFBF7] group-hover:scale-110 transition-all z-20">
                       <ArrowUpRight className="w-5 h-5 text-[#111]" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div className="text-xs font-bold uppercase tracking-widest text-[#111]/50 mb-6">
                        <span className="text-[#111]">{scrawl.tags?.[0] || 'Insight'}</span> . Web
                      </div>
                      
                      <div className="flex flex-col gap-6">
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] text-[#111111]" style={{ fontFamily: 'var(--font-heading)' }}>
                          {scrawl.smallTitle || scrawl.title}
                        </h2>
                        <p className="text-xs md:text-sm font-medium text-[#111]/60 leading-relaxed max-w-[90%]">
                          {scrawl.excerpt}... <span className="underline decoration-[#111]/30 underline-offset-4">More</span>
                        </p>
                      </div>

                      <div className="w-full flex justify-between items-center border-t border-[#111]/10 pt-4 mt-6">
                         <span className="text-xs font-bold uppercase tracking-widest text-[#111]/60">Read More</span>
                         <ArrowRight className="w-4 h-4 opacity-30 text-[#111]" />
                      </div>
                    </div>
                    <div className="absolute top-[20%] right-[-10%] w-[80%] h-[150%] rounded-full border-[40px] border-[#C3D784]/30 pointer-events-none transition-transform duration-1000 group-hover:scale-105"></div>
                  </Link>
                );
              }

              if (idx === 2) {
                return (
                  <Link
                      key={`${scrawl.slug}-${i}`}
                      href={`/scrawl/${scrawl.slug}`}
                      className="col-span-1 md:col-span-3 row-span-1 bg-[#D3E4ED] rounded-[2.5rem] overflow-hidden flex flex-col justify-between relative group"
                    >
                      {img && <Image src={img} alt="Post Cover" fill className="object-cover absolute inset-0 z-0 grayscale-[0.2] mix-blend-multiply opacity-50 group-hover:opacity-80 group-hover:grayscale-0 transition-all duration-1000" />}
                      
                      <div className="relative z-10 p-8 pb-32 mix-blend-color-burn">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#111]/60 mb-3">
                          <span className="text-[#111]">Category</span> . {scrawl.tags?.[0] || 'Insight'} <br/>
                          <span className="text-[#9A8CFF]">Hot</span> . {new Date(scrawl.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                        </div>
                        <h2 className="text-3xl md:text-3xl font-black uppercase tracking-tighter leading-[0.9] text-[#111111]" style={{ fontFamily: 'var(--font-heading)' }}>
                          {scrawl.smallTitle || scrawl.title}
                        </h2>
                      </div>
                    </Link>
                );
              }

              if (idx === 3) {
                 return (
                  <Link
                    key={`${scrawl.slug}-${i}`}
                    href={`/scrawl/${scrawl.slug}`}
                    className="col-span-1 md:col-span-4 row-span-1 relative bg-[#C0A89D] rounded-[2.5rem] overflow-hidden group flex flex-col justify-end p-8"
                  >
                    {img && <Image src={img} alt="Post Cover" fill className="object-cover absolute inset-0 z-0 grayscale-[0.3] group-hover:scale-105 group-hover:grayscale-0 transition-transform duration-1000" />}
                    <div className="absolute inset-0 transition-colors pointer-events-none" />


                    <div className="relative z-20 flex flex-col gap-2">
                      <div className="flex gap-2 items-center text-[10px] font-bold uppercase tracking-widest text-[#FDFBF7]">
                        <span>{scrawl.readingTime || '5'} Min</span> . <span>{new Date(scrawl.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-tight text-[#FDFBF7] max-w-[90%]" style={{ fontFamily: 'var(--font-heading)' }}>
                        {scrawl.smallTitle || scrawl.title}
                      </h2>
                    </div>
                  </Link>
                );
              }

              return (
                <div
                  key={`${scrawl.slug}-${i}`}
                  className="col-span-1 md:col-span-3 row-span-1 bg-[#DBC2FC] rounded-[2.5rem] p-8 flex flex-col justify-between group overflow-hidden relative"
                >
                   <div className="relative z-10 flex flex-wrap gap-x-2 gap-y-3">
                      {['Design', 'Interactive', 'Motion', 'React', 'ThreeJS', 'GSAP', 'NextJS'].map((pill, pIndex) => (
                        <span key={pIndex} className={`px-4 py-2 ${pIndex % 2 === 0 ? 'bg-[#FDFBF7]' : 'bg-[#D9ED92]'} rounded-full text-[10px] font-bold uppercase tracking-widest text-[#111111] transition-transform hover:-translate-y-1 cursor-default mix-blend-luminosity`}>
                          {pill}
                        </span>
                      ))}
                   </div>

                   <Link href="/scrawl/tags" className="relative z-10 flex justify-between items-end w-full group cursor-pointer block mt-4">
                     <h2 className="text-lg font-black tracking-tighter text-[#111111] leading-none mb-2 uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
                       View All Tags
                     </h2>
                     <button className="w-14 h-14 bg-[#FDFBF7] rounded-full flex items-center justify-center z-20 relative group-hover:-rotate-45 transition-transform duration-500">
                       <ArrowRight className="w-6 h-6 text-[#111]" />
                       <div className="absolute inset-[-6px] bg-[#D9ED92] rounded-full -z-10 scale-0 group-hover:scale-100 transition-transform duration-500 delay-75 mix-blend-multiply"></div>
                     </button>
                   </Link>
                </div>
              );
            })}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
