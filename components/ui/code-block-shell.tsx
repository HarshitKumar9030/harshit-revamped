"use client";

import { useRef, useState } from "react";
import { Check, Copy, Maximize2, Minimize2 } from "lucide-react";

type CodeBlockShellProps = {
  children: React.ReactNode;
};

export function CodeBlockShell({ children }: CodeBlockShellProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy(e: React.MouseEvent) {
    if (e) e.stopPropagation();
    const code = contentRef.current?.querySelector("code")?.textContent ?? contentRef.current?.textContent ?? "";
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div 
      className="relative my-12 w-full max-w-[85ch] overflow-hidden rounded-[2.5rem] bg-[#111111] text-[#FDFBF7] shadow-lg cursor-pointer transition-all duration-300"
      onClick={() => setIsExpanded(prev => !prev)}
    >
      <div className="flex items-center justify-between border-b border-[#FDFBF7]/10 px-5 py-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FDFBF7]/55">Code</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-full bg-[#FDFBF7]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors hover:bg-[#D9ED92] hover:text-[#111111]"
            aria-label="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="mt-0.5">{copied ? "Copied" : "Copy"}</span>
          </button>
          
          {/* <div className="flex items-center gap-1 rounded-full bg-[#111111] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FDFBF7]/80 border border-[#FDFBF7]/20 pointer-events-none">
            TypeScript
          </div> */}
        </div>
      </div>

      <div className="relative">
        <div
          ref={contentRef}
          className={isExpanded ? "max-h-none overflow-auto p-6" : "max-h-[24rem] overflow-hidden p-6"}
        >
          {children}
        </div>
        {!isExpanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#111111] to-transparent flex items-end justify-center pb-4">
            <span className="text-[#FDFBF7]/40 text-[10px] uppercase tracking-[0.2em] font-bold">Tap to expand</span>
          </div>
        )}
      </div>
    </div>
  );
}
