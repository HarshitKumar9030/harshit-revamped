"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CurrentPlayback } from "@/lib/spotify";
import Image from "next/image";
import { X, PlayCircle, PauseCircle } from "lucide-react";

export function SpotifyClient({ song }: { song: CurrentPlayback | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const isPlaying = song?.isPlaying;
  const trackName = song?.trackName ?? "Not listening";
  const artistName = song?.artists?.join(", ") ?? "Spotify";
  const trackUrl = song?.spotifyUrl ?? "#";
  const albumImage = song?.albumImageUrl;
  const progressPercent = song?.progressMs && song?.durationMs 
    ? (song.progressMs / song.durationMs) * 100 
    : 0;

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-5 bg-[#F0EDE5] hover:bg-white transition-colors px-6 py-4 text-[#2A2A2A] w-fit rounded-none cursor-pointer"
      >
        <div className="flex gap-0.75 items-end h-4">
          {isPlaying ? (
            <>
              <motion.div animate={{ height: ["4px", "16px", "4px"] }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-1.5 bg-[#2A2A2A]" />
              <motion.div animate={{ height: ["8px", "12px", "8px"] }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} className="w-1.5 bg-[#2A2A2A]" />
              <motion.div animate={{ height: ["12px", "4px", "12px"] }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="w-1.5 bg-[#2A2A2A]" />
            </>
          ) : (
            <>
              <div className="w-1.5 h-1 bg-[#2A2A2A] opacity-50" />
              <div className="w-1.5 h-1 bg-[#2A2A2A] opacity-50" />
              <div className="w-1.5 h-1 bg-[#2A2A2A] opacity-50" />
            </>
          )}
        </div>
        <div className="flex flex-col leading-none text-left">
          <span className="uppercase text-[10px] font-bold tracking-widest opacity-60 mb-1" style={{ fontFamily: "var(--font-heading)" }}>
            {isPlaying ? "Now Playing" : "Currently Offline"}
          </span>
          <span className="text-sm font-medium line-clamp-1 max-w-50 overflow-hidden text-ellipsis">
            {trackName} — {artistName}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#111111]/80 backdrop-blur-sm pointer-events-auto"
            />
            
            {/* Popup */}
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[90%] max-w-sm bg-[#FDFBF7] text-[#111111] p-8 md:p-10 pointer-events-auto overflow-hidden rounded-[2.5rem]"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-[#111111]/5 hover:bg-[#111111]/10 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center gap-6 mt-4">
                {albumImage ? (
                  <div className="w-48 h-48 sm:w-56 sm:h-56 relative rounded-2xl overflow-hidden shadow-2xl shrink-0 border border-[#111111]/10">
                    <Image 
                      src={albumImage} 
                      alt={trackName} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 sm:w-56 sm:h-56 bg-[#111111]/5 flex items-center justify-center rounded-2xl border border-[#111111]/10">
                    <span className="text-4xl">🎵</span>
                  </div>
                )}
                
                <div className="flex flex-col items-center gap-2 w-full mt-2">
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none" style={{ fontFamily: "var(--font-heading)" }}>
                    {trackName}
                  </h3>
                  <p className="text-[#111111]/60 font-medium tracking-wide">
                    {artistName}
                  </p>
                </div>

                <div className="w-full flex items-center gap-4 mt-2">
                  {isPlaying ? (
                    <PlayCircle className="w-6 h-6 text-[#111111]/50 shrink-0" />
                  ) : (
                    <PauseCircle className="w-6 h-6 text-[#111111]/50 shrink-0" />
                  )}
                  <div className="w-full h-1.5 bg-[#111111]/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full bg-[#111111] rounded-full" 
                    />
                  </div>
                </div>

                <a 
                  href={trackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 mt-4 bg-[#D9ED92] hover:bg-[#c2d973] text-[#111] font-bold uppercase tracking-widest text-xs transition-colors rounded-full"
                >
                  Open in Spotify
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}