'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, Search, RefreshCw, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { FilterSidebar, FilterState } from '@/components/shop/FilterSidebar';
import { MobileFilterModal } from '@/components/shop/MobileFilterModal';
import { dbService } from '@/lib/storage/db';
import { Product, Category } from '@/lib/supabase/types';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('q');
  const sortParam = searchParams.get('sort');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  const [sortBy, setSortBy] = useState(sortParam || 'newest');

  const initialFilters: FilterState = {
    categories: categoryParam ? [categoryParam] : [],
    priceRange: [0, 8000],
    sizes: [],
    colors: [],
    inStockOnly: false,
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prods] = await Promise.all([
          dbService.getCategories(),
          dbService.getProducts(),
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error('Failed to load shop data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Update category filter if URL param changes
  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, categories: [categoryParam] }));
    }
  }, [categoryParam]);

  // Extract all unique color names from products
  const availableColors = useMemo(() => {
    const colorsSet = new Set<string>();
    products.forEach((p) => {
      p.variants?.forEach((v) => {
        if (v.color_name) colorsSet.add(v.color_name);
      });
    });
    return Array.from(colorsSet);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(
        (p) =>
          (p.category && filters.categories.includes(p.category.slug)) ||
          filters.categories.includes(p.category_id || '')
      );
    }

    // Price range
    result = result.filter((p) => {
      const effPrice = p.sale_price ?? p.price;
      return effPrice >= filters.priceRange[0] && effPrice <= filters.priceRange[1];
    });

    // Size filter
    if (filters.sizes.length > 0) {
      result = result.filter((p) => {
        const productSizes = p.sizes || [];
        return filters.sizes.some((sz) => productSizes.includes(sz));
      });
    }

    // Color filter
    if (filters.colors.length > 0) {
      result = result.filter((p) => {
        return p.variants?.some((v) => filters.colors.includes(v.color_name));
      });
    }

    // In Stock Only
    if (filters.inStockOnly) {
      result = result.filter((p) => (p.stock || 0) > 0);
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'bestseller') {
      result.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
    }

    return result;
  }, [products, searchQuery, filters, sortBy]);

  const handleResetFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 8000],
      sizes: [],
      colors: [],
      inStockOnly: false,
    });
    setSearchQuery('');
  };

  const activeFilterCount =
    filters.categories.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.inStockOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <>
      <Header />

      <main className="bg-white min-h-screen pb-20">
        {/* Editorial Top Banner matching PDF page 3 */}
        <div className="relative bg-gradient-to-r from-[#F5F2EB] via-[#FAF9F6] to-[#ECE8E1] border-b border-meow-border overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.02),transparent_60%)] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-meow-terracotta font-sans font-semibold">
                DISCOVER
              </span>
              <h1 className="font-editorial text-4xl sm:text-5xl font-medium text-meow-dark tracking-tight">
                ALL PRODUCTS
              </h1>
              <p className="text-xs sm:text-sm text-meow-muted max-w-md font-sans">
                Crafted for everyday comfort. Engineered anatomical support.
              </p>
            </div>
            <div className="text-xs uppercase tracking-widest text-meow-dark font-medium border-l-2 border-meow-dark pl-3">
              STEP INTO STYLE
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Filter Sidebar (Desktop) */}
            <div className="hidden lg:block lg:col-span-3">
              <FilterSidebar
                categories={categories}
                filters={filters}
                onChange={setFilters}
                onReset={handleResetFilters}
                availableColors={availableColors}
              />
            </div>

            {/* Right Product Grid Column */}
            <div className="lg:col-span-9 space-y-6">
              {/* Controls Bar: Search, Mobile Filter Toggle, Sort Dropdown */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-meow-border">
                {/* Search in Shop */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-meow-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search styles, categories..."
                    className="w-full text-xs pl-9 pr-8 py-2.5 rounded border border-meow-border bg-meow-surface outline-none focus:border-meow-dark transition-colors placeholder:text-meow-subtle"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-meow-subtle hover:text-meow-dark"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded border border-meow-border bg-white text-xs font-semibold uppercase tracking-wider text-meow-dark hover:bg-meow-surface"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
                  </button>

                  {/* Sort By Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-meow-muted hidden sm:inline">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-xs font-medium px-3 py-2.5 rounded border border-meow-border bg-white text-meow-dark outline-none focus:border-meow-dark cursor-pointer"
                    >
                      <option value="newest">Latest</option>
                      <option value="bestseller">Best Sellers</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name-asc">Name: A–Z</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Counter */}
              <div className="flex items-center justify-between text-xs text-meow-muted">
                <span>
                  Showing <strong className="text-meow-dark font-semibold">{filteredProducts.length}</strong>{' '}
                  {filteredProducts.length === 1 ? 'product' : 'products'}
                </span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-meow-dark font-medium underline hover:opacity-75"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-meow-muted">
                  <RefreshCw className="w-6 h-6 animate-spin mb-3 text-meow-dark" />
                  <p className="text-xs uppercase tracking-wider">Loading MEOW Footwear...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-meow-border rounded-xl p-8 bg-meow-surface">
                  <h3 className="font-editorial text-2xl font-medium text-meow-dark mb-2">
                    No products found
                  </h3>
                  <p className="text-xs text-meow-muted max-w-sm mx-auto mb-6">
                    We could not find any footwear matching your exact filter criteria.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-2.5 bg-meow-dark text-white text-xs uppercase tracking-widest font-semibold hover:bg-meow-dark/85"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        categories={categories}
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        availableColors={availableColors}
        totalResults={filteredProducts.length}
      />

      <Footer />
    </>
  );
}
