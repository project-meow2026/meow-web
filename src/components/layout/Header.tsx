'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, User, Menu, X, Heart, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { dbService } from '@/lib/storage/db';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary/upload';
import { formatPrice } from '@/lib/utils/formatters';
import { Product } from '@/lib/supabase/types';
import { MobileNav } from './MobileNav';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    dbService
      .getProducts()
      .then((list) => setProducts(list || []))
      .catch(() => {});
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchOpen &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  const matchingProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const tokens = q.split(/\s+/).filter(Boolean);

    const scored = products
      .map((p) => {
        const name = (p.name || '').toLowerCase();
        const cat = (p.category?.name || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const colors = (p.variants || [])
          .map((v) => (v.color_name || '').toLowerCase())
          .join(' ');
        const haystack = `${name} ${cat} ${desc} ${colors}`;

        let score = 0;
        if (name.startsWith(q)) score += 100;
        else if (name.includes(q)) score += 75;
        if (cat.includes(q)) score += 40;

        for (const token of tokens) {
          if (name.includes(token)) score += 30;
          else if (haystack.includes(token)) score += 15;
          else if (token.length >= 3) {
            // Prefix or fuzzy match for similar words
            const words = haystack.split(/\W+/);
            if (words.some((w) => w.startsWith(token.slice(0, 3)) || token.startsWith(w.slice(0, 3)))) {
              score += 8;
            }
          }
        }

        return { product: p, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, 6).map((s) => s.product);
  }, [products, searchQuery]);

  const getProductThumb = (p: Product): string => {
    const primary = p.primary_image_url;
    const firstImg = p.images?.[0]?.image_url;
    const variantImg = p.variants?.[0]?.miniature_image_url;
    return optimizeCloudinaryUrl(primary || firstImg || variantImg || '', 200);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Collections', href: '/collections' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        ref={searchContainerRef}
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-sm border-b border-meow-border'
            : 'bg-white/70 backdrop-blur-md border-b border-black/5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Mobile menu button & Brand Logo */}
            <div className="flex items-center gap-1 sm:gap-3">
              <div className="flex items-center md:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-1.5 -ml-1 text-meow-dark hover:opacity-75 focus:outline-none flex items-center justify-center"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
                </button>
              </div>

              {/* Brand Logo - MEOW */}
              <Link href="/" className="group flex items-center">
                <Image
                  src="/logo.png"
                  alt="MEOW"
                  width={130}
                  height={38}
                  className="h-6 sm:h-8 w-auto object-contain transition-opacity group-hover:opacity-85"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-[13px] uppercase tracking-widest font-medium transition-colors hover:text-meow-dark ${
                      isActive ? 'text-meow-dark font-semibold' : 'text-meow-muted'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 sm:p-2 text-meow-dark hover:opacity-70 transition-opacity flex items-center justify-center"
                aria-label="Search products"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/shop?filter=wishlist"
                className="p-1.5 sm:p-2 text-meow-dark hover:opacity-70 transition-opacity relative hidden sm:flex items-center justify-center"
                aria-label="View wishlist"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-meow-dark text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Customer Profile Shortcut */}
              <Link
                href="/profile"
                className="p-1.5 sm:p-2 text-meow-dark hover:opacity-70 transition-opacity flex items-center justify-center"
                title="Customer Profile & Orders"
                aria-label="Customer Profile"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
              </Link>

              {/* Shopping Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="p-1.5 sm:p-2 text-meow-dark hover:opacity-70 transition-opacity relative flex items-center justify-center"
                aria-label="View shopping cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-meow-dark text-white text-[9px] sm:text-[10px] rounded-full flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Search Input + Live Product Suggestions Dropdown */}
        {searchOpen && (
          <div className="relative border-t border-meow-border bg-white px-4 py-3 shadow-lg animate-fade-in-up">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-meow-muted shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search MEOW footwear by product name, style, or collection..."
                  className="w-full text-sm outline-none bg-transparent placeholder:text-meow-subtle"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      setSearchOpen(false);
                      window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-meow-subtle hover:text-meow-dark shrink-0"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 text-meow-muted hover:text-meow-dark shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Live Matching Products Dropdown */}
              {searchQuery.trim().length > 0 && (
                <div className="mt-3 pt-3 border-t border-meow-border/70 max-h-80 overflow-y-auto">
                  {matchingProducts.length > 0 ? (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-widest text-meow-subtle font-semibold px-2 block mb-1">
                        Matching Products ({matchingProducts.length})
                      </span>
                      {matchingProducts.map((product) => {
                        const thumb = getProductThumb(product);
                        const price = product.sale_price || product.price;
                        return (
                          <Link
                            key={product.id || product.slug}
                            href={`/product/${product.slug}`}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-[#FAF9F6] transition-colors group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-11 h-11 rounded-md overflow-hidden bg-[#F5F2EC] border border-meow-border shrink-0 flex items-center justify-center">
                                {thumb ? (
                                  <img
                                    src={thumb}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-[9px] font-bold text-meow-subtle">MEOW</span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-meow-dark truncate group-hover:underline">
                                  {product.name}
                                </p>
                                {product.category?.name && (
                                  <p className="text-[10px] text-meow-subtle truncate">
                                    {product.category.name}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-semibold text-meow-dark">
                                {formatPrice(price)}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-meow-subtle group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </Link>
                        );
                      })}
                      <Link
                        href={`/shop?q=${encodeURIComponent(searchQuery.trim())}`}
                        onClick={() => setSearchOpen(false)}
                        className="mt-2 pt-2 border-t border-meow-border/60 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-meow-dark hover:text-meow-muted py-1.5"
                      >
                        <span>View all results for &ldquo;{searchQuery.trim()}&rdquo;</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-xs text-meow-muted">
                      No matching products found for &ldquo;{searchQuery.trim()}&rdquo;.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
