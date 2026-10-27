'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/lib/supabase/types';
import { ProductCard } from '@/components/shop/ProductCard';

interface FeaturedSectionProps {
  products: Product[];
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ products }) => {
  const featured = products.filter((p) => p.is_featured).slice(0, 4);
  const displayProducts = featured.length > 0 ? featured : products.slice(0, 4);

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-meow-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-meow-subtle block mb-1 font-sans">
              Curated Essentials
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-meow-dark tracking-tight">
              FEATURED PRODUCTS
            </h2>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-meow-dark hover:text-meow-muted transition-colors pb-1"
          >
            <span>Explore All</span>
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
