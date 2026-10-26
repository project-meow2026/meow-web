'use client';

import React from 'react';
import Link from 'next/link';
import { X, ArrowRight, ShieldCheck, Heart, User } from 'lucide-react';
import { SKETCH_COLLECTIONS } from '@/lib/utils/sketchAssets';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between z-10 p-6 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-meow-border">
            <Link href="/" onClick={onClose} className="flex flex-col">
              <span className="font-editorial text-2xl font-semibold tracking-wider text-meow-dark">
                meow
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-meow-subtle -mt-1 font-sans">
                Footwear
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-meow-dark hover:opacity-70"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Main Links */}
          <nav className="py-6 space-y-4">
            <Link
              href="/"
              onClick={onClose}
              className="block text-base uppercase tracking-wider font-medium text-meow-dark hover:text-meow-muted"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={onClose}
              className="block text-base uppercase tracking-wider font-medium text-meow-dark hover:text-meow-muted"
            >
              Shop All Footwear
            </Link>
            <Link
              href="/collections"
              onClick={onClose}
              className="block text-base uppercase tracking-wider font-medium text-meow-dark hover:text-meow-muted"
            >
              Collections
            </Link>
            <Link
              href="/about"
              onClick={onClose}
              className="block text-base uppercase tracking-wider font-medium text-meow-dark hover:text-meow-muted"
            >
              About MEOW
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="block text-base uppercase tracking-wider font-medium text-meow-dark hover:text-meow-muted"
            >
              Contact Us
            </Link>
          </nav>

          {/* The 6 Collections Quick Access */}
          <div className="pt-4 border-t border-meow-border">
            <p className="text-xs font-semibold uppercase tracking-widest text-meow-subtle mb-3">
              Explore Collections
            </p>
            <div className="space-y-2">
              {SKETCH_COLLECTIONS.map((col) => (
                <Link
                  key={col.slug}
                  href={`/shop?category=${col.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between text-sm text-meow-dark/80 hover:text-meow-dark py-1 group"
                >
                  <span>{col.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-meow-subtle transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="pt-6 border-t border-meow-border space-y-3">
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-medium text-meow-muted hover:text-meow-dark"
          >
            <User className="w-4 h-4" />
            <span>Store Admin CMS</span>
          </Link>
          <div className="text-[11px] text-meow-subtle flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official MEOW Footwear Store</span>
          </div>
        </div>
      </div>
    </div>
  );
};
