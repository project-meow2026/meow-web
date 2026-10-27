'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, Search, RefreshCw, X, ChevronDown, Check } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { FilterSidebar, FilterState } from '@/components/shop/FilterSidebar';
import { MobileFilterModal } from '@/components/shop/MobileFilterModal';
import { dbService, INITIAL_SHOP_HERO_BANNER } from '@/lib/storage/db';
import { Product, Category, ShopHeroBannerSetting } from '@/lib/supabase/types';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Latest / Newest' },
  { value: 'bestseller', label: 'Best Sellers' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
];

// Helper: robust price extraction from product
function getProductPrice(p: Product): number {
  const sale = p.sale_price != null && Number(p.sale_price) > 0 ? Number(p.sale_price) : null;
  const regular = typeof p.price === 'string'
    ? parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 0
    : Number(p.price) || 0;
  return sale !== null ? sale : regular;
}

// Levenshtein edit distance for spelling mistakes and typo tolerance
function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const val = a[i - 1] === b[j - 1] ? row[j - 1] : Math.min(row[j - 1], row[j], prev) + 1;
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

// Intelligent fuzzy search matching name, category, and spelling variations
function matchesSearch(product: Product, query: string): boolean {
  const cleanQ = query.toLowerCase().trim();
  if (!cleanQ) return true;

  const targetStrings = [
    product.name,
    product.description || '',
    product.category?.name || '',
    product.category?.slug || '',
    ...(product.highlights || []),
    ...(product.variants?.map((v) => v.color_name) || []),
  ].map((s) => s.toLowerCase());

  // 1. Direct full query substring match anywhere
  if (targetStrings.some((t) => t.includes(cleanQ))) return true;

  // 2. Tokenized search: all query terms must match or be closely spelled
  const qTokens = cleanQ.split(/\s+/).filter(Boolean);
  const targetWords = targetStrings.flatMap((t) => t.split(/[\s,.-/]+/).filter(Boolean));

  return qTokens.every((token) => {
    // Exact or prefix or suffix match on any word
    if (targetWords.some((w) => w.includes(token) || token.includes(w))) return true;

    // Subsequence match (e.g. "corkinn" -> "cork inn", "sndl" -> "sandal")
    const isSubseq = targetWords.some((w) => {
      if (w.length < token.length - 2) return false;
      let i = 0;
      for (let j = 0; j < w.length && i < token.length; j++) {
        if (w[j] === token[i]) i++;
      }
      return i === token.length && token.length >= 3;
    });
    if (isSubseq) return true;

    // Levenshtein edit distance for spelling mistakes / typos
    return targetWords.some((w) => {
      const maxAllowedDistance = token.length <= 4 ? 1 : token.length <= 8 ? 2 : 3;
      return levenshteinDistance(token, w) <= maxAllowedDistance;
    });
  });
}

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('q');
  const sortParam = searchParams.get('sort');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [shopHero, setShopHero] = useState<ShopHeroBannerSetting>(INITIAL_SHOP_HERO_BANNER);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  const [sortBy, setSortBy] = useState(sortParam || 'newest');

  const sortDropdownRef = useRef<HTMLDivElement | null>(null);

  const initialFilters: FilterState = {
    categories: categoryParam ? [categoryParam] : [],
    priceRange: [0, 10000],
    sizes: [],
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prods, hero] = await Promise.all([
          dbService.getCategories(),
          dbService.getProducts(),
          dbService.getShopHeroBanner(),
        ]);
        setCategories(cats);
        setProducts(prods);
        if (hero) setShopHero(hero);
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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Fuzzy spelling and keyword search
    if (searchQuery.trim()) {
      result = result.filter((p) => matchesSearch(p, searchQuery));
    }

    // 2. Category filter
    if (filters.categories.length > 0) {
      result = result.filter(
        (p) =>
          (p.category && filters.categories.includes(p.category.slug)) ||
          filters.categories.includes(p.category_id || '')
      );
    }

    // 3. Price range filter (exact numeric range check)
    result = result.filter((p) => {
      const effPrice = getProductPrice(p);
      return effPrice >= filters.priceRange[0] && effPrice <= filters.priceRange[1];
    });

    // 4. Size filter
    if (filters.sizes.length > 0) {
      result = result.filter((p) => {
        const productSizes = p.sizes || [];
        return filters.sizes.some((sz) => productSizes.includes(sz));
      });
    }

    // 5. Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => getProductPrice(a) - getProductPrice(b));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => getProductPrice(b) - getProductPrice(a));
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'bestseller') {
      result.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => {
        const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tB - tA;
      });
    }

    return result;
  }, [products, searchQuery, filters, sortBy]);

  const handleResetFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 10000],
      sizes: [],
    });
    setSearchQuery('');
  };

  const activeFilterCount =
    filters.categories.length +
    filters.sizes.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label || 'Latest / Newest';

  return (
    <>
      <Header />

      <main className="bg-white min-h-screen pb-24">
        {/* Dynamic Grand Top Banner (Height & Scale increased as requested) */}
        {shopHero.is_enabled !== false && (
          <div className="relative border-b border-meow-border overflow-hidden min-h-[340px] sm:min-h-[440px] md:min-h-[500px] flex items-center">
            {/* Background Image or Editorial Warm Beige Gradient */}
            {shopHero.background_image_url ? (
              <>
                <img
                  src={shopHero.background_image_url}
                  alt={shopHero.heading || 'MEOW Footwear'}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/40" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-[#F5F2EB] via-[#FAF9F6] to-[#ECE8E1]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.03),transparent_60%)] pointer-events-none" />
              </>
            )}

            <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 md:py-40 flex flex-col sm:flex-row sm:items-end justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                {shopHero.badge && (
                  <span
                    className={`inline-block text-xs uppercase tracking-[0.3em] font-sans font-semibold ${
                      shopHero.background_image_url
                        ? 'text-amber-300 drop-shadow-sm'
                        : 'text-meow-terracotta'
                    }`}
                  >
                    {shopHero.badge}
                  </span>
                )}
                <h1
                  className={`font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.05] ${
                    shopHero.background_image_url
                      ? 'text-white drop-shadow-md'
                      : 'text-meow-dark'
                  }`}
                >
                  {shopHero.heading || 'ALL PRODUCTS'}
                </h1>
                {shopHero.subtitle && (
                  <p
                    className={`text-sm sm:text-base md:text-lg max-w-xl font-sans font-light leading-relaxed ${
                      shopHero.background_image_url
                        ? 'text-white/90 drop-shadow-sm'
                        : 'text-meow-muted'
                    }`}
                  >
                    {shopHero.subtitle}
                  </p>
                )}
              </div>

              {shopHero.accent_tag && (
                <div
                  className={`text-xs sm:text-sm uppercase tracking-widest font-medium border-l-2 pl-4 self-start sm:self-end ${
                    shopHero.background_image_url
                      ? 'text-white border-white/70 drop-shadow-sm'
                      : 'text-meow-dark border-meow-dark'
                  }`}
                >
                  {shopHero.accent_tag}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Filter Sidebar (Desktop) - STICKY so it moves along with viewport when scrolling */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-3 pb-8 scrollbar-thin">
                <FilterSidebar
                  categories={categories}
                  filters={filters}
                  onChange={setFilters}
                  onReset={handleResetFilters}
                />
              </div>
            </div>

            {/* Right Product Grid Column */}
            <div className="lg:col-span-9 space-y-6">
              {/* Controls Bar: Search, Mobile Filter Toggle, Sort Dropdown */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-meow-border">
                {/* Search Bar with Spelling and Name Fuzzy Filtering */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-meow-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search styles, categories or names..."
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
                    className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded border border-meow-border bg-white text-xs font-semibold uppercase tracking-wider text-meow-dark hover:bg-meow-surface transition-colors"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
                  </button>

                  {/* Fully Interactive Custom Sort Dropdown */}
                  <div className="relative" ref={sortDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                      className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2.5 rounded border border-meow-border bg-white text-meow-dark hover:border-meow-dark transition-all select-none shadow-sm"
                    >
                      <span className="text-meow-muted font-normal hidden sm:inline">Sort:</span>
                      <span>{activeSortLabel}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-meow-muted transition-transform duration-200 ${
                          sortDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {sortDropdownOpen && (
                      <div className="absolute right-0 mt-1.5 w-48 bg-white border border-meow-border rounded-lg shadow-xl z-30 py-1 overflow-hidden animate-fade-in-up">
                        {SORT_OPTIONS.map((opt) => {
                          const isSelected = sortBy === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                setSortBy(opt.value);
                                setSortDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between transition-colors ${
                                isSelected
                                  ? 'bg-meow-surface font-semibold text-meow-dark'
                                  : 'text-meow-muted hover:bg-meow-surface hover:text-meow-dark'
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-meow-dark" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
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
                <div className="text-center py-24 space-y-4 border border-dashed border-meow-border rounded-xl">
                  <div className="text-2xl font-editorial text-meow-muted">No Styles Found</div>
                  <p className="text-xs text-meow-subtle max-w-sm mx-auto">
                    {searchQuery
                      ? `No products matching "${searchQuery}". Try checking for typos or searching a category like EVA or Cork.`
                      : 'No footwear matches your selected filter criteria. Try expanding your price range or resetting filters.'}
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-2.5 bg-meow-dark text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-meow-dark/85 transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id || product.slug} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        categories={categories}
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        totalResults={filteredProducts.length}
      />
    </>
  );
}

export default function ShopPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <RefreshCw className="w-6 h-6 animate-spin text-meow-dark" />
        </div>
      }
    >
      <ShopContent />
    </React.Suspense>
  );
}
