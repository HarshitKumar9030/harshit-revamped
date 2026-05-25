import { Quote } from "lucide-react";

export function PullQuote({ quote, by }: { quote: string; by?: string }) {
  return (
    <div className="my-16 w-full max-w-[75ch] mx-auto relative flex flex-col items-center text-center">
      <Quote className="w-12 h-12 text-[#111111] opacity-20 mb-6" />
      <p className="text-3xl md:text-5xl font-black text-[#111111] leading-[1.1] tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>
        {quote}
      </p>
      {by && (
        <span className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#111111]/50 border-t border-[#111111]/10 pt-4">
          {by}
        </span>
      )}
    </div>
  );
}