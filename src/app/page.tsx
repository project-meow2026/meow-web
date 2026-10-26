'use client';

import React, { useState, useEffect } from 'react';
import { dbService, INITIAL_HERO_BANNER } from '@/lib/storage/db';
import { Category, Product, HeroBanner } from '@/lib/supabase/types';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { BestSellersSection } from '@/components/home/BestSellersSection';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { BrandStorySection } from '@/components/home/BrandStorySection';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [heroBanner, setHeroBanner] = useState<HeroBanner>(INITIAL_HERO_BANNER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prods, hero] = await Promise.all([
          dbService.getCategories(),
          dbService.getProducts(),
          dbService.getHeroBanner(),
        ]);
        setCategories(cats);
        setProducts(prods);
        setHeroBanner(hero);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero Banner with 3D Exploded Footwear Animation & Video */}
        {heroBanner && <HeroSection banner={heroBanner} />}

        {/* Shop by Category (6 Circular Pencil-Sketch Categories) */}
        <CategorySection categories={categories} />

        {/* Best Sellers Section with Editorial Story Banner */}
        <BestSellersSection products={products} />

        {/* New Arrivals Section */}
        <NewArrivalsSection products={products} />

        {/* Featured Products Section */}
        <FeaturedSection products={products} />

        {/* Brand Story Editorial Section */}
        <BrandStorySection />
      </main>

      <Footer />
    </>
  );
}
