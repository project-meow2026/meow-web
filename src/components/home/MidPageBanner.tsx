'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MidPageBannerSetting } from '@/lib/supabase/types';
import { INITIAL_MID_PAGE_BANNER } from '@/lib/storage/db';

interface MidPageBannerProps {
  banner?: MidPageBannerSetting | null;
}

export const MidPageBanner: React.FC<MidPageBannerProps> = ({ banner = INITIAL_MID_PAGE_BANNER }) => {
  const current = banner || INITIAL_MID_PAGE_BANNER;

  if (current.is_enabled === false) return null;

  const rawUrl = current.image_url || '/images/banners/exact-mid-banner.png';
  const isExactRef = !rawUrl || rawUrl.includes('exact-mid-banner') || rawUrl.includes('mid-banner');

  return (
    <section className="w-full bg-[#FAF8F5] border-y border-neutral-200/80 my-8 sm:my-14 overflow-hidden rounded-none">
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-0 items-stretch">
        {/* Left Column: Full-bleed Sandal Photograph showing the full sandal footbed, sole and stone */}
        <div className="md:col-span-7 relative w-full h-[260px] sm:h-[380px] md:h-[430px] lg:h-[460px] xl:h-[480px] bg-neutral-100 overflow-hidden rounded-none">
          {isExactRef ? (
            <img
              src="/images/banners/exact-mid-banner.png"
              alt={current.heading || 'MEOW Sandal Lifestyle'}
              className="w-[172%] max-w-none h-full object-cover object-[0%_72%] select-none pointer-events-none"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/images/banners/mid-banner.jpg';
                e.currentTarget.className = 'w-full h-full object-cover object-center';
              }}
            />
          ) : (
            <img
              src={rawUrl}
              alt={current.heading || 'MEOW Sandal Lifestyle'}
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          )}
        </div>

        {/* Right Column: Editorial Text & Button (42% width, perfectly aligned, no curves) */}
        <div className="md:col-span-5 p-5 sm:p-10 md:p-12 lg:p-14 xl:p-16 flex flex-col justify-center items-start bg-[#FAF8F5] h-full rounded-none">
          <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.25em] text-[#7A756F] font-sans font-medium mb-2 sm:mb-3.5 block">
            {current.badge || 'MEOW HERITAGE'}
          </span>

          <h2 className="font-editorial text-2xl sm:text-4xl md:text-[42px] lg:text-[46px] font-normal text-[#1A1A1A] leading-[1.18] tracking-tight mb-3 sm:mb-4 whitespace-pre-line">
            {current.heading || 'Every Step\nA Story'}
          </h2>

          <p className="text-xs sm:text-sm text-[#5C564F] font-sans leading-relaxed max-w-[340px] mb-5 sm:mb-7">
            {current.subtitle || 'Crafted for modern lives with\npurpose, comfort and character.'}
          </p>

          <Link
            href={current.cta_link || '/about'}
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3 rounded-full bg-[#181818] text-white hover:bg-black transition-colors text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold shadow-sm group"
          >
            <span>{current.cta_text || 'EXPLORE OUR STORY'}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
