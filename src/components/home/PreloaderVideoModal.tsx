'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, ArrowRight, Play, Pause } from 'lucide-react';
import { PreloadVideoSetting } from '@/lib/supabase/types';

interface PreloaderVideoModalProps {
  setting?: PreloadVideoSetting | null;
  forceShow?: boolean;
  onFinish?: () => void;
}

export const PreloaderVideoModal: React.FC<PreloaderVideoModalProps> = ({
  setting,
  forceShow = false,
  onFinish,
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Only check storage if not in forced preview mode (e.g. from admin)
    if (!forceShow && typeof window !== 'undefined') {
      const seen = sessionStorage.getItem('meow_preload_video_seen');
      if (seen === 'true') {
        setShouldRender(false);
        onFinish?.();
        return;
      }
    }

    if (setting && setting.is_enabled && setting.video_url) {
      setShouldRender(true);
    } else if (forceShow) {
      setShouldRender(true);
    } else {
      setShouldRender(false);
      onFinish?.();
    }
  }, [setting, forceShow]);

  // Attempt autoplay once mounted
  useEffect(() => {
    if (!shouldRender) return;

    const timer = setTimeout(() => {
      const v = videoRef.current;
      if (v) {
        v.muted = true;
        v.playsInline = true;
        v.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay blocked: user can click screen to play
            setIsPlaying(false);
          });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [shouldRender]);

  // Handle escape key to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && shouldRender) {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shouldRender]);

  const handleSkip = () => {
    if (!forceShow && typeof window !== 'undefined') {
      sessionStorage.setItem('meow_preload_video_seen', 'true');
    }
    setFadeOut(true);
    setTimeout(() => {
      setShouldRender(false);
      onFinish?.();
    }, 600);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (v && v.duration) {
      setCurrentTime(v.currentTime);
      setDuration(v.duration);
      setProgress((v.currentTime / v.duration) * 100);
    }
  };

  const handleVideoEnded = () => {
    if (setting?.auto_close_on_end !== false) {
      handleSkip();
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (v) {
      v.muted = !v.muted;
      setIsMuted(v.muted);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (v) {
      if (v.paused) {
        v.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        v.pause();
        setIsPlaying(false);
      }
    }
  };

  if (!shouldRender) return null;

  const videoUrl = setting?.video_url || 'https://res.cloudinary.com/k7t4skr1/video/upload/v1793007834/meow/hero/desktop/qlqsgtcvyihqq2bsnu0s.mp4';
  const badge = setting?.badge || 'MEOW FOOTWEAR';
  const title = setting?.title || 'THE ART OF DRESSING WELL';
  const subtitle = setting?.subtitle || 'Quiet confidence. Timeless comfort.';
  const skipText = setting?.skip_button_text || 'Skip Intro';

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden transition-opacity duration-700 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      onClick={togglePlay}
    >
      {/* Fullscreen Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        playsInline
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="absolute inset-0 w-full h-full object-cover object-center select-none"
      />

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40 pointer-events-none" />

      {/* Top Header Bar */}
      <div className="absolute top-0 inset-x-0 p-4 sm:p-8 flex items-center justify-between z-20 pointer-events-auto">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="MEOW"
            width={120}
            height={36}
            className="h-7 sm:h-8 w-auto object-contain brightness-0 invert drop-shadow"
            priority
          />
        </div>

        {/* Action Controls: Sound & Skip Button */}
        <div className="flex items-center gap-3">
          {/* Audio toggle button */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute video sound' : 'Mute video sound'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 text-xs transition-colors"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-white/80" />
                <span className="hidden sm:inline text-[11px] tracking-wider uppercase font-medium">Unmute</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-white" />
                <span className="hidden sm:inline text-[11px] tracking-wider uppercase font-medium">Mute</span>
              </>
            )}
          </button>

          {/* Skip Intro button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSkip();
            }}
            aria-label="Skip preloading intro video"
            className="group flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-meow-dark hover:bg-white/90 shadow-lg text-xs uppercase tracking-widest font-semibold transition-all hover:scale-105"
          >
            <span>{skipText}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Bottom Editorial Content */}
      <div className="absolute bottom-6 sm:bottom-10 inset-x-4 sm:inset-x-8 z-20 pointer-events-none max-w-4xl space-y-2 sm:space-y-3">
        {badge && (
          <div className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold">
            {badge}
          </div>
        )}

        {title && (
          <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl text-white font-light tracking-tight leading-tight drop-shadow-md">
            {title}
          </h1>
        )}

        {subtitle && (
          <p className="text-xs sm:text-sm text-white/80 max-w-md font-sans tracking-wide">
            {subtitle}
          </p>
        )}
      </div>

      {/* Play/Pause center overlay indicator on manual click */}
      {!isPlaying && (
        <div className="absolute z-20 p-4 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-md pointer-events-none animate-pulse">
          <Play className="w-8 h-8 fill-white ml-0.5" />
        </div>
      )}

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-30">
        <div
          className="h-full bg-white transition-all duration-150 ease-linear shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
