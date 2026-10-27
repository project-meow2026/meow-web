'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, ArrowRight, Check, Instagram, Facebook, Twitter, ChevronDown } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const collections = [
    { title: 'Cork for Women', href: '/shop?category=cork-inn-for-women' },
    { title: 'EVA for Women', href: '/shop?category=eva-for-women' },
    { title: 'Double Density for Women', href: '/shop?category=double-density-for-women' },
    { title: 'EVA for Kids', href: '/shop?category=eva-for-kids' },
    { title: 'Cork for Kids', href: '/shop?category=cork-for-kids' },
    { title: 'Mega Kraft for Kids', href: '/shop?category=mega-kraft-kids' },
  ];

  const discoverLinks = [
    { title: 'About MEOW', href: '/about' },
    { title: 'The Story', href: '/about#story' },
    { title: 'Materials', href: '/about#materials' },
    { title: 'Sustainability', href: '/about#sustainability' },
    { title: 'Contact Us', href: '/contact' },
    { title: 'Store Admin CMS', href: '/admin' },
  ];

  return (
    <footer className="bg-white border-t border-neutral-200/80 pt-10 sm:pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-8 pb-10 sm:pb-12 border-b border-neutral-100">
          {/* Col 1: Brand & Philosophy */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block group">
              <Image
                src="/logo.png"
                alt="MEOW"
                width={120}
                height={38}
                className="h-7 w-auto object-contain transition-opacity group-hover:opacity-80"
              />
            </Link>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-sm leading-relaxed font-sans">
              Quiet confidence. Timeless comfort. MEOW crafts minimal luxury footwear blending anatomical support with conscious, everyday design.
            </p>

            {/* Concierge Pill matching reference screenshot */}
            <div className="pt-1">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E6F4EA] text-[#137333] hover:bg-[#D4EDDA] text-xs font-semibold tracking-wide transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-[#137333]/20" />
                <span>Chat with MEOW Concierge</span>
              </a>
            </div>
          </div>

          {/* Col 2: Collections - Mobile Accordion Dropdown with Arrow */}
          <div className="lg:col-span-3 border-t md:border-t-0 border-neutral-100 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => setCollectionsOpen(!collectionsOpen)}
              className="w-full flex items-center justify-between text-left md:pointer-events-none md:cursor-default mb-2 md:mb-4"
              aria-expanded={collectionsOpen}
            >
              <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-900 font-sans">
                Collections
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-neutral-500 md:hidden transition-transform duration-200 ${
                  collectionsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <ul className={`space-y-2.5 text-xs text-neutral-500 font-sans ${collectionsOpen ? 'block pt-1 pb-3' : 'hidden md:block'}`}>
              {collections.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="hover:text-neutral-900 transition-colors block py-0.5 md:py-0">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Discover - Mobile Accordion Dropdown with Arrow */}
          <div className="lg:col-span-2 border-t md:border-t-0 border-neutral-100 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => setDiscoverOpen(!discoverOpen)}
              className="w-full flex items-center justify-between text-left md:pointer-events-none md:cursor-default mb-2 md:mb-4"
              aria-expanded={discoverOpen}
            >
              <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-900 font-sans">
                Discover
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-neutral-500 md:hidden transition-transform duration-200 ${
                  discoverOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <ul className={`space-y-2.5 text-xs text-neutral-500 font-sans ${discoverOpen ? 'block pt-1 pb-3' : 'hidden md:block'}`}>
              {discoverLinks.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="hover:text-neutral-900 transition-colors block py-0.5 md:py-0">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Join the Secret */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-900 mb-2 font-sans">
              Join the secret
            </h4>
            <p className="text-xs text-neutral-500 mb-3.5 leading-relaxed font-sans">
              Be the first to know about new releases, styling ideas, and more.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 p-2.5 rounded-lg border border-green-200">
                <Check className="w-4 h-4" />
                <span>Welcome to the MEOW secret list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative">
                <div className="flex items-center bg-[#FAF9F6] border border-neutral-200 rounded-lg px-3.5 py-2.5 focus-within:border-neutral-900 transition-colors">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="bg-transparent text-xs text-neutral-900 placeholder:text-neutral-400 outline-none w-full font-sans"
                  />
                  <button type="submit" aria-label="Submit email" className="text-neutral-400 hover:text-neutral-800 ml-1 flex-shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar matching reference screenshot */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-neutral-400 gap-4 font-sans text-center md:text-left">
          <p>© 2026 MEOW All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-neutral-700 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-neutral-700 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/shipping" className="hover:text-neutral-700 transition-colors">
              Shipping & Returns
            </Link>
          </div>

          <div className="flex items-center gap-4 text-neutral-500">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
