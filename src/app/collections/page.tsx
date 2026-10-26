'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SketchIllustration } from '@/components/common/SketchIllustration';
import { dbService } from '@/lib/storage/db';
import { Category } from '@/lib/supabase/types';

export default function CollectionsPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function load() {
      const cats = await dbService.getCategories();
      setCategories(cats);
    }
    load();
  }, []);

  const getSketchType = (
    slug: string
  ): 'eva-women' | 'cork-women' | 'dd-women' | 'eva-kids' | 'cork-kids' | 'magic-kids' => {
    switch (slug) {
      case 'eva-for-women':
        return 'eva-women';
      case 'cork-inn-for-women':
        return 'cork-women';
      case 'double-density-for-women':
        return 'dd-women';
      case 'eva-for-kids':
        return 'eva-kids';
      case 'cork-inn-kids':
        return 'cork-kids';
      case 'magic-craft-for-kids':
        return 'magic-kids';
      default:
        return 'eva-women';
    }
  };

  return (
    <>
      <Header />

      <main className="bg-white min-h-screen pb-20">
        {/* Banner */}
        <div className="bg-[#FAF9F6] border-b border-meow-border py-14 sm:py-20 text-center px-4">
          <span className="text-xs uppercase tracking-[0.25em] text-meow-subtle block mb-2 font-sans font-semibold">
            MEOW ARCHITECTURE
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-medium text-meow-dark tracking-tight max-w-xl mx-auto">
            The Six Collections
          </h1>
          <p className="text-xs sm:text-sm text-meow-muted max-w-md mx-auto mt-3 font-sans leading-relaxed">
            Engineered comfort categories tailored for women and kids, built around natural anatomy and modern minimalist styling.
          </p>
        </div>

        {/* 6 Collections Editorial Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, idx) => {
              const sketchType = getSketchType(cat.slug);

              return (
                <div
                  key={cat.id || cat.slug}
                  className="group rounded-xl border border-meow-border bg-white overflow-hidden transition-all duration-300 hover:border-meow-dark hover:shadow-lg flex flex-col justify-between"
                >
                  <div className="p-8 flex flex-col items-center text-center space-y-5">
                    {/* Pencil-Sketch Circular Graphic */}
                    <div className="relative w-36 h-36 rounded-full bg-[#FAF9F6] border border-meow-border flex items-center justify-center p-3 group-hover:scale-105 transition-transform">
                      <SketchIllustration type={sketchType} size={135} />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-meow-subtle font-mono">
                        Collection 0{idx + 1}
                      </span>
                      <h2 className="font-editorial text-2xl font-medium text-meow-dark">
                        {cat.name}
                      </h2>
                      <p className="text-xs text-meow-muted leading-relaxed max-w-xs">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border-t border-meow-border bg-meow-surface flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-meow-dark">
                      Anatomical Series
                    </span>
                    <Link
                      href={`/shop?category=${cat.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-meow-dark hover:text-meow-muted transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
