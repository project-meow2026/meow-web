'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BottomCtaSetting } from '@/lib/supabase/types';
import { INITIAL_BOTTOM_CTA } from '@/lib/storage/db';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary/upload';

interface BottomCtaSectionProps {
  banner?: BottomCtaSetting | null;
}

export const BottomCtaSection: React.FC<BottomCtaSectionProps> = ({ banner = INITIAL_BOTTOM_CTA }) => {
  const current = banner || INITIAL_BOTTOM_CTA;

  if (current.is_enabled === false) return null;

  const rawBg = current.background_image_url || '/images/banners/bottom-cta-glass-bg.png';
  const bgImage = rawBg.includes('bottom-cta-bg.jpg')
    ? '/images/banners/bottom-cta-glass-bg.png'
    : optimizeCloudinaryUrl(rawBg, 1800);

  // Clean up legacy newsletter/email/archive default strings so the editorial text reads beautifully
  const isLegacyHeading =
    !current.heading ||
    /early access|archive|style stories|subscribe/i.test(current.heading);
  const displayHeading = isLegacyHeading
    ? 'Timeless Craft,\nModern Comfort.'
    : current.heading;

  const isLegacySubtitle =
    !current.subtitle ||
    /inbox|first to know|special offers|newsletter|email/i.test(current.subtitle);
  const displaySubtitle = isLegacySubtitle
    ? 'Thoughtfully engineered silhouettes blending natural anatomical support, featherlight soles, and understated luxury for every step of your journey.'
    : current.subtitle;

  return (
    <section className="relative w-full overflow-hidden my-6 sm:my-14 px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex items-center justify-center">
      {/* Background Image: Warm Stone with Dried Botanicals */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src={bgImage}
          alt="MEOW Archive Background"
          className="w-full h-full object-cover object-center select-none pointer-events-none"
          loading="eager"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = '/images/banners/bottom-cta-glass-bg.png';
          }}
        />
        {/* Soft warm ambient vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#241B14]/20 via-transparent to-[#241B14]/20 pointer-events-none" />
      </div>

      {/* Frosted Luxury Glass Card */}
      <div className="relative z-10 w-full max-w-5xl mx-auto rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 lg:p-14 bg-white/35 backdrop-blur-2xl border border-white/70 shadow-[0_24px_60px_rgba(24,18,12,0.14),inset_0_1px_1px_rgba(255,255,255,0.9)] flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-10">
        {/* Inner glass sheen */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/50 via-white/15 to-transparent pointer-events-none" />

        {/* Left: Refined Editorial Typography */}
        <div className="relative z-10 space-y-3 sm:space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-3">
            <span className="w-7 h-[1.5px] bg-[#8C6D4F]" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.38em] text-[#3A3028] font-sans font-semibold">
              THE MEOW ARCHIVE
            </span>
          </div>

          <h3 className="font-editorial text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] text-[#18130F] font-normal leading-[1.1] tracking-tight whitespace-pre-line">
            {displayHeading}
          </h3>

          <p className="text-xs sm:text-[14.5px] text-[#3B332B] font-sans leading-[1.7] max-w-lg pt-0.5">
            {displaySubtitle}
          </p>
        </div>

        {/* Right: Elevated Luxury CTA Button */}
        <div className="relative z-10 flex-shrink-0 pt-1 md:pt-0">
          <Link
            href="/collections"
            className="inline-flex items-center gap-3.5 px-7 py-4 rounded-full bg-[#18130F] hover:bg-black text-white text-[11px] sm:text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-300 shadow-[0_10px_28px_rgba(24,19,15,0.22)] hover:shadow-[0_14px_32px_rgba(24,19,15,0.32)] group"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
