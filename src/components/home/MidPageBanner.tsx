'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MidPageBannerSetting } from '@/lib/supabase/types';
import { INITIAL_MID_PAGE_BANNER } from '@/lib/storage/db';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary/upload';

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
        {/* Left Column: Full-bleed Sandal Photograph */}
        <div className="md:col-span-7 relative w-full h-[260px] sm:h-[380px] md:h-[430px] lg:h-[460px] xl:h-[480px] bg-neutral-100 overflow-hidden rounded-none">
          {isExactRef ? (
            <img
              src="/images/banners/exact-mid-banner.png"
              alt={current.heading || 'MEOW Sandal Lifestyle'}
              className="w-[172%] max-w-none h-full object-cover object-[0%_72%] select-none pointer-events-none"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src = '/images/banners/mid-banner.jpg';
                e.currentTarget.className = 'w-full h-full object-cover object-center';
              }}
            />
          ) : (
            <img
              src={optimizeCloudinaryUrl(rawUrl, 1400)}
              alt={current.heading || 'MEOW Sandal Lifestyle'}
              className="w-full h-full object-cover object-center"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          )}
        </div>

        {/* Right Column: Refined Editorial Text & Button */}
        <div className="md:col-span-5 p-6 sm:p-10 md:p-12 lg:p-14 xl:p-16 flex flex-col justify-center items-start bg-[#FAF8F5] h-full rounded-none">
          <div className="inline-flex items-center gap-3 mb-3 sm:mb-4">
            <span className="w-7 h-[1.5px] bg-[#9E7B56]" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.38em] text-[#4A4138] font-sans font-semibold">
              {current.badge || 'MEOW ARCHIVE'}
            </span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] font-normal text-[#181411] leading-[1.12] tracking-tight mb-3.5 sm:mb-5 whitespace-pre-line">
            {current.heading || 'Every Step\nA Story'}
          </h2>

          <p className="text-xs sm:text-[14.5px] text-[#4F4841] font-sans leading-[1.7] max-w-[360px] mb-6 sm:mb-8">
            {current.subtitle || 'Crafted for modern lives with purpose, comfort and character.'}
          </p>

          <Link
            href={current.cta_link || '/about'}
            className="inline-flex items-center gap-2.5 px-6 py-3 sm:px-7 sm:py-3.5 rounded-full bg-[#181411] text-white hover:bg-black transition-all text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-semibold shadow-sm group"
          >
            <span>{current.cta_text || 'EXPLORE OUR STORY'}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
