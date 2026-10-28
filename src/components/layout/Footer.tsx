'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Youtube, ChevronDown, ArrowUpRight, ArrowUp } from 'lucide-react';
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

  const socials = [
    { href: socialLinks.instagram || 'https://instagram.com', label: 'Instagram', Icon: Instagram },
    { href: socialLinks.facebook || 'https://facebook.com', label: 'Facebook', Icon: Facebook },
    { href: socialLinks.youtube || socialLinks.pinterest || 'https://youtube.com', label: 'YouTube', Icon: Youtube },
  ];

  const scrollToTop = () => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const LinkList = ({
    items,
    open,
  }: {
    items: { title: string; href: string }[];
    open: boolean;
  }) => (
    <ul
      className={`space-y-3 text-[13px] text-[#6E655C] font-sans ${
        open ? 'block pt-2 pb-4' : 'hidden md:block'
      }`}
    >
      {items.map((item) => (
        <li key={item.title}>
          <Link
            href={item.href}
            className="group inline-flex items-center gap-1.5 hover:text-[#1E1A17] transition-colors py-0.5 md:py-0"
          >
            <span className="relative">
              {item.title}
              <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-[#9E7B56] transition-all duration-300 group-hover:w-full" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <footer className="relative mt-auto bg-[#F5F1EA] text-[#1E1A17] overflow-hidden">
      {/* Top hairline accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#CDBBA4] to-transparent" />

      {/* Editorial statement band */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-12 sm:pt-16 pb-10 sm:pb-12 border-b border-[#E3DACD]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-3">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#9E7B56] font-sans font-medium block">
              Crafted For Everyday Journeys
            </span>
            <h3 className="font-editorial text-[28px] sm:text-4xl lg:text-[46px] font-normal uppercase leading-[1.08] tracking-tight">
              A Small Step
              <br />
              Towards A Brighter Tomorrow.
            </h3>
          </div>
          <Link
            href="/shop"
            className="group self-start md:self-auto inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-[#1E1A17] text-[11px] uppercase tracking-[0.22em] font-semibold transition-all duration-300 hover:bg-[#1E1A17] hover:text-white"
          >
            Shop The Collection
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      {/* Main columns */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-0 md:gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-5 space-y-5 pb-8 md:pb-0">
            <Link href="/" className="inline-block group">
              <Image
                src="/logo.png"
                alt="MEOW"
                width={130}
                height={40}
                className="h-8 w-auto object-contain transition-opacity group-hover:opacity-80"
              />
            </Link>
            <p className="text-[13px] sm:text-sm text-[#6E655C] max-w-sm leading-[1.75] font-sans">
              Footwear crafted for everyday journeys — blending craftsmanship, comfort and
              timeless, minimal design for women and kids.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-[#D9CDBD] bg-white/60 flex items-center justify-center text-[#3A332C] transition-all duration-300 hover:bg-[#1E1A17] hover:text-white hover:border-[#1E1A17] hover:-translate-y-0.5"
                >
                  <Icon className="w-4 h-4 stroke-[1.6]" />
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div className="lg:col-span-4 border-t md:border-t-0 border-[#E3DACD] pt-5 md:pt-0">
            <button
              type="button"
              onClick={() => setCollectionsOpen(!collectionsOpen)}
              className="w-full flex items-center justify-between text-left md:pointer-events-none md:cursor-default md:mb-5"
              aria-expanded={collectionsOpen}
            >
              <h4 className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#1E1A17] font-sans">
                Collections
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-[#9E7B56] md:hidden transition-transform duration-200 ${
                  collectionsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div className="hidden md:block w-6 h-px bg-[#9E7B56] -mt-3 mb-5" />
            <LinkList items={collections} open={collectionsOpen} />
          </div>

          {/* Discover */}
          <div className="lg:col-span-3 border-t md:border-t-0 border-[#E3DACD] pt-5 md:pt-0 pb-2 md:pb-0">
            <button
              type="button"
              onClick={() => setDiscoverOpen(!discoverOpen)}
              className="w-full flex items-center justify-between text-left md:pointer-events-none md:cursor-default md:mb-5"
              aria-expanded={discoverOpen}
            >
              <h4 className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#1E1A17] font-sans">
                Discover
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-[#9E7B56] md:hidden transition-transform duration-200 ${
                  discoverOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div className="hidden md:block w-6 h-px bg-[#9E7B56] -mt-3 mb-5" />
            <LinkList items={discoverLinks} open={discoverOpen} />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#E3DACD]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8A8076] font-sans">
          <p className="tracking-wide">© {new Date().getFullYear()} MEOW. All rights reserved.</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 uppercase tracking-[0.25em] text-[10px] font-semibold text-[#3A332C] hover:text-[#1E1A17] transition-colors"
          >
            Back To Top
            <span className="w-7 h-7 rounded-full border border-[#D9CDBD] flex items-center justify-center transition-all duration-300 group-hover:bg-[#1E1A17] group-hover:text-white group-hover:border-[#1E1A17]">
              <ArrowUp className="w-3 h-3" />
            </span>
          </button>
        </div>
      </div>

      {/* Oversized watermark wordmark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-6 sm:-bottom-10 right-0 font-editorial text-[90px] sm:text-[160px] lg:text-[220px] leading-none text-[#1E1A17]/[0.035] tracking-tighter"
      >
        MEOW
      </div>
    </footer>
  );
};
