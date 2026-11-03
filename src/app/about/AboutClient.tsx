'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Footprints,
  Star,
  Leaf,
  Gem,
  Palette,
  User,
  Sparkles,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { dbService, INITIAL_ABOUT_SECTION } from '@/lib/storage/db';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary/upload';
import { AboutSection } from '@/lib/supabase/types';

export default function AboutClient({ initialContent }: { initialContent: AboutSection }) {
  const [content, setContent] = useState<AboutSection>(initialContent);

  useEffect(() => {
    async function loadAbout() {
      try {
        const data = await dbService.getAboutSection();
        setContent(data);
      } catch (err) {
        console.error('Failed to load about section:', err);
      }
    }
    loadAbout();
  }, []);

  const featurePillars = [
    {
      icon: Sparkles,
      title: 'PARISIAN HERITAGE',
      desc: 'Inspired by timeless Parisian charm & elegance.',
    },
    {
      icon: Footprints,
      title: 'LUXURIOUS COMFORT',
      desc: 'Distinctive silhouettes for effortless movement.',
    },
    {
      icon: Gem,
      title: 'FINEST DETAILS',
      desc: 'Genuine luxury reflected in every single detail.',
    },
    {
      icon: Star,
      title: 'TIMELESS DESIGN',
      desc: 'Refined aesthetics made to transcend trends.',
    },
  ];

  const getValueIcon = (title: string, index: number) => {
    const normalized = (title || '').toLowerCase();
    if (normalized.includes('quality') || normalized.includes('craft') || normalized.includes('artistry')) return Gem;
    if (normalized.includes('minimal') || normalized.includes('design') || normalized.includes('simplicity')) return Palette;
    if (normalized.includes('customer') || normalized.includes('femininity') || normalized.includes('women') || normalized.includes('expression')) return User;
    if (normalized.includes('green') || normalized.includes('eco') || normalized.includes('parisian') || normalized.includes('heritage')) return Sparkles;
    const fallbackIcons = [Gem, Palette, User, Sparkles];
    return fallbackIcons[index % fallbackIcons.length];
  };

  return (
    <>
      <Header />

      <main className="bg-[#FAF8F5] min-h-screen overflow-x-hidden">
        {/* SECTION 1: TOP HERO BANNER */}
        <section className="relative min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] flex items-center bg-[#E8DFD1] overflow-hidden">
          {content.banner_image_url && (
            <img
              src={optimizeCloudinaryUrl(content.banner_image_url, 1800)}
              alt={content.heading || 'Our Story'}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-[80%_center] sm:object-center"
            />
          )}

          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 xs:px-5 sm:px-10 lg:px-14 py-8 sm:py-20 lg:py-24">
            {/* Elegant luxury frosted card on mobile: guarantees 100% text visibility without a washed-out photo */}
            <div className="max-w-full sm:max-w-xl space-y-3 sm:space-y-4 bg-[#FAF8F5]/90 backdrop-blur-md p-5 xs:p-6 sm:p-0 rounded-lg sm:rounded-none sm:bg-transparent sm:backdrop-blur-none border border-[#E8E1D5]/80 sm:border-0 shadow-sm sm:shadow-none">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#8C6D4F] font-sans font-semibold block">
                {content.tagline || 'ABOUT US • EST. 1994'}
              </span>
              <h1 className="font-editorial text-2xl xs:text-3xl sm:text-5xl lg:text-[62px] font-normal text-[#1E1A17] tracking-tight leading-[1.08] sm:leading-[1.05] uppercase whitespace-pre-line">
                {content.heading || 'THE PARISIAN\nART OF\nELEGANCE.'}
              </h1>
              <div className="w-8 sm:w-10 h-[1.5px] bg-[#9E7B56] my-2 sm:my-3" />
              <p className="text-xs sm:text-[15px] text-[#3A332C] font-sans leading-[1.65] sm:leading-[1.7] max-w-md pt-0.5">
                {content.story_summary}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: ABOUT MEOW — BRAND NARRATIVE & CRAFTSMANSHIP */}
        <section className="py-12 sm:py-16 lg:py-20 bg-[#FAF8F5] border-b border-[#EAE5DC]">
          <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start">
              {/* Left Column: Square Craft Photography (Uploaded from Admin) */}
              <div className="lg:col-span-4 self-center">
                <div className="aspect-[4/3.6] sm:aspect-[1/1.02] w-full overflow-hidden bg-[#EFECE6] border border-[#E5E0D6] rounded-sm flex items-center justify-center shadow-xs">
                  {content.craft_image_url ? (
                    <img
                      src={optimizeCloudinaryUrl(content.craft_image_url, 1000)}
                      alt={content.craft_heading || 'About MEOW Craftsmanship'}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#EFECE6]" />
                  )}
                </div>
              </div>

              {/* Middle Column: ABOUT MEOW Story Narrative */}
              <div className="lg:col-span-5 space-y-4 lg:px-2">
                <div className="space-y-2">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#8C6D4F] font-sans font-semibold block">
                    ABOUT MEOW
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl lg:text-[38px] font-normal text-[#1E1A17] leading-[1.14] tracking-tight uppercase whitespace-pre-line">
                    {content.craft_heading || 'EXPERIENCE THE MAGIC\nOF CRAFTSMANSHIP'}
                  </h2>
                  <div className="w-8 h-[1.5px] bg-[#9E7B56] my-2" />
                </div>

                {/* Body Paragraphs with Luxury Formatting */}
                <div className="space-y-3.5 pt-1">
                  {(content.craft_body || '')
                    .split(/\n\n+/)
                    .filter(Boolean)
                    .map((para, i) => {
                      const isQuote =
                        para.toLowerCase().includes('true elegance lies in simplicity') ||
                        para.toLowerCase().includes('we believe that true elegance');

                      if (isQuote) {
                        return (
                          <div
                            key={i}
                            className="pl-4 py-2.5 my-2 border-l-2 border-[#9E7B56] bg-[#F4EFE6]/70 rounded-r-md"
                          >
                            <p className="text-xs sm:text-[13px] text-[#2C241E] leading-[1.7] font-sans italic">
                              &ldquo;{para}&rdquo;
                            </p>
                          </div>
                        );
                      }

                      return (
                        <p
                          key={i}
                          className="text-xs sm:text-[13.5px] text-[#4A433C] leading-[1.75] font-sans"
                        >
                          {para}
                        </p>
                      );
                    })}

                  {/* Story Detail Paragraphs (Paris & Individual Expression) */}
                  {content.story_detail &&
                    content.story_detail
                      .split(/\n\n+/)
                      .filter(Boolean)
                      .map((para, i) => (
                        <p
                          key={`detail-${i}`}
                          className="text-xs sm:text-[13.5px] text-[#4A433C] leading-[1.75] font-sans"
                        >
                          {para}
                        </p>
                      ))}
                </div>
              </div>

              {/* Right Column: 4 Feature Pillars with Circular Icons */}
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-4.5 lg:gap-5 lg:pl-2 pt-2 lg:pt-0">
                {featurePillars.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.title}
                      className="flex items-start gap-3.5 p-3 rounded-lg bg-[#FAF9F6]/80 border border-[#ECE7DE] transition-colors hover:border-[#D9CDBD]"
                    >
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#F2EFE9] border border-[#E6E1D8] flex items-center justify-center shrink-0 text-[#2B2520] mt-0.5">
                        <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.5]" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.1em] font-bold text-[#1E1A17]">
                          {pillar.title}
                        </h3>
                        <p className="text-[11px] text-[#6E665E] font-sans leading-relaxed">
                          {pillar.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: OUR VALUES + RIGHT CRAFTSMANSHIP IMAGE */}
        <section className="py-12 sm:py-16 lg:py-20 bg-[#F5F2EC]">
          <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-8 lg:gap-10 items-stretch">
              {/* Left 7 Columns: OUR VALUES Header + 4 Value Cards in Balanced 2x2 Grid */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div className="flex items-center gap-4 sm:gap-5 mb-5 sm:mb-6">
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#3A332C] font-sans font-semibold shrink-0">
                    OUR VALUES
                  </span>
                  <div className="h-px bg-[#DFD9CE] flex-1" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 flex-1">
                  {(content.values || []).map((val, idx) => {
                    const IconComponent = getValueIcon(val.title, idx);
                    return (
                      <div
                        key={val.title || idx}
                        className="rounded-xl bg-[#FAF9F6] border border-[#E8E3DA] p-4 sm:p-5 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:border-[#D6CEC1] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] h-full"
                      >
                        <div className="space-y-2.5">
                          {/* Header row: Icon + Title aligned cleanly */}
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F1EDE4] border border-[#E6E0D6] flex items-center justify-center text-[#2B2520] shrink-0">
                              <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.5]" />
                            </div>
                            <h3 className="text-xs sm:text-[12.5px] font-bold uppercase tracking-[0.08em] text-[#1E1A17] leading-tight">
                              {val.title}
                            </h3>
                          </div>

                          {/* Description text with refined alignment and line-height */}
                          <p className="text-xs sm:text-[12px] text-[#5C544D] leading-[1.65] font-sans">
                            {val.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right 5 Columns: Craftsmanship Image with Overlay Text */}
              <div className="lg:col-span-5">
                <div className="relative w-full h-full aspect-[4/3] sm:aspect-auto sm:min-h-[340px] lg:min-h-[380px] overflow-hidden bg-[#2A211B] border border-[#E5E0D6] rounded-sm flex items-end shadow-xs">
                  {content.values_image_url && (
                    <img
                      src={optimizeCloudinaryUrl(content.values_image_url, 1000)}
                      alt={content.values_image_caption || 'The Magic of Craftsmanship'}
                      loading="eager"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
                  <div className="relative z-10 p-5 sm:p-8">
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-sans font-semibold block mb-1">
                      Artisanal Heritage
                    </span>
                    <h3 className="font-editorial text-xl sm:text-[26px] text-white uppercase leading-[1.2] tracking-wide whitespace-pre-line">
                      {content.values_image_caption || 'THE MAGIC OF\nCRAFTSMANSHIP'}
                    </h3>
                    <div className="w-10 sm:w-12 h-px bg-[#D4AF37] mt-3 sm:mt-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: OUR VISION & OUR CREED DARK BANNER */}
        <section className="relative bg-[#1A130E] text-white overflow-hidden min-h-[300px] sm:min-h-[360px] py-16 sm:py-22 lg:py-26 flex items-center">
          {content.vision_image_url && (
            <>
              <img
                src={optimizeCloudinaryUrl(content.vision_image_url, 1600)}
                alt="Our Vision and Creed"
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-[#140E0A]/70 via-[#18120E]/50 to-[#140E0A]/70 pointer-events-none" />
            </>
          )}

          <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-10 lg:px-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 md:divide-x md:divide-white/20 items-stretch">
              {/* Left Column: OUR VISION */}
              <div className="md:pr-10 lg:pr-14 flex flex-col justify-between space-y-4">
                <div className="space-y-3.5">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#D4AF37] font-sans font-semibold block">
                    OUR VISION
                  </span>
                  <h3 className="font-editorial text-xl sm:text-2xl lg:text-[28px] font-normal text-white uppercase leading-[1.3] tracking-wide whitespace-pre-line drop-shadow-sm max-w-[500px]">
                    {content.vision_text ||
                      'TO REDEFINE EVERYDAY LUXURY BY MAKING EXCEPTIONAL DESIGN AND COMFORT AN EFFORTLESS PART OF EVERY WOMAN’S JOURNEY.'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-white/70 font-sans tracking-wide pt-1">
                    Exceptional design, anatomical comfort, everyday Parisian luxury.
                  </p>
                </div>
                <div className="w-12 h-px bg-[#D4AF37]/80 mt-4 sm:mt-6" />
              </div>

              {/* Right Column: OUR CREED & MISSION */}
              <div className="md:pl-10 lg:pl-14 flex flex-col justify-between space-y-4 pt-8 md:pt-0 border-t border-white/20 md:border-t-0">
                <div className="space-y-3.5">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#D4AF37] font-sans font-semibold block">
                    OUR CREED
                  </span>
                  <h3 className="font-editorial text-xl sm:text-2xl lg:text-[28px] font-normal text-white uppercase leading-[1.3] tracking-wide whitespace-pre-line drop-shadow-sm max-w-[500px]">
                    {content.mission_text ||
                      'MEOW • EXPERIENCE\nTHE MAGIC OF\nCRAFTSMANSHIP.'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-white/70 font-sans tracking-wide pt-1">
                    Footwear as an expression of personality, elegance and the freedom to be yourself.
                  </p>
                </div>
                <div className="w-12 h-px bg-[#D4AF37]/80 mt-4 sm:mt-6" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
