'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HeroBanner } from '@/lib/supabase/types';
import { optimizeCloudinaryVideoUrl } from '@/lib/cloudinary/upload';

interface HeroSectionProps {
  banner: HeroBanner;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ banner }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const GEMINI_HERO_VIDEO = 'https://res.cloudinary.com/k7t4skr1/video/upload/f_auto,q_auto/v1793007834/meow/hero/desktop/qlqsgtcvyihqq2bsnu0s.mp4';
  const videoUrl = optimizeCloudinaryVideoUrl(
    banner.desktop_video_url || banner.mobile_video_url || GEMINI_HERO_VIDEO
  );
  const posterUrl = banner.poster_image_url;

  // Check if admin provided any text overlay elements
  const hasBadge = Boolean(banner.badge && banner.badge.trim());
  const hasHeading = Boolean(banner.heading && banner.heading.trim());
  const hasSubtitle = Boolean(banner.subtitle && banner.subtitle.trim());
  const hasCta = Boolean(banner.cta_text && banner.cta_text.trim());
  const hasAnyOverlay = hasBadge || hasHeading || hasSubtitle || hasCta;

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
    <section className="relative w-full h-[42vh] xs:h-[46vh] sm:h-[90vh] lg:h-[95vh] min-h-[300px] xs:min-h-[330px] sm:min-h-[580px] max-h-[400px] sm:max-h-[1080px] overflow-hidden bg-black flex items-center">
      {/* 
        Video Banner:
        - Zoomed out on mobile to see the full video in landscape framing.
        - Full-bleed background with text and buttons directly overlaid on top.
        - No dark space in between video and content.
      */}
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
          poster={posterUrl || undefined}
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

        {/* Cinematic Gradient Overlays: only rendered if text/buttons are configured in admin */}
        {hasAnyOverlay && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 sm:from-black/75 sm:via-transparent sm:to-black/30 z-[1] pointer-events-none" />
            <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/25 z-[1] pointer-events-none" />
          </>
        )}
      </div>

      {/* Editorial Content: Overlaid directly on top of video ONLY if admin added text */}
      {hasAnyOverlay && (
        <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 max-w-xl sm:max-w-7xl mx-auto py-4 sm:py-16 text-center sm:text-left">
          <div className="max-w-xl sm:max-w-3xl space-y-2 xs:space-y-2.5 sm:space-y-8 animate-fade-in-up mx-auto sm:mx-0">
            {/* Badge */}
            {hasBadge && (
              <div className="inline-flex items-center px-3 py-0.5 sm:px-3.5 sm:py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[9px] xs:text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em]">
                <span>{banner.badge}</span>
              </div>
            )}

            {/* Main Headline */}
            {hasHeading && (
              <h1 className="font-editorial text-2xl xs:text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white leading-[1.1] sm:leading-[1.05] tracking-tight drop-shadow-lg">
                {(() => {
                  const text = (banner.heading || '').trim();
                  if (text.includes('\n')) {
                    return text.split('\n').map((line, idx) => (
                      <span key={idx} className="block">
                        {line}
                      </span>
                    ));
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
            )}

            {/* Subtitle */}
            {hasSubtitle && (
              <p className="text-[11px] xs:text-xs sm:text-lg md:text-xl text-white/85 max-w-md sm:max-w-xl mx-auto sm:mx-0 font-sans font-light leading-relaxed drop-shadow-md">
                {banner.subtitle}
              </p>
            )}

            {/* Call to Action Buttons */}
            {hasCta && (
              <div className="pt-1.5 sm:pt-4 grid grid-cols-2 gap-2 xs:gap-2.5 w-full max-w-sm mx-auto sm:flex sm:w-auto sm:items-center sm:gap-4 sm:mx-0">
                <Link
                  href={banner.cta_link || '/shop'}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 sm:px-10 py-2.5 sm:py-4 bg-white text-meow-dark text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-semibold hover:bg-meow-terracotta hover:text-white transition-all shadow-xl group rounded-sm text-center min-h-[38px] xs:min-h-[42px]"
                >
                  <span className="truncate">{banner.cta_text}</span>
                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/about"
                  className="w-full sm:w-auto flex items-center justify-center px-3 sm:px-6 py-2.5 sm:py-4 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-semibold border border-white/30 transition-all rounded-sm text-center min-h-[38px] xs:min-h-[42px]"
                >
                  <span>Our Story</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subtle Scroll Hint: only show if overlay text is enabled */}
      {hasAnyOverlay && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 text-white/60 pointer-events-none animate-pulse">
          <span className="text-[10px] uppercase tracking-[0.25em] font-sans">Scroll</span>
          <div className="w-[1px] h-6 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      )}
    </section>
  );
};
