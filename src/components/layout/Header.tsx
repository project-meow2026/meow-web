'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { MobileNav } from './MobileNav';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

              {/* Admin Portal Shortcut */}
              <Link
                href="/admin"
                className="p-1.5 sm:p-2 text-meow-dark hover:opacity-70 transition-opacity flex items-center justify-center"
                title="Admin Dashboard CMS"
                aria-label="Admin Dashboard"
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

        {/* Quick Search Dropdown */}
        {searchOpen && (
          <div className="border-t border-meow-border bg-white px-4 py-3 animate-fade-in-up">
            <div className="max-w-2xl mx-auto flex items-center gap-3">
              <Search className="w-4 h-4 text-meow-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search MEOW footwear by style, collection, or color..."
                className="w-full text-sm outline-none bg-transparent placeholder:text-meow-subtle"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-meow-subtle hover:text-meow-dark"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-meow-muted hover:text-meow-dark"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
