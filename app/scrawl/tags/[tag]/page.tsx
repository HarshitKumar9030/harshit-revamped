import { getScrawlBySlug, getAllScrawls } from "@/lib/mdx";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/sections/footer";
import { Metadata } from "next";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag).toUpperCase();
  return { 
    title: `${decodedTag} Scrawls`,
    description: `Read technical notes and writings categorized under ${decodedTag}.`,
    openGraph: {
      title: `${decodedTag} Scrawls`,
      description: `Read technical notes and writings categorized under ${decodedTag}.`,
      images: [{ url: "/ogimagep.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedTag} Scrawls`,
      description: `Read technical notes and writings categorized under ${decodedTag}.`,
      images: ["/ogimagep.png"],
    }
  };
}

export async function generateStaticParams() {
  const scrawls = await getAllScrawls();
  const dbTags = new Set(scrawls.flatMap(s => s.tags?.map(t => t.toLowerCase()) || []));
  return Array.from(dbTags).map(tag => ({ tag }));
}

const getPlaceholderImage = (i: number) => {
  const images = [
    "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
  ];
  return images[i % 3];
};

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag).toLowerCase();
  
  const scrawls = await getAllScrawls();
  const matchedScrawls = scrawls.filter(s => 
    s.tags?.some(t => t.toLowerCase() === decodedTag)
  );

  if (matchedScrawls.length === 0) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-[#FDFBF7] text-[#111111] selection:bg-[#D9ED92] selection:text-[#111111] relative overflow-hidden pt-32 pb-48">
        
        <main className="max-w-[1200px] w-full mx-auto px-4 md:px-12 relative z-10 flex flex-col items-center">
          
          <div className="w-full max-w-[85ch] flex justify-start mb-16">
            <Link 
              href="/scrawl/tags"
              className="group flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-[#111111]/40 hover:text-[#111111] transition-colors duration-500 bg-[#EAE5D9] px-6 py-3 rounded-full"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-500" />
              <span>Back to tags</span>
            </Link>
          </div>
          
          <div className="w-full max-w-[85ch] flex flex-col items-start bg-[#DBC2FC] rounded-[2.5rem] p-10 md:p-16 mb-24 overflow-hidden relative group">
              <span className="text-xs font-bold tracking-[0.2em] text-[#111111]/50 mb-8 font-sans uppercase relative z-10">
                Filtered By Tag
              </span>
              <h1 
                className="text-[10vw] md:text-6xl lg:text-7xl tracking-tighter uppercase font-black leading-[0.9] text-[#111111] mb-12 relative z-10"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {decodedTag}
              </h1>
          </div>

          <div className="w-full max-w-[85ch] grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {matchedScrawls.map((scrawl, i) => (
              <Link
                key={scrawl.slug}
                href={`/scrawl/${scrawl.slug}`}
                className="col-span-1 bg-[#EAE5D9] rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between group overflow-hidden relative min-h-[450px]"
              >
                <Image src={getPlaceholderImage(i)} alt="Cover" fill className="object-cover absolute inset-0 z-0 grayscale-[0.2] mix-blend-multiply opacity-20 group-hover:scale-105 group-hover:opacity-50 transition-all duration-[2000ms]" />
                
                <div className="absolute top-8 right-8 w-10 h-10 bg-[#FDFBF7]/80 rounded-full flex items-center justify-center group-hover:bg-[#FDFBF7] group-hover:scale-110 transition-all z-20">
                   <ArrowUpRight className="w-5 h-5 text-[#111]" />
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between mt-12 md:mt-24">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#111]/70 mb-6 bg-[#FDFBF7]/80 backdrop-blur-md px-3 py-1 rounded-full self-start">
                    <span className="text-[#111]">{new Date(scrawl.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-[0.9] text-[#111111]" style={{ fontFamily: 'var(--font-heading)' }}>
                      {scrawl.title}
                    </h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </main>
      </div>
      <Footer />
    </>
  );
}