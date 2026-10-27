'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/lib/supabase/types';
import { ProductCard } from '@/components/shop/ProductCard';

interface NewArrivalsSectionProps {
  products: Product[];
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({ products }) => {
  // Deduplicate products strictly by ID and Slug so no duplicate product can ever appear
  const uniqueProducts: Product[] = [];
  const seen = new Set<string>();

  for (const p of products) {
    const key = (p.id || p.slug || '').trim().toLowerCase();
    if (key && !seen.has(key)) {
      seen.add(key);
      uniqueProducts.push(p);
    }
  }

  // Filter genuine new arrivals, or fallback to genuine catalog products
  const newArrivals = uniqueProducts.filter((p) => p.is_new_arrival);
  const displayProducts = newArrivals.length > 0 ? newArrivals : uniqueProducts;

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-8 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Header matching reference screenshot */}
        <div className="flex items-end justify-between mb-4 sm:mb-8 pb-2.5 sm:pb-3 border-b border-neutral-100">
          <div>
            <span className="text-[9px] sm:text-xs uppercase tracking-[0.25em] text-neutral-400 block mb-0.5 sm:mb-1 font-sans">
              JUST ARRIVED
            </span>
            <h2 className="font-editorial text-xl sm:text-3xl lg:text-4xl font-normal text-neutral-900 tracking-tight">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="group flex items-center gap-1 text-[10px] sm:text-xs uppercase tracking-widest font-medium text-neutral-800 hover:text-black transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Real Products Grid with Responsive Alignment */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 items-stretch">
          {displayProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
