'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Mail, MapPin, ArrowRight, Check } from 'lucide-react';
import { SKETCH_COLLECTIONS } from '@/lib/utils/sketchAssets';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-white border-t border-meow-border pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-meow-border">
          {/* Col 1: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-editorial text-3xl font-semibold tracking-wider text-meow-dark">
                meow
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-meow-subtle -mt-1 font-sans">
                Footwear
              </span>
            </Link>
            <p className="text-sm text-meow-muted max-w-sm leading-relaxed">
              Quiet confidence. Timeless comfort. MEOW crafts minimal luxury footwear blending anatomical support with conscious, enduring design.
            </p>

            {/* Direct WhatsApp Concierge CTA */}
            <div className="pt-2">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-[#25D366]/10 text-[#128C7E] rounded-md text-xs font-semibold hover:bg-[#25D366]/20 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with MEOW Concierge (+91 98765 43210)</span>
              </a>
            </div>
          </div>

          {/* Col 2: The 6 MEOW Collections */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-meow-dark mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-meow-muted">
              {SKETCH_COLLECTIONS.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/shop?category=${c.slug}`}
                    className="hover:text-meow-dark transition-colors"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company & Information */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-meow-dark mb-4">
              Discover
            </h4>
            <ul className="space-y-2.5 text-xs text-meow-muted">
              <li>
                <Link href="/about" className="hover:text-meow-dark transition-colors">
                  About MEOW
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-meow-dark transition-colors">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-meow-dark transition-colors">
                  Collection Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-meow-dark transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-meow-dark transition-colors font-medium text-meow-dark/70">
                  Store Management (CMS)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-meow-dark mb-4">
              MEOW Journal
            </h4>
            <p className="text-xs text-meow-muted mb-3 leading-relaxed">
              Receive private invitations to seasonal releases, styling notes, and material insights.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 p-2.5 rounded border border-green-200">
                <Check className="w-4 h-4" />
                <span>Thank you for joining the MEOW Journal.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full text-xs px-3 py-2.5 bg-meow-surface border border-meow-border rounded outline-none focus:border-meow-dark transition-colors placeholder:text-meow-subtle"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-1 text-meow-dark hover:opacity-70"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-meow-subtle gap-4">
          <p>© 2026 MEOW Footwear. All rights reserved. Handcrafted minimal footwear.</p>
          <div className="flex items-center space-x-6">
            <span>Free Express Shipping Across India</span>
            <span>•</span>
            <span>7-Day Return & Exchange</span>
            <span>•</span>
            <span>WhatsApp Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
