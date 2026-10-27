'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HeroBanner } from '@/lib/supabase/types';

interface HeroSectionProps {
  banner: HeroBanner;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ banner }) => {
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
          promise.catch(() => {
            // Autoplay blocked by browser policy until user interacts
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

  return (
    <section className="relative w-full h-[75vh] sm:h-[90vh] lg:h-[95vh] min-h-[460px] sm:min-h-[580px] max-h-[1080px] overflow-hidden bg-black flex items-center">
      {/* Full Widescreen Video Background (Zoomed out slightly on mobile view as requested) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
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
          className="w-full h-full object-cover object-center scale-100 transition-transform duration-700"
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
        </video>

        {/* Luxury Cinematic Gradient Overlays for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/25 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 z-[1]" />
      </div>

      {/* Editorial Content Overlay on Top of Video */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 sm:py-16">
        <div className="max-w-2xl sm:max-w-3xl space-y-4 sm:space-y-8 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em]">
            <span>{banner.badge || 'SPRING / SUMMER'}</span>
          </div>

          {/* Main Headline - In mobile view cuts into elegant editorial parts */}
          <h1 className="font-editorial text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white leading-[1.08] sm:leading-[1.05] tracking-tight drop-shadow-lg max-w-[320px] xs:max-w-[380px] sm:max-w-none">
            {(() => {
              const text = (banner.heading || 'THE ART OF DRESSING WELL').trim();
              if (text.includes('\n')) {
                return text.split('\n').map((line, idx) => (
                  <span key={idx} className="block">
                    {line}
                  </span>
                ));
              }
              if (text.toUpperCase() === 'THE ART OF DRESSING WELL') {
                return (
                  <>
                    <span className="block">THE ART OF</span>
                    <span className="block">DRESSING WELL</span>
                  </>
                );
              }
              const words = text.split(' ');
              if (words.length >= 4) {
                const mid = Math.ceil(words.length / 2);
                return (
                  <>
                    <span className="block sm:inline">{words.slice(0, mid).join(' ')} </span>
                    <span className="block sm:inline">{words.slice(mid).join(' ')}</span>
                  </>
                );
              }
              return <span>{text}</span>;
            })()}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-lg md:text-xl text-white/90 max-w-[280px] sm:max-w-xl font-sans font-light leading-relaxed drop-shadow-md">
            {banner.subtitle || 'Quiet confidence. Timeless comfort.'}
          </p>

          {/* Call to Action Button */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href={banner.cta_link || '/shop'}
              className="inline-flex items-center gap-2.5 px-6 sm:px-10 py-3 sm:py-4 bg-white text-meow-dark text-xs uppercase tracking-widest font-semibold hover:bg-meow-terracotta hover:text-white transition-all shadow-2xl group rounded-sm"
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

      {/* Subtle Scroll Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 text-white/60 pointer-events-none animate-pulse">
        <span className="text-[10px] uppercase tracking-[0.25em] font-sans">Scroll</span>
        <div className="w-[1px] h-6 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
};
