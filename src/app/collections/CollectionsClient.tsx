'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { dbService, INITIAL_COLLECTIONS_PAGE } from '@/lib/storage/db';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary/upload';
import { CollectionsPageSetting } from '@/lib/supabase/types';

export default function CollectionsClient({
  initialContent,
}: {
  initialContent: CollectionsPageSetting;
}) {
  const [content, setContent] = useState<CollectionsPageSetting>(initialContent);

  useEffect(() => {
    async function load() {
      try {
        const data = await dbService.getCollectionsPage();
        setContent(data);
      } catch (e) {
        console.error('Failed to load collections page:', e);
      }
    }
    load();
  }, []);

  const cards =
    content.cards && content.cards.length > 0
      ? content.cards
      : INITIAL_COLLECTIONS_PAGE.cards;

  return (
    <>
      <Header />

      <main className="bg-[#FAF8F5] min-h-screen overflow-x-hidden">
        {/* SECTION 1: TOP HERO BANNER */}
        <section className="relative min-h-[300px] sm:min-h-[440px] lg:min-h-[500px] flex items-center bg-[#EBE3D5] overflow-hidden">
          {content.hero_image_url && (
            <img
              src={optimizeCloudinaryUrl(content.hero_image_url, 1800)}
              alt={content.hero_heading || 'The Six Collections'}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-[65%_center] sm:object-center"
            />
          )}

          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-10 lg:px-14 py-10 sm:py-20 lg:py-24">
            <div className="max-w-[62%] sm:max-w-lg">
              <span className="text-[9px] sm:text-xs uppercase tracking-[0.35em] text-[#2B2520] font-sans font-medium block mb-2 sm:mb-3">
                {content.hero_badge || 'COLLECTIONS'}
              </span>
              <h1 className="font-editorial text-3xl sm:text-5xl lg:text-[62px] font-normal text-[#1E1A17] tracking-tight leading-[1.06] whitespace-pre-line mb-3 sm:mb-4">
                {content.hero_heading || 'The Six\nCollections'}
              </h1>
              <p className="text-[11px] sm:text-[14.5px] text-[#3A332C] font-sans leading-[1.55] sm:leading-[1.65] max-w-md">
                {content.hero_subtitle}
              </p>
              <div className="w-7 sm:w-8 h-[1.5px] bg-[#9E7B56] my-3 sm:my-5" />
              <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold text-[#1E1A17] block">
                {content.hero_accent || 'DISCOVER YOUR EVERYDAY PAIR'}
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE 6 COLLECTION CARDS GRID (2x2 on Mobile, 3x2 on Desktop) */}
        <section className="py-6 sm:py-14 lg:py-16">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-10 lg:px-14">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-7">
              {cards.map((card, idx) => (
                <Link
                  key={card.id || card.slug || idx}
                  href={`/shop?category=${card.slug}`}
                  className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#F4F1EA] border border-[#E8E2D8] aspect-[3/3.6] sm:aspect-[4/4.15] flex flex-col justify-between p-3.5 sm:p-7 transition-all duration-300 hover:shadow-lg"
                >
                  {/* Uploaded Card Background Image from Admin */}
                  {card.image_url && (
                    <img
                      src={optimizeCloudinaryUrl(card.image_url, 900)}
                      alt={card.title.replace('\n', ' ')}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  )}

                  {/* Top-Left Card Copy */}
                  <div className="relative z-10 max-w-[72%] sm:max-w-[62%] space-y-1 sm:space-y-2">
                    <span className="text-[10px] sm:text-xs font-sans font-bold text-[#1E1A17] block">
                      {card.number || `0${idx + 1}`}
                    </span>
                    <h2 className="font-editorial text-[15px] sm:text-[28px] lg:text-[30px] font-normal text-[#1E1A17] leading-[1.12] tracking-tight whitespace-pre-line">
                      {card.title}
                    </h2>
                    <div className="w-4 sm:w-6 h-[1.5px] bg-[#8C6D4F] my-1.5 sm:my-2.5" />
                    <p className="text-[9.5px] sm:text-xs text-[#3D3630] leading-[1.4] sm:leading-[1.55] font-sans line-clamp-3 sm:line-clamp-none">
                      {card.description}
                    </p>
                  </div>

                  {/* Bottom-Left Circular Arrow Button */}
                  <div className="relative z-10 mt-auto pt-2 sm:pt-4">
                    <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-full border border-[#1E1A17]/60 bg-white/30 backdrop-blur-[2px] flex items-center justify-center text-[#1E1A17] transition-all duration-300 group-hover:bg-[#1E1A17] group-hover:text-white group-hover:border-[#1E1A17]">
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 stroke-[1.5] transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: BOTTOM DARK PHILOSOPHY BANNER */}
        <section className="pb-10 sm:pb-16 lg:pb-20">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-10 lg:px-14">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#231912] text-white min-h-[190px] sm:min-h-[250px] lg:min-h-[270px] flex items-center">
              {content.philosophy_image_url && (
                <>
                  <img
                    src={optimizeCloudinaryUrl(content.philosophy_image_url, 1600)}
                    alt={content.philosophy_heading || 'Our Philosophy'}
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#18110C]/80 via-[#18110C]/45 to-[#18110C]/75 lg:from-transparent lg:via-[#18110C]/50 lg:to-[#18110C]/80 pointer-events-none" />
                </>
              )}

              <div className="relative z-10 w-full p-5 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 items-center gap-5 sm:gap-6">
                {/* Left Spacer so left side of banner image remains clear on desktop */}
                <div className="hidden lg:block lg:col-span-6" />

                {/* Right Philosophy Content (shifted further right) */}
                <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-0 sm:divide-x sm:divide-white/25 items-center">
                  <div className="sm:col-span-6 sm:pl-4 lg:pl-6 sm:pr-6 space-y-1.5 sm:space-y-2">
                    <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.32em] text-white/80 font-sans font-medium block">
                      {content.philosophy_badge || 'OUR PHILOSOPHY'}
                    </span>
                    <h3 className="font-editorial text-xl sm:text-3xl lg:text-[32px] font-normal text-white uppercase leading-[1.15] tracking-wide whitespace-pre-line">
                      {content.philosophy_heading || 'MADE FOR\nEVERY STEP.'}
                    </h3>
                    <div className="w-8 h-px bg-white/65 mt-2.5 sm:mt-3" />
                  </div>

                  <div className="sm:col-span-6 sm:pl-6 lg:pl-8 pt-3 sm:pt-0 border-t border-white/15 sm:border-t-0">
                    <p className="text-[11px] sm:text-[13.5px] text-white/85 leading-[1.6] sm:leading-[1.65] font-sans max-w-xs">
                      {content.philosophy_body}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
