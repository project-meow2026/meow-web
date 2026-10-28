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
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { dbService, INITIAL_ABOUT_SECTION } from '@/lib/storage/db';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary/upload';
import { AboutSection } from '@/lib/supabase/types';

export default function AboutPage() {
  const [content, setContent] = useState<AboutSection>(() =>
    dbService.getAboutSectionSync()
  );

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
      icon: Leaf,
      title: 'PREMIUM MATERIALS',
      desc: 'Carefully selected for long-lasting wear.',
    },
    {
      icon: Footprints,
      title: 'ALL-DAY COMFORT',
      desc: 'Designed for real everyday movement.',
    },
    {
      icon: ShieldCheck,
      title: 'DURABLE & RELIABLE',
      desc: 'Built to keep up with your journey.',
    },
    {
      icon: Star,
      title: 'TIMELESS DESIGN',
      desc: 'Styles that never go out of trend.',
    },
  ];

  const getValueIcon = (title: string, index: number) => {
    const normalized = (title || '').toLowerCase();
    if (normalized.includes('quality')) return Gem;
    if (normalized.includes('minimal') || normalized.includes('design')) return Palette;
    if (normalized.includes('customer')) return User;
    if (normalized.includes('green') || normalized.includes('eco')) return Leaf;
    const fallbackIcons = [Gem, Palette, User, Leaf];
    return fallbackIcons[index % fallbackIcons.length];
  };

  return (
    <>
      <Header />

      <main className="bg-[#FAF8F5] min-h-screen overflow-x-hidden">
        {/* SECTION 1: TOP HERO BANNER */}
        <section className="relative min-h-[340px] sm:min-h-[440px] lg:min-h-[520px] flex items-center bg-[#E8DFD1] overflow-hidden">
          {content.banner_image_url && (
            <img
              src={optimizeCloudinaryUrl(content.banner_image_url, 1800)}
              alt={content.heading || 'Our Story'}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-[65%_center] sm:object-center"
            />
          )}

          <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-10 lg:px-14 py-12 sm:py-20 lg:py-24">
            <div className="max-w-lg space-y-3.5 sm:space-y-5">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#2B2520] font-sans font-medium block">
                {content.tagline || 'OUR STORY'}
              </span>
              <h1 className="font-editorial text-3xl sm:text-5xl lg:text-[60px] font-normal text-[#1E1A17] tracking-tight leading-[1.08] uppercase whitespace-pre-line">
                {content.heading || 'CRAFTED\nFOR A\nBOLDER YOU.'}
              </h1>
              <p className="text-xs sm:text-[15px] text-[#3A332C] font-sans leading-[1.65] sm:leading-[1.7] max-w-sm sm:max-w-md pt-0.5">
                {content.story_summary}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: ABOUT MEOW — EVERY STEP A STORY */}
        <section className="py-10 sm:py-16 lg:py-20 bg-[#FAF8F5] border-b border-[#EAE5DC]">
          <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
              {/* Left Column: Square Craft Photography (Uploaded from Admin) */}
              <div className="lg:col-span-4">
                <div className="aspect-[4/3.6] sm:aspect-[1/1.02] w-full overflow-hidden bg-[#EFECE6] border border-[#E5E0D6] flex items-center justify-center">
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

              {/* Middle Column: ABOUT MEOW Copy */}
              <div className="lg:col-span-4 space-y-3 sm:space-y-4 lg:px-2">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#5A524B] font-sans font-medium block">
                  ABOUT MEOW
                </span>
                <h2 className="font-editorial text-2xl sm:text-4xl lg:text-[42px] font-normal text-[#1E1A17] leading-[1.12] tracking-tight uppercase whitespace-pre-line">
                  {content.craft_heading || 'EVERY STEP\nA STORY'}
                </h2>
                <p className="text-xs sm:text-[13.5px] text-[#4A433C] leading-[1.75] font-sans pt-0.5 whitespace-pre-line">
                  {content.craft_body}
                </p>
                {content.story_detail && (
                  <p className="text-xs sm:text-[13.5px] text-[#4A433C] leading-[1.75] font-sans pt-1 whitespace-pre-line">
                    {content.story_detail}
                  </p>
                )}
              </div>

              {/* Right Column: 4 Feature Badges with Circular Icons */}
              <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5 lg:gap-6 lg:pl-4 pt-2 lg:pt-0">
                {featurePillars.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div key={pillar.title} className="flex items-center gap-3.5 sm:gap-4">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#F2EFE9] border border-[#E6E1D8] flex items-center justify-center shrink-0 text-[#2B2520]">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-[11px] sm:text-xs uppercase tracking-[0.08em] font-semibold text-[#1E1A17]">
                          {pillar.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-[#6E665E] font-sans leading-relaxed">
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
        <section className="py-10 sm:py-16 lg:py-20 bg-[#F5F2EC]">
          <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-8 lg:gap-10 items-stretch">
              {/* Left 7 Columns: OUR VALUES Header + 4 Value Cards */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div className="flex items-center gap-4 sm:gap-5 mb-5 sm:mb-6">
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#3A332C] font-sans font-medium shrink-0">
                    OUR VALUES
                  </span>
                  <div className="h-px bg-[#DFD9CE] flex-1" />
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-3.5 flex-1">
                  {(content.values || []).map((val, idx) => {
                    const IconComponent = getValueIcon(val.title, idx);
                    return (
                      <div
                        key={val.title || idx}
                        className="rounded-xl bg-[#FAF9F6] border border-[#E8E3DA] p-3.5 sm:p-5 flex flex-col justify-start space-y-2.5 sm:space-y-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                      >
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#F1EDE4] flex items-center justify-center text-[#2B2520]">
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
                        </div>
                        <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.06em] text-[#1E1A17] pt-0.5 leading-snug">
                          {val.title}
                        </h3>
                        <p className="text-[11px] sm:text-[11.5px] text-[#5C544D] leading-[1.55] sm:leading-[1.6] font-sans">
                          {val.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right 5 Columns: Craftsmanship Image with Overlay Text */}
              <div className="lg:col-span-5">
                <div className="relative w-full h-full aspect-[4/3] sm:aspect-auto sm:min-h-[300px] overflow-hidden bg-[#2A211B] border border-[#E5E0D6] flex items-end">
                  {content.values_image_url && (
                    <img
                      src={optimizeCloudinaryUrl(content.values_image_url, 1000)}
                      alt={content.values_image_caption || 'Tradition Meets Modern Style'}
                      loading="eager"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                  <div className="relative z-10 p-5 sm:p-8">
                    <h3 className="font-editorial text-xl sm:text-[26px] text-white uppercase leading-[1.2] tracking-wide whitespace-pre-line">
                      {content.values_image_caption || 'TRADITION\nMEETS\nMODERN STYLE'}
                    </h3>
                    <div className="w-10 sm:w-12 h-px bg-white/75 mt-3 sm:mt-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: OUR VISION & OUR MISSION DARK BANNER */}
        <section className="relative bg-[#1A130E] text-white overflow-hidden min-h-[300px] sm:min-h-[380px] py-16 sm:py-24 lg:py-28 flex items-center">
          {content.vision_image_url && (
            <>
              <img
                src={optimizeCloudinaryUrl(content.vision_image_url, 1600)}
                alt="Our Vision and Mission"
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-[#140E0A]/60 via-[#18120E]/40 to-[#140E0A]/60 pointer-events-none" />
            </>
          )}

          <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-10 lg:px-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 md:divide-x md:divide-white/25 items-stretch">
              {/* Left Column: OUR VISION */}
              <div className="md:pr-12 lg:pr-16 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <span className="text-[11px] uppercase tracking-[0.35em] text-white/85 font-sans font-medium block">
                    OUR VISION
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl lg:text-[34px] font-normal text-white uppercase leading-[1.24] tracking-wide whitespace-pre-line drop-shadow-sm max-w-[460px]">
                    {!content.vision_text ||
                    content.vision_text.toLowerCase().includes('comfortable world')
                      ? 'TO MAKE EVERY STEP\nA MORE COMFORTABLE\nWORLD.'
                      : content.vision_text}
                  </h3>
                </div>
                <div className="w-12 h-px bg-white/65 mt-6" />
              </div>

              {/* Right Column: OUR MISSION */}
              <div className="md:pl-12 lg:pl-16 flex flex-col justify-between space-y-4 pt-8 md:pt-0 border-t border-white/20 md:border-t-0">
                <div className="space-y-4">
                  <span className="text-[11px] uppercase tracking-[0.35em] text-white/85 font-sans font-medium block">
                    OUR MISSION
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl lg:text-[34px] font-normal text-white uppercase leading-[1.24] tracking-wide whitespace-pre-line drop-shadow-sm max-w-[460px]">
                    {!content.mission_text ||
                    content.mission_text.toLowerCase().includes('inspires confidence')
                      ? 'TO CRAFT FOOTWEAR\nTHAT INSPIRES CONFIDENCE\nEVERYDAY.'
                      : content.mission_text}
                  </h3>
                </div>
                <div className="w-12 h-px bg-white/65 mt-6" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
