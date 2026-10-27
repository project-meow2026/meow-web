'use client';

import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { BottomCtaSetting } from '@/lib/supabase/types';
import { INITIAL_BOTTOM_CTA } from '@/lib/storage/db';

interface BottomCtaSectionProps {
  banner?: BottomCtaSetting | null;
}

export const BottomCtaSection: React.FC<BottomCtaSectionProps> = ({ banner = INITIAL_BOTTOM_CTA }) => {
  const current = banner || INITIAL_BOTTOM_CTA;
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (current.is_enabled === false) return null;

  const rawBg = current.background_image_url || '/images/banners/bottom-cta-glass-bg.png';
  const bgImage = rawBg.includes('bottom-cta-bg.jpg') ? '/images/banners/bottom-cta-glass-bg.png' : rawBg;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="relative w-full overflow-hidden my-4 sm:my-12 px-3 sm:px-6 lg:px-8 py-3 sm:py-8 flex items-center justify-center">
      {/* Background Image: Warm Stone with Dried Botanicals */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src={bgImage}
          alt="Bottom CTA Background"
          className="w-full h-full object-cover object-center select-none pointer-events-none"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/images/banners/bottom-cta-glass-bg.png';
          }}
        />
        {/* Soft natural ambient warming overlay */}
        <div className="absolute inset-0 bg-[#E8DFD5]/25 backdrop-blur-[1px] pointer-events-none" />
      </div>

      {/* Floating Translucent Glass Card on Top */}
      <div className="relative z-10 w-full max-w-6xl mx-auto rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-12 lg:p-14 bg-white/80 sm:bg-[#FAF7F2]/80 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-col md:flex-row md:items-center md:justify-between gap-5 sm:gap-10">
        {/* Left: Text Content */}
        <div className="space-y-1.5 sm:space-y-2 max-w-xl">
          <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.25em] text-[#7A7269] font-sans font-medium block">
            {current.badge || 'MEOW JOURNAL'}
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-[#1A1A1A] font-normal leading-[1.18] tracking-tight whitespace-pre-line">
            {current.heading || 'Style Stories,\nNew Arrivals & More'}
          </h3>
          <p className="text-xs sm:text-sm text-[#5C564F] font-sans leading-relaxed max-w-md">
            {current.subtitle || 'Be the first to know about new releases, styling ideas and everything MEOW.'}
          </p>
        </div>

        {/* Right: Newsletter Input Form with Black Circular Arrow Button */}
        <div className="w-full md:w-auto flex-shrink-0">
          {submitted ? (
            <div className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200 text-[#1A1A1A] text-xs font-medium shadow-sm">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>You're on the list. Welcome to MEOW.</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex items-center bg-white rounded-full p-1 sm:p-1.5 pl-4 sm:pl-6 w-full md:w-[380px] lg:w-[440px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-neutral-200/60 focus-within:border-neutral-900 transition-all"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-transparent text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none flex-1 py-1.5 sm:py-2 min-w-0 font-sans"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#181818] hover:bg-black text-white flex items-center justify-center transition-colors shadow-sm flex-shrink-0 group"
              >
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
