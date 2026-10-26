'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Feather, HeartHandshake, Leaf } from 'lucide-react';

export const BrandStorySection: React.FC = () => {
  const pillars = [
    {
      icon: Feather,
      title: 'Lightweight Comfort',
      desc: 'Feather-density EVA shock absorption with every natural step.',
    },
    {
      icon: ShieldCheck,
      title: 'Anatomical Cork',
      desc: 'Form-adapting contouring for posture and arch stability.',
    },
    {
      icon: HeartHandshake,
      title: 'Mindful Craft',
      desc: 'Hand-inspected durable finishes built to outlast seasons.',
    },
    {
      icon: Leaf,
      title: 'Conscious Future',
      desc: 'Sustainable natural cork, recyclable EVA, and vegan materials.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Editorial Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden border border-meow-border bg-gradient-to-br from-[#FAF9F6] via-[#F4F1EA] to-[#EAE6DD] shadow-sm flex flex-col justify-between p-8 sm:p-12">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.3em] text-meow-subtle font-sans">
                  CONSCIOUS ATELIER
                </span>
                <span className="font-editorial text-sm tracking-wider text-meow-muted">
                  EST. 2024
                </span>
              </div>

              <div className="space-y-3 max-w-sm">
                <div className="w-12 h-0.5 bg-meow-terracotta" />
                <h3 className="font-editorial text-3xl sm:text-4xl text-meow-dark font-medium leading-tight">
                  Crafted for a Bolder You.
                </h3>
                <p className="text-xs sm:text-sm text-meow-muted font-sans leading-relaxed">
                  Sculpted footbeds, ethical materials, and featherlight durability designed to elevate every daily step.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-meow-subtle border-t border-meow-border/60 pt-4">
                <span>01 EVA Cushioning</span>
                <span>•</span>
                <span>02 Natural Cork</span>
                <span>•</span>
                <span>03 Vegan Nubuck</span>
              </div>
            </div>

            {/* Overlapping Floating Badge */}
            <div className="absolute -bottom-6 right-6 bg-white p-4 sm:p-6 rounded-xl border border-meow-border shadow-lg max-w-xs hidden sm:block">
              <span className="font-editorial text-2xl font-semibold text-meow-dark block leading-none mb-1">
                MEOW
              </span>
              <p className="text-xs text-meow-muted">
                100% Focused on Foot Wellness & Minimalist Aesthetics
              </p>
            </div>
          </div>

          {/* Right Brand Pillars */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-meow-subtle font-sans">
                The MEOW Standard
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-medium text-meow-dark tracking-tight leading-tight">
                Designed for Calm, Confident Living
              </h2>
              <p className="text-sm sm:text-base text-meow-muted font-sans leading-relaxed">
                We believe what touches your feet should liberate your stride. From natural cork footbeds to pillowy double-density outsoles, every MEOW piece is made for modern life.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {pillars.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="p-4 rounded-lg border border-meow-border bg-[#FAF9F6] space-y-1.5">
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

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-meow-dark hover:text-meow-muted transition-colors border-b border-meow-dark pb-1"
              >
                <span>Read Our Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
