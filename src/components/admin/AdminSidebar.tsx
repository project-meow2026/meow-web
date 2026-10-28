'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderTree,
  Package,
  Sparkles,
  Layers,
  Video,
  Info,
  PhoneCall,
  ShoppingBag,
  Inbox,
  ExternalLink,
  Menu,
  X,
  LogOut,
  UserCheck,
} from 'lucide-react';

interface AdminSidebarProps {
  adminEmail?: string | null;
  onSignOut?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ adminEmail, onSignOut }) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Categories (6)', href: '/admin/categories', icon: FolderTree },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Hero Banner & 3D Video', href: '/admin/hero', icon: Sparkles },
    { label: 'Banners (Shop & Home)', href: '/admin/banners', icon: Layers },
    { label: 'Preload Intro Video', href: '/admin/preloader', icon: Video },
    { label: 'About Us Content', href: '/admin/about', icon: Info },
    { label: 'Contact & Social Links', href: '/admin/contact', icon: PhoneCall },
    { label: 'Orders & WhatsApp', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Customer Enquiries', href: '/admin/enquiries', icon: Inbox },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-meow-border flex items-center justify-between">
          <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex flex-col gap-1">
            <Image
              src="/logo.png"
              alt="MEOW"
              width={110}
              height={32}
              className="h-6 w-auto object-contain"
            />
            <span className="text-[9px] uppercase tracking-[0.25em] text-meow-subtle font-sans">
              Store CMS Admin
            </span>
          </Link>

          {/* Close button inside mobile drawer */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-meow-muted hover:text-meow-dark"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
                  isActive
                    ? 'bg-meow-dark text-white shadow-sm'
                    : 'text-meow-muted hover:text-meow-dark hover:bg-meow-surface'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[1.75]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer shortcut to storefront & Sign Out */}
      <div className="p-4 border-t border-meow-border mt-auto space-y-2.5">
        {adminEmail && (
          <div className="px-3.5 py-2 rounded-lg bg-[#FAF9F6] border border-meow-border/70 flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-green-700 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-[9px] uppercase tracking-wider text-meow-subtle block">
                Signed in as
              </span>
              <span className="text-[11px] font-medium text-meow-dark truncate block">
                {adminEmail}
              </span>
            </div>
          </div>
        )}

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-meow-border bg-meow-surface text-xs font-semibold text-meow-dark hover:bg-white transition-colors"
        >
          <span>View Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5 text-meow-subtle" />
        </Link>

        {onSignOut && (
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onSignOut();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-red-200 bg-red-50/70 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
          >
            <span>Sign Out of Admin</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar with Hamburger for Admin */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white border-b border-meow-border shadow-sm">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="MEOW"
            width={90}
            height={26}
            className="h-5 w-auto object-contain"
          />
          <span className="text-[10px] uppercase tracking-wider text-meow-muted font-sans font-semibold">
            Admin
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 -mr-2 text-meow-dark hover:bg-meow-surface rounded-md focus:outline-none"
          aria-label="Open admin menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Backdrop & Sliding Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl z-10 overflow-y-auto">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop FIXED Sidebar (Always stays in place as requested) */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-meow-border flex-col justify-between h-screen z-30 overflow-y-auto">
        {sidebarContent}
      </aside>
    </>
  );
};
