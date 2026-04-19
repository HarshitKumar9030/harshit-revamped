"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, Command } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function ScrawlSearch({ scrawls }: { scrawls: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const results = query 
    ? scrawls.filter(s => 
        s.title.toLowerCase().includes(query.toLowerCase()) || 
        (s.excerpt && s.excerpt.toLowerCase().includes(query.toLowerCase())) ||
        (s.tags && s.tags.some((t: string) => t.toLowerCase().includes(query.toLowerCase())))
      )
    : [];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-[#EAE5D9]/50 hover:bg-[#EAE5D9] transition-colors rounded-full px-6 py-3 flex items-center gap-3 group self-start mb-4"
        aria-label="Search scrawls"
      >
        <Search className="w-4 h-4 text-[#111111]" />
        <span className="font-medium text-sm text-[#111111] tracking-wide">Search</span>
        <div className="hidden sm:flex items-center gap-1 ml-2 opacity-50">
           <kbd className="font-sans text-[10px] font-bold border border-[#111111]/10 bg-white/50 rounded-md px-1.5 py-0.5">Ctrl</kbd>
           <kbd className="font-sans text-[10px] font-bold border border-[#111111]/10 bg-white/50 rounded-md px-1.5 py-0.5">K</kbd>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            <motion.div 
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-[#FDFBF7]/80 backdrop-blur-sm" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div 
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden flex flex-col shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-[#111111]/5"
            >
            <div className="flex items-center px-6 py-4 border-b border-[#111111]/5">
              <Search className="w-5 h-5 text-[#111111]/40 mr-4" />
              <input
                autoFocus
                type="text"
                placeholder="Search scrawls..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-[#111111]/30 text-[#111111] font-medium"
              />
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-[#111111]/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-[#111111]/50" />
              </button>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto p-2">
              {!query && (
                <div className="px-6 py-12 text-center text-sm font-medium text-[#111111]/30">
                  Type to start searching...
                </div>
              )}
              {query && results.length === 0 && (
                <div className="px-6 py-12 text-center text-sm font-medium text-[#111111]/30">
                  No results found for "{query}"
                </div>
              )}
              {query && results.length > 0 && results.map((scrawl) => (
                <Link
                  key={scrawl.slug}
                  href={`/scrawl/${scrawl.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-4 hover:bg-[#EAE5D9]/50 rounded-2xl transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-black truncate uppercase tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>
                      {scrawl.title}
                    </h3>
                    <p className="text-xs text-[#111111]/50 truncate mt-1">
                      {scrawl.excerpt || "No excerpt..."}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#111111]/30 group-hover:text-[#111111] group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              ))}
            </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}