import Link from "next/link";
import { getAllScrawls } from "@/lib/mdx";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/sections/footer";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { ScrawlSearch } from "./ScrawlSearch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Scrawls",
  description: "Browse all writings, technical notes, and observations.",
  openGraph: {
    title: "All Scrawls",
    description: "Browse all writings, technical notes, and observations.",
    images: [{ url: "/ogimagep.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Scrawls",
    description: "Browse all writings, technical notes, and observations.",
    images: ["/ogimagep.png"],
  },
};

export default async function AllScrawlsIndex() {
  const scrawls = await getAllScrawls();

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-[#FDFBF7] text-[#111111] selection:bg-[#D9ED92] selection:text-[#111111] flex flex-col pt-32 px-4 md:px-12 relative overflow-hidden font-sans">
        
        <main className="max-w-[1400px] w-full mx-auto relative z-10 flex flex-col gap-12 pb-32">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-4 border-b border-[#111111]/10 pb-8">
            <h1 
              className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] text-[#111111]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              ALL SCRAWLS
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <ScrawlSearch scrawls={scrawls} />
              <Link href="/scrawl" className="bg-[#EAE5D9]/50 hover:bg-[#EAE5D9] transition-colors rounded-full px-8 py-4 flex items-center gap-4 group self-start mb-4">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
                <span className="font-medium text-sm text-[#111111] tracking-wide">Back</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {scrawls.map((scrawl, i) => (
              <Link 
                key={`${scrawl.slug}-${i}`} 
                href={`/scrawl/${scrawl.slug}`}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 bg-[#EAE5D9]/30 hover:bg-[#D9ED92] transition-colors rounded-3xl"
              >
                <div className="flex flex-col gap-2 max-w-2xl">
                  <div className="flex gap-4 items-center text-xs font-bold uppercase tracking-widest text-[#111111]/40">
                    <span>{new Date(scrawl.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric'})}</span>
                    <span className="w-1 h-1 bg-[#111111]/20 rounded-full"></span>
                    <span>{scrawl.tags?.[0] || 'Insight'}</span>
                  </div>
                  <h2 
                    className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-[#111111] group-hover:text-[#111111] transition-colors" 
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {scrawl.title}
                  </h2>
                  {scrawl.excerpt && (
                    <p className="text-sm font-medium text-[#111111]/60 line-clamp-2 mt-2 leading-relaxed">
                      {scrawl.excerpt}
                    </p>
                  )}
                </div>
                
                <div className="w-12 h-12 rounded-full bg-[#111111] mix-blend-difference flex items-center justify-center shrink-0 self-start md:self-center transition-transform group-hover:scale-110">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </Link>
            ))}
            
            {scrawls.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-lg font-medium text-[#111111]/40 uppercase tracking-widest">No scrawls found yet.</p>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}