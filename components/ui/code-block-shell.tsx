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

  async function handleCopy() {
    const code = contentRef.current?.querySelector("code")?.textContent ?? "";
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
    <div className="relative my-12 w-full max-w-[85ch] overflow-hidden rounded-[2.5rem] bg-[#111111] text-[#FDFBF7] shadow-lg">
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
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center gap-1 rounded-full bg-[#FDFBF7]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors hover:bg-[#DBC2FC] hover:text-[#111111]"
            aria-label={isExpanded ? "Collapse code" : "Expand code"}
          >
            {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            {isExpanded ? "Contract" : "Expand"}
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={contentRef}
          className={isExpanded ? "max-h-none overflow-auto p-6" : "max-h-[24rem] overflow-auto p-6"}
        >
          {children}
        </div>
        {!isExpanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#111111] to-transparent" />
        )}
      </div>
    </div>
  );
}
