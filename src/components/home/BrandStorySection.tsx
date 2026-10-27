'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Feather, Waves, Sprout, RefreshCw } from 'lucide-react';
import { TheMeowStandardSetting } from '@/lib/supabase/types';
import { INITIAL_THE_MEOW_STANDARD } from '@/lib/storage/db';

interface BrandStorySectionProps {
  banner?: TheMeowStandardSetting | null;
}

export const BrandStorySection: React.FC<BrandStorySectionProps> = ({ banner = INITIAL_THE_MEOW_STANDARD }) => {
  const current = banner || INITIAL_THE_MEOW_STANDARD;

  if (current.is_enabled === false) return null;

  const rawUrl = current.image_url || '/images/banners/exact-story-banner.png';
  const isExactRef = !rawUrl || rawUrl.includes('exact-story-banner') || rawUrl.includes('story-banner');

  const features = [
    {
      icon: Feather,
      title: 'Lightweight Comfort',
      desc: 'Feels light. Moves with you.',
    },
    {
      icon: Waves,
      title: 'Anatomical Cork',
      desc: 'Natural support, all-day ease.',
    },
    {
      icon: Sprout,
      title: 'Mindful Craft',
      desc: 'Built with purpose.',
    },
    {
      icon: RefreshCw,
      title: 'Conscious Future',
      desc: 'Better materials, Brighter tomorrows.',
    },
  ];

  return (
    <section className="w-full bg-[#FDFBF7] border-y border-neutral-200/80 my-8 sm:my-14 overflow-hidden rounded-none">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
        {/* Left Column: Full-bleed Woman Walking Photograph (50% width, no curves, no hover zoom) */}
        <div className="relative w-full h-[260px] sm:h-[380px] md:h-[480px] lg:h-[520px] xl:h-[540px] bg-neutral-100 overflow-hidden rounded-none">
          {isExactRef ? (
            <img
              src="/images/banners/exact-story-banner.png"
              alt={current.heading || 'The MEOW Standard Lifestyle'}
              className="w-[198%] max-w-none h-full object-cover object-[0%_65%] select-none pointer-events-none"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/images/banners/story-banner.jpg';
                e.currentTarget.className = 'w-full h-full object-cover object-center';
              }}
            />
          ) : (
            <img
              src={rawUrl}
              alt={current.heading || 'The MEOW Standard Lifestyle'}
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          )}
        </div>

        {/* Right Column: Editorial Standards & 2x2 Feature Grid (50% width, no curves) */}
        <div className="p-5 sm:p-10 md:p-12 lg:p-14 xl:p-16 flex flex-col justify-center items-start bg-[#FDFBF7] h-full rounded-none">
          <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.25em] text-[#7A756F] font-sans font-medium mb-2 sm:mb-3 block">
            {current.badge || 'THE MEOW STANDARD'}
          </span>

          <h2 className="font-editorial text-2xl sm:text-4xl md:text-[42px] font-normal text-[#1A1A1A] leading-[1.18] tracking-tight mb-3 sm:mb-4 whitespace-pre-line">
            {current.heading || 'Designed for Calm,\nConfident Living'}
          </h2>

          <p className="text-xs sm:text-sm text-[#5C564F] font-sans leading-relaxed max-w-xl mb-5 sm:mb-7">
            {current.subtitle ||
              'We believe what touches your feet should liberate your stride. From natural cork footbeds to pillowy double-density outsoles, every MEOW piece is made for modern life.'}
          </p>

          {/* 2x2 Feature Grid - Sharp Rectangular Corners, Perfect Mobile Alignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 w-full mb-5 sm:mb-7">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-3 sm:p-4 border border-[#EFECE6] bg-white flex items-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] rounded-none"
                >
                  <div className="w-8 h-8 rounded-none bg-[#FAF8F5] flex items-center justify-center flex-shrink-0 text-[#1A1A1A]">
                    <Icon className="w-4 h-4 stroke-[1.5] flex-shrink-0" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[#1A1A1A] leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#7A756F] font-sans mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Read Our Story Link */}
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#1A1A1A] border-b border-[#1A1A1A] pb-0.5 hover:text-neutral-600 hover:border-neutral-600 transition-colors group"
          >
            <span>READ OUR STORY</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
