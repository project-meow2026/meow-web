'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Twitter, ChevronDown } from 'lucide-react';
import { dbService, INITIAL_SOCIAL_LINKS } from '@/lib/storage/db';
import { SocialLinksSetting } from '@/lib/supabase/types';

export const Footer: React.FC = () => {
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinksSetting>(INITIAL_SOCIAL_LINKS);

  useEffect(() => {
    dbService
      .getSocialLinks()
      .then((social) => {
        if (social) setSocialLinks(social);
      })
      .catch(() => {});
  }, []);

  const collections = [
    { title: 'Cork for Women', href: '/shop?category=cork-inn-for-women' },
    { title: 'EVA for Women', href: '/shop?category=eva-for-women' },
    { title: 'Double Density for Women', href: '/shop?category=double-density-for-women' },
    { title: 'EVA for Kids', href: '/shop?category=eva-for-kids' },
    { title: 'Cork for Kids', href: '/shop?category=cork-inn-kids' },
    { title: 'Magic Craft for Kids', href: '/shop?category=magic-craft-for-kids' },
  ];

  const discoverLinks = [
    { title: 'About MEOW', href: '/about' },
    { title: 'The Story', href: '/about#story' },
    { title: 'Collections', href: '/collections' },
    { title: 'All Products', href: '/shop' },
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
              Footwear crafted for everyday journeys. Comfort, quality and timeless design.
            </p>
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
            <ul
              className={`space-y-2.5 text-xs text-neutral-500 font-sans ${
                collectionsOpen ? 'block pt-1 pb-3' : 'hidden md:block'
              }`}
            >
              {collections.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="hover:text-neutral-900 transition-colors block py-0.5 md:py-0"
                  >
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
            <ul
              className={`space-y-2.5 text-xs text-neutral-500 font-sans ${
                discoverOpen ? 'block pt-1 pb-3' : 'hidden md:block'
              }`}
            >
              {discoverLinks.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="hover:text-neutral-900 transition-colors block py-0.5 md:py-0"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Brand Statement */}
          <div className="lg:col-span-3 lg:border-l lg:border-neutral-200/80 lg:pl-8 flex flex-col justify-center">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.14em] font-semibold text-neutral-800 leading-[1.7] font-sans">
              A SMALL STEP
              <br />
              TOWARDS A BRIGHTER
              <br />
              TOMORROW.
            </p>
            <div className="w-8 h-[1.5px] bg-[#B89B7A] mt-3.5" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-neutral-400 gap-4 font-sans text-center md:text-left">
          <p>© 2026 MEOW All rights reserved.</p>

          <div className="flex items-center gap-4 text-neutral-500">
            <a
              href={socialLinks.instagram || 'https://instagram.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={socialLinks.facebook || 'https://facebook.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={socialLinks.youtube || socialLinks.pinterest || 'https://twitter.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 transition-colors"
              aria-label="Social"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
