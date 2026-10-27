'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '@/lib/supabase/types';
import { ProductCard } from '@/components/shop/ProductCard';

interface NewArrivalsSectionProps {
  products: Product[];
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({ products }) => {
  const newArrivals = products.filter((p) => p.is_new_arrival).slice(0, 4);
  const displayProducts = newArrivals.length > 0 ? newArrivals : products.slice(0, 4);

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 bg-[#FAF9F6] border-b border-meow-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-meow-terracotta font-sans mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Just Released</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-meow-dark tracking-tight">
              NEW ARRIVALS
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="group flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-meow-dark hover:text-meow-muted transition-colors pb-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
