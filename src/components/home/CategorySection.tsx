'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/lib/supabase/types';
import { SketchIllustration } from '@/components/common/SketchIllustration';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary/upload';

interface CategorySectionProps {
  categories: Category[];
}

interface CategoryCardProps {
  cat: Category;
  sketchType: 'eva-women' | 'cork-women' | 'dd-women' | 'eva-kids' | 'cork-kids' | 'magic-kids';
}

const CategoryCard: React.FC<CategoryCardProps> = ({ cat, sketchType }) => {
  const [imageError, setImageError] = useState(false);

  // If user uploaded an image (Cloudinary or other custom URL)
  const customImageUrl = cat.sketch_image_url || cat.banner_image_url;
  const isSvgFallback = customImageUrl
    ? customImageUrl.endsWith('.svg') && customImageUrl.includes('/images/sketches/')
    : false;
  const showCustomImage = Boolean(customImageUrl) && !isSvgFallback && !imageError;

  return (
    <Link
      href={`/shop?category=${cat.slug}`}
      className="group flex flex-col items-center text-center space-y-2.5 sm:space-y-3 cursor-pointer"
    >
      {/* Circular Medallion Container with ivory background & shadow for backgroundless shoes */}
      <div className="relative w-28 h-28 xs:w-32 xs:h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full bg-[#FAF9F6] border border-meow-border flex items-center justify-center transition-all duration-300 group-hover:border-meow-dark group-hover:shadow-lg group-hover:-translate-y-1 overflow-hidden flex-shrink-0">
        {/* Subtle graphite textured circle */}
        <div className="absolute inset-0 bg-[radial-gradient(#E8E4DC_1px,transparent_1px)] [background-size:8px_8px] opacity-40 pointer-events-none" />

        {showCustomImage ? (
          <div className="relative w-full h-full flex items-center justify-center p-2.5 sm:p-4 z-10">
            <img
              src={optimizeCloudinaryUrl(customImageUrl!, 400)}
              alt={cat.name}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="max-w-[82%] max-h-[75%] w-auto h-auto object-contain object-center transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.12)] mix-blend-multiply select-none"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center p-2 z-10">
            <SketchIllustration type={sketchType} size={95} />
          </div>
        )}
      </div>

      {/* Category Title below */}
      <div className="px-1">
        <h3 className="text-[11px] sm:text-sm font-semibold uppercase tracking-wider text-meow-dark group-hover:text-meow-muted transition-colors leading-snug">
          {cat.name}
        </h3>
        <span className="text-[10px] sm:text-[11px] text-meow-subtle hidden sm:block mt-0.5">
          Explore Style
        </span>
      </div>
    </Link>
  );
};

export const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  // Map category slug to sketch type
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

  const activeCategories = categories.filter((c) => c.is_active !== false);
  const displayCategories = activeCategories.length > 0 ? activeCategories.slice(0, 6) : categories.slice(0, 6);

  return (
    <section className="py-10 sm:py-20 bg-white border-b border-meow-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-14">
          <div>
            <span className="text-[9px] sm:text-xs uppercase tracking-[0.25em] text-meow-subtle block mb-0.5 sm:mb-1 font-sans">
              Handcrafted Collections
            </span>
            <h2 className="font-editorial text-2xl sm:text-4xl font-medium text-meow-dark tracking-tight">
              SHOP BY CATEGORY
            </h2>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-1 text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-meow-dark hover:text-meow-muted transition-colors pb-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 6 Circular Pencil-Sketch or Custom Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-8">
          {displayCategories.map((cat) => (
            <CategoryCard
              key={cat.id || cat.slug}
              cat={cat}
              sketchType={getSketchType(cat.slug)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
