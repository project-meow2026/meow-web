'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderTree,
  Package,
  Layers,
  Sparkles,
  Info,
  PhoneCall,
  ShoppingBag,
  Inbox,
  ExternalLink,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Categories (6)', href: '/admin/categories', icon: FolderTree },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Hero Banner & 3D Video', href: '/admin/hero', icon: Sparkles },
    { label: 'About Us Content', href: '/admin/about', icon: Info },
    { label: 'Contact & Social Links', href: '/admin/contact', icon: PhoneCall },
    { label: 'Orders & WhatsApp', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Customer Enquiries', href: '/admin/enquiries', icon: Inbox },
  ];

  return (
    <aside className="w-64 bg-white border-r border-meow-border flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-meow-border">
          <Link href="/admin" className="flex flex-col">
            <span className="font-editorial text-2xl font-semibold tracking-wider text-meow-dark">
              meow
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-meow-subtle -mt-1 font-sans">
              Store CMS Admin
            </span>
          </Link>
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

      {/* Footer shortcut to storefront */}
      <div className="p-4 border-t border-meow-border">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-meow-border bg-meow-surface text-xs font-semibold text-meow-dark hover:bg-white transition-colors"
        >
          <span>View Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5 text-meow-subtle" />
        </Link>
      </div>
    </aside>
  );
};
