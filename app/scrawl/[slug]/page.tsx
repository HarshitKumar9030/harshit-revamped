import { getScrawlBySlug, getAllScrawls } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import Link from "next/link";
import { ArrowLeft, Clock, CalendarDays, BookOpen, PenTool } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/sections/footer";
import { ViewTracker } from "@/components/ui/view-tracker";

import { mdxComponents } from "@/components/ui/mdx-components";
// Load Katex stylesheet globally for math styling, but local to this route
import "katex/dist/katex.min.css"; 
import { Metadata } from "next";

interface ScrawlPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params } : ScrawlPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { meta } = await getScrawlBySlug(slug);
    return { 
      title: `${meta.title} | Scrawl`,
      description: meta.excerpt,
      openGraph: {
        title: meta.title,
        description: meta.excerpt,
        type: 'article',
        publishedTime: meta.date,
        tags: meta.tags,
        images: meta.image ? [{ url: meta.image }] : [{ url: "/ogimagep.png" }],
      },
      twitter: {
        card: "summary_large_image",
        title: meta.title,
        description: meta.excerpt,
        images: meta.image ? [meta.image] : ["/ogimagep.png"],
      }
    };
  } catch (error) {
    return { title: '404 - Scrawl Not Found' };
  }
}

export async function generateStaticParams() {
  const posts = await getAllScrawls();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function ScrawlPage({ params } : ScrawlPageProps) {
  const { slug } = await params;

  let post;
  try {
    post = await getScrawlBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-[#FDFBF7] text-[#111111] selection:bg-[#D9ED92] selection:text-[#111111] relative overflow-x-hidden pt-32 pb-48">
        
        <main className="max-w-[1200px] w-full mx-auto px-4 md:px-12 relative z-10 flex flex-col items-center">
          
          <div className="w-full max-w-[85ch] flex justify-start mb-16">
            <Link 
              href="/scrawl"
              className="group flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-[#111111]/40 hover:text-[#111111] transition-colors duration-500 bg-[#EAE5D9] px-6 py-3 rounded-full"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-500" />
              <span>Return to index</span>
            </Link>
          </div>
          
          <article className="w-full flex justify-start items-center flex-col relative">
            <div className="w-full max-w-[85ch] flex flex-col items-start bg-[#D9ED92] rounded-[2.5rem] overflow-hidden mb-24 relative group">
              {post.meta.image && (
                <div className="w-full h-64 md:h-80 relative overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={post.meta.image} 
                    alt={post.meta.title}
                    className="w-full h-full object-cover absolute inset-0 mix-blend-multiply opacity-50 transition-opacity duration-1000 group-hover:opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#D9ED92] to-transparent pointer-events-none"></div>
                </div>
              )}
              
              <div className={`p-10 md:p-16 ${post.meta.image ? 'pt-0 md:pt-4 mt-4 md:mt-2' : ''} w-full relative z-10`}>
                <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-[#FDFBF7]/40 blur-2xl group-hover:bg-[#DBC2FC]/40 transition-colors duration-1000"></div>
                
                <span className="text-xs font-bold tracking-[0.2em] text-[#111111]/50 mb-8 font-sans uppercase relative z-10 block">
                  Observation
                </span>
                <h1 
                  className="text-[10vw] md:text-6xl lg:text-7xl tracking-tighter uppercase font-black leading-[0.9] text-[#111111] mb-12 relative z-10"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {post.meta.title}
                </h1>
                
                <div className="flex flex-wrap gap-x-8 gap-y-4 items-center tracking-widest font-bold uppercase text-[10px] text-[#111111]/80 font-sans relative z-10 border-t border-[#111111]/10 pt-8 w-full mt-4">
                  <div className="flex items-center gap-2 bg-[#FDFBF7] px-4 py-2 rounded-full mix-blend-luminosity">
                    <CalendarDays className="w-3 h-3" />
                    <span>{new Date(post.meta.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: '2-digit' })}</span>
                  </div>
                  
                  {post.meta.readingTime && (
                    <div className="flex items-center gap-2 bg-[#FDFBF7] px-4 py-2 rounded-full mix-blend-luminosity">
                      <Clock className="w-3 h-3" />
                      <span>{post.meta.readingTime} min read</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 bg-[#FDFBF7] px-4 py-2 rounded-full mix-blend-luminosity">
                    <PenTool className="w-3 h-3" />
                    <span>Harshit</span>
                  </div>

                  {post.meta.tags && post.meta.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3 h-3 ml-2 opacity-50" />
                      <div className="flex gap-2">
                        {post.meta.tags.map((tag: string) => (
                          <Link key={tag} href={`/scrawl/tags/${tag.toLowerCase()}`} className="hover:-translate-y-1 transition-transform cursor-pointer bg-[#FDFBF7] px-4 py-2 rounded-full mix-blend-luminosity">{tag}</Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="w-full max-w-[85ch] flex flex-col gap-6 scrawl-content overflow-hidden relative z-10">
              <ViewTracker slug={slug} tags={post.meta.tags} />
              <MDXRemote 
                source={post.content} 
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkMath],
                    rehypePlugins: [
                      rehypeKatex,
                      [rehypePrettyCode, { theme: "dracula" }]
                    ],
                  }
                }} 
              />
            </div>
          </article>
        </main>

      </div>
      <Footer />
    </>
  );
}