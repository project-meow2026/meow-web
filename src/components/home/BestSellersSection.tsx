'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/lib/supabase/types';
import { ProductCard } from '@/components/shop/ProductCard';

interface BestSellersSectionProps {
  products: Product[];
}

export const BestSellersSection: React.FC<BestSellersSectionProps> = ({ products }) => {
  const bestSellers = products.filter((p) => p.is_bestseller).slice(0, 4);
  const displayProducts = bestSellers.length > 0 ? bestSellers : products.slice(0, 4);

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-meow-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-meow-subtle block mb-1 font-sans">
              Customer Favorites
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-meow-dark tracking-tight">
              BEST SELLERS
            </h2>
          </div>
          <Link
            href="/shop?sort=bestseller"
            className="group flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-meow-dark hover:text-meow-muted transition-colors pb-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid with Editorial Promo Banner as in Reference PDF */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {/* Editorial Banner Card matching PDF page 2 */}
          <div className="relative rounded-lg overflow-hidden border border-meow-border bg-[#1A1918] p-6 sm:p-8 flex flex-col justify-between min-h-[360px] group shadow-sm">
            {/* Subtle luxury ambient texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.06),transparent_60%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D8C7B5] font-medium font-sans">
                MEOW Heritage
              </span>
              <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center">
                <span className="font-editorial text-xs text-white">M</span>
              </div>
            </div>

            <div className="relative z-10 space-y-3">
              <h3 className="font-editorial text-2xl sm:text-3xl text-white font-medium leading-tight">
                Every Step A Story
              </h3>
              <p className="text-xs text-white/70 font-sans leading-relaxed">
                Crafted for everyday comfort. Engineered anatomical support.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#E8DCCB] font-semibold pt-1 border-b border-[#E8DCCB]/60 hover:border-white hover:text-white transition-colors"
              >
                <span>EXPLORE NOW</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
