import React from 'react';
import { getHomeServerData } from '@/lib/storage/homeData';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { BestSellersSection } from '@/components/home/BestSellersSection';
import { MidPageBanner } from '@/components/home/MidPageBanner';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { BrandStorySection } from '@/components/home/BrandStorySection';
import { BottomCtaSection } from '@/components/home/BottomCtaSection';
import { PreloaderVideoModal } from '@/components/home/PreloaderVideoModal';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Fetch real admin data directly on the server to prevent any hardcoded text flash on reload
  const {
    categories,
    products,
    heroBanner,
    preloadVideo,
    midBanner,
    bottomCta,
    standardBanner,
  } = await getHomeServerData();

  return (
    <>
      {/* 1. Preloader Video Modal from Admin - Shows FIRST on website open */}
      <PreloaderVideoModal setting={preloadVideo} />

      {/* 2. Main Website Root - Hidden when preloading so it NEVER blinks or flashes */}
      <div id="meow-website-root" className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1">
          {/* Hero Banner with Admin Video & Editorial Headline */}
          {heroBanner && <HeroSection banner={heroBanner} />}

          {/* Shop by Category (6 Circular Pencil-Sketch Categories) */}
          <CategorySection categories={categories} />

          {/* 1. Best Sellers Section (4 Products in a Row) */}
          <BestSellersSection products={products} />

          {/* 2. Mid-Page Promotional Banner ("Every Step A Story" between products) */}
          <MidPageBanner banner={midBanner} />

          {/* 3. New Arrivals Section (4 Products in a Row) */}
          <NewArrivalsSection products={products} />

          {/* 4. The MEOW Standard Brand Story Editorial Section */}
          <BrandStorySection banner={standardBanner} />

          {/* 5. Bottom Newsletter Early Access CTA Section with Customizable Image Background */}
          <BottomCtaSection banner={bottomCta} />
        </main>

        {/* Clean Minimal Luxury Footer */}
        <Footer />
      </div>
    </>
  );
}
