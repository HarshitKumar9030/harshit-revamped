"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
}

export function AudioPlayer({ src, title = "Unknown Track", artist = "Unknown Artist" }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    
    audio.currentTime = percentage * audio.duration;
    setProgress(percentage * 100);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="w-full max-w-[85ch] bg-[#111111] rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 my-12 text-[#FDFBF7] shadow-xl relative overflow-hidden group">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#DBC2FC]/20 rounded-full blur-3xl group-hover:bg-[#D9ED92]/20 transition-colors duration-1000 -z-0"></div>

      {/* Audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play/Pause Button */}
      <button 
        onClick={togglePlayPause}
        className="w-16 h-16 shrink-0 bg-[#EAE5D9] hover:bg-[#D9ED92] transition-colors duration-300 rounded-full flex items-center justify-center text-[#111111] z-10"
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 fill-current" />
        ) : (
          <Play className="w-6 h-6 fill-current ml-1" />
        )}
      </button>

      {/* Track Info & Progress */}
      <div className="flex flex-col w-full gap-3 z-10">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-50 mb-1">{artist}</span>
            <span className="font-bold text-lg md:text-xl tracking-tight leading-none" style={{ fontFamily: 'var(--font-heading)' }}>{title}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono font-medium opacity-60">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <button onClick={toggleMute} className="opacity-50 hover:opacity-100 transition-opacity">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div 
          ref={progressRef}
          onClick={handleProgressClick}
          className="w-full h-3 bg-[#FDFBF7]/10 rounded-full cursor-pointer relative overflow-hidden flex items-center"
        >
          <div 
            className="absolute left-0 top-0 bottom-0 bg-[#D9ED92] transition-all duration-100 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}