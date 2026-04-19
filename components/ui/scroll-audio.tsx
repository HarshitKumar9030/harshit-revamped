"use client";

import { useEffect, useRef } from "react";

export function ScrollAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const attemptedRef = useRef(false);

  useEffect(() => {
    // Create audio instance
    const audio = new Audio("/move.mp3");
    audio.loop = true;
    audio.volume = 0.5; // Set reasonable volume
    audioRef.current = audio;

    const handleInteraction = () => {
      if (!attemptedRef.current) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              attemptedRef.current = true;
              // Remove listeners once it successfully plays
              window.removeEventListener("scroll", handleInteraction);
              window.removeEventListener("click", handleInteraction);
              window.removeEventListener("pointerdown", handleInteraction);
              window.removeEventListener("keydown", handleInteraction);
            })
            .catch((err) => {
              // Browser may still block autoplay on pure "scroll" 
              // until a true click/pointerdown occurs.
              console.warn("Audio autoplay blocked or failed:", err);
            });
        }
      }
    };

    window.addEventListener("scroll", handleInteraction, { passive: true });
    window.addEventListener("click", handleInteraction, { passive: true });
    window.addEventListener("pointerdown", handleInteraction, { passive: true });
    window.addEventListener("keydown", handleInteraction, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  return null;
}