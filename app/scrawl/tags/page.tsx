import Link from "next/link";
import { ArrowLeft, Flame } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/sections/footer";
import { getAllScrawls } from "@/lib/mdx";
import { connectToDatabase } from "@/lib/mongodb";
import { TagMetric } from "@/lib/models";

export const metadata = {
  title: "Scrawl Tags | Harshit",
  description: "Browse our scrawls by tag.",
};

export default async function TagsIndex() {
  const scrawls = await getAllScrawls();
  const mdxTags = Array.from(new Set(scrawls.flatMap((s) => s.tags || [])));
  
  let dbTags: Record<string, { hotness: number, count: number }> = {};
  
  try {
    const db = await connectToDatabase();
    if (db) {
      const records = await TagMetric.find().lean();
      records.forEach((record: any) => {
        dbTags[record.name.toLowerCase()] = {
          hotness: record.hotness || 0,
          count: record.count || 0
        };
      });
    }
  } catch (error) {
    console.error("DB Tags Error:", error);
  }

  // Combine MDX presence and DB metrics
  const combinedTags = mdxTags.map(tag => {
    const t = tag.toLowerCase();
    const stats = dbTags[t] || { hotness: 0, count: 0 };
    return { name: tag, ...stats };
  }).sort((a, b) => b.hotness - a.hotness);

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-[#FDFBF7] text-[#111111] selection:bg-[#D9ED92] selection:text-[#111111] flex flex-col pt-32 px-4 md:px-12 relative overflow-hidden font-sans">
        
        <main className="max-w-[1400px] w-full mx-auto relative z-10 flex flex-col gap-12 pb-32 items-center">
          
          <div className="w-full max-w-[85ch] flex justify-start mb-4">
            <Link 
              href="/scrawl"
              className="group flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-[#111111]/40 hover:text-[#111111] transition-colors duration-500 bg-[#EAE5D9] px-6 py-3 rounded-full"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-500" />
              <span>Return to index</span>
            </Link>
          </div>

          <div className="flex flex-col w-full max-w-[85ch] justify-start gap-8 mt-4 mb-8">
            <h1 
              className="text-6xl md:text-[6vw] font-black tracking-tighter uppercase leading-[0.8] text-[#111111]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              INDEX
            </h1>
            <p className="text-xl md:text-2xl text-[#111111]/50 font-medium max-w-2xl">
              Every topic explored, sorted by community interaction and heat.
            </p>
          </div>

          {/* Tags Grid */}
          <div className="w-full max-w-[85ch] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {combinedTags.map((tag, i) => (
              <Link 
                key={tag.name} 
                href={`/scrawl/tags/${tag.name.toLowerCase()}`}
                className="flex items-center justify-between p-8 bg-[#EAE5D9] hover:bg-[#D9ED92] transition-colors duration-500 rounded-[2.5rem] group relative overflow-hidden"
              >
                <div className="flex flex-col gap-2 relative z-10 w-full">
                  <span className="font-black text-2xl uppercase tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>
                    {tag.name}
                  </span>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-40">
                      {scrawls.filter(s => s.tags?.some(t => t.toLowerCase() === tag.name.toLowerCase())).length} Posts
                    </span>
                    {tag.hotness > 0 && (
                      <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Flame className="w-4 h-4 text-[#111111]" />
                        <span className="text-[10px] font-bold">{tag.hotness}</span>
                      </div>
                    )}
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