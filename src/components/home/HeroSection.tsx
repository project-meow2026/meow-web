'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Play, Pause } from 'lucide-react';
import { HeroBanner } from '@/lib/supabase/types';

interface HeroSectionProps {
  banner: HeroBanner;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ banner }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const GEMINI_HERO_VIDEO = 'https://res.cloudinary.com/k7t4skr1/video/upload/v1793007834/meow/hero/desktop/qlqsgtcvyihqq2bsnu0s.mp4';
  const videoUrl = banner.desktop_video_url || banner.mobile_video_url || GEMINI_HERO_VIDEO;
  const posterUrl = banner.poster_image_url;

  // Ensure autoplay works smoothly across all modern browsers
  useEffect(() => {
    const video = videoRef.current;
    if (video && videoUrl) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;

      const attemptPlay = () => {
        if (!video) return;
        video.muted = true;
        const promise = video.play();
        if (promise !== undefined) {
          promise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              // Autoplay blocked by browser policy until user interacts
              setIsPlaying(false);
            });
        }
      };

      video.addEventListener('canplay', attemptPlay);
      video.addEventListener('loadeddata', attemptPlay);
      attemptPlay();

      return () => {
        video.removeEventListener('canplay', attemptPlay);
        video.removeEventListener('loadeddata', attemptPlay);
      };
    }
  }, [videoUrl]);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!video.paused) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.muted = true;
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <section className="relative w-full h-[85vh] sm:h-[90vh] lg:h-[95vh] min-h-[580px] max-h-[1080px] overflow-hidden bg-black flex items-center">
      {/* Full Widescreen Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          key={videoUrl}
          ref={(el) => {
            videoRef.current = el;
            if (el) {
              el.muted = true;
              el.defaultMuted = true;
              el.playsInline = true;
            }
          }}
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          preload="auto"
          className="w-full h-full object-cover object-center scale-[1.02]"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
        </video>

        {/* Luxury Cinematic Gradient Overlays for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/25 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 z-[1]" />
      </div>

      {/* Editorial Content Overlay on Top of Video */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div className="max-w-2xl sm:max-w-3xl space-y-6 sm:space-y-8 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold uppercase tracking-[0.25em]">
            <Sparkles className="w-3.5 h-3.5 text-meow-terracotta" />
            <span>{banner.badge || 'SPRING / SUMMER'}</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white leading-[1.05] tracking-tight drop-shadow-lg">
            {banner.heading || 'THE ART OF DRESSING WELL'}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-xl font-sans font-light leading-relaxed drop-shadow-md">
            {banner.subtitle || 'Quiet confidence. Timeless comfort.'}
          </p>

          {/* Call to Action Button */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-4">
            <Link
              href={banner.cta_link || '/shop'}
              className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 bg-white text-meow-dark text-xs uppercase tracking-widest font-semibold hover:bg-meow-terracotta hover:text-white transition-all shadow-2xl group rounded-sm"
            >
              <span>{banner.cta_text || 'DISCOVER THE COLLECTION'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs uppercase tracking-widest font-semibold border border-white/25 transition-all rounded-sm"
            >
              <span>Our Story</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Video Controls in Bottom Right */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-30 flex items-center gap-3">
        <button
          type="button"
          onClick={toggleVideo}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs uppercase tracking-widest font-medium transition-all shadow-lg hover:scale-105"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span className="hidden sm:inline">Play</span>
            </>
          )}
        </button>
      </div>

      {/* Subtle Scroll Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 text-white/60 pointer-events-none animate-pulse">
        <span className="text-[10px] uppercase tracking-[0.25em] font-sans">Scroll</span>
        <div className="w-[1px] h-6 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
};
