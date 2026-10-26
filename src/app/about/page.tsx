'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Feather,
  Clock,
  Sparkles,
  Heart,
  Leaf,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { dbService, INITIAL_ABOUT_SECTION } from '@/lib/storage/db';
import { AboutSection } from '@/lib/supabase/types';

export default function AboutPage() {
  const [content, setContent] = useState<AboutSection>(INITIAL_ABOUT_SECTION);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAbout() {
      try {
        const data = await dbService.getAboutSection();
        setContent(data);
      } catch (err) {
        console.error('Failed to load about section:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAbout();
  }, []);

  const featurePillars = [
    {
      icon: ShieldCheck,
      title: 'Premium Materials',
      desc: 'Carefully selected for long-lasting wear and moisture resistance.',
    },
    {
      icon: Feather,
      title: 'All-Day Comfort',
      desc: 'Designed for real everyday movement with anatomical arch balance.',
    },
    {
      icon: Clock,
      title: 'Durable & Reliable',
      desc: 'Built to keep up with your daily journey across urban and coastal settings.',
    },
    {
      icon: Sparkles,
      title: 'Timeless Design',
      desc: 'Styles that never go out of trend, elevating any wardrobe effortlessly.',
    },
  ];

  const valueIcons: Record<string, any> = {
    'Quality First': ShieldCheck,
    'Minimal Design': Sparkles,
    'Customer Focus': Heart,
    'A Greener Tomorrow': Leaf,
  };

  return (
    <>
      <Header />

      <main className="bg-white min-h-screen pb-20">
        {/* Hero Banner matching Reference PDF page 6 */}
        <section className="relative bg-gradient-to-r from-[#F5F2EB] via-[#FAF9F6] to-[#ECE8E1] border-b border-meow-border overflow-hidden">
          {content.banner_image_url && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-multiply"
              style={{
                backgroundImage: `url(${content.banner_image_url})`,
              }}
            />
          )}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,0,0,0.02),transparent_70%)] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-4 max-w-3xl">
            <span className="text-xs uppercase tracking-[0.25em] text-meow-terracotta font-sans font-semibold">
              {content.tagline || 'OUR STORY'}
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-medium text-meow-dark tracking-tight leading-tight">
              {content.heading || 'CRAFTED FOR A BOLDER YOU.'}
            </h1>
            <p className="text-sm sm:text-base text-meow-dark/85 font-sans leading-relaxed">
              {content.story_summary}
            </p>
          </div>
        </section>

        {/* Section 2: ABOUT MEOW - EVERY STEP A STORY */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Editorial Craft Photography */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-meow-border shadow-md bg-gradient-to-br from-[#FAF9F6] to-[#ECE8E1] flex items-center justify-center">
                {content.craft_image_url ? (
                  <img
                    src={content.craft_image_url}
                    alt="MEOW Leather and Cork Craftsmanship"
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="text-center p-8 space-y-3">
                    <div className="w-14 h-14 rounded-full border border-meow-border mx-auto flex items-center justify-center bg-white/80">
                      <span className="font-editorial text-xl font-bold text-meow-dark">M</span>
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.25em] text-meow-subtle font-sans block">
                      HANDCRAFTED EXCELLENCE
                    </span>
                    <p className="text-xs text-meow-muted max-w-xs font-sans">
                      Anatomical cork footbeds, lightweight EVA, and hand-inspected details.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Craft Description & Pillars */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.25em] text-meow-subtle font-semibold">
                  ABOUT MEOW
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-meow-dark tracking-tight">
                  {content.craft_heading || 'EVERY STEP A STORY'}
                </h2>
                <p className="text-sm text-meow-muted leading-relaxed font-sans">
                  {content.craft_body}
                </p>
                {content.story_detail && (
                  <p className="text-sm text-meow-muted leading-relaxed font-sans pt-1">
                    {content.story_detail}
                  </p>
                )}
              </div>

              {/* 4 Feature Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {featurePillars.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.title}
                      className="p-4 rounded-xl border border-meow-border bg-[#FAF9F6] space-y-1.5"
                    >
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-meow-dark border border-meow-border">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs uppercase tracking-wider font-semibold text-meow-dark">
                        {p.title}
                      </h4>
                      <p className="text-xs text-meow-muted leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: OUR VALUES */}
        <section className="py-16 bg-[#FAF9F6] border-y border-meow-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-meow-subtle font-semibold">
                OUR PHILOSOPHY
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-meow-dark tracking-tight">
                OUR VALUES
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.values.map((v, idx) => {
                const IconComponent = valueIcons[v.title] || ShieldCheck;
                return (
                  <div
                    key={v.title || idx}
                    className="p-6 rounded-xl border border-meow-border bg-white space-y-3 hover:border-meow-dark transition-colors shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#FAF9F6] border border-meow-border flex items-center justify-center text-meow-dark">
                      <IconComponent className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-meow-dark">
                      {v.title}
                    </h3>
                    <p className="text-xs text-meow-muted leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 4: OUR VISION & MISSION BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="relative rounded-2xl overflow-hidden border border-meow-border bg-meow-dark text-white p-8 sm:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 divide-y md:divide-y-0 md:divide-x divide-white/20">
              <div className="space-y-3 pr-0 md:pr-8">
                <span className="text-xs uppercase tracking-[0.25em] text-white/60 font-semibold">
                  OUR VISION
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-white">
                  {content.vision_text || 'To make every step a more comfortable world.'}
                </h3>
              </div>

              <div className="space-y-3 pt-8 md:pt-0 pl-0 md:pl-8">
                <span className="text-xs uppercase tracking-[0.25em] text-white/60 font-semibold">
                  OUR MISSION
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-white">
                  {content.mission_text || 'To craft footwear that inspires confidence everyday.'}
                </h3>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
