'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  FolderTree,
  ShoppingBag,
  Inbox,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dbService } from '@/lib/storage/db';
import { Category, Product, Order, ContactEnquiry } from '@/lib/supabase/types';
import { formatPrice, formatDate } from '@/lib/utils/formatters';

export default function AdminOverviewPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [cats, prods, ords, enqs] = await Promise.all([
          dbService.getAllCategoriesAdmin(),
          dbService.getAllProductsAdmin(),
          dbService.getOrders(),
          dbService.getEnquiries(),
        ]);
        setCategories(cats);
        setProducts(prods);
        setOrders(ords);
        setEnquiries(enqs);
      } catch (e) {
        console.error('Failed to load admin stats:', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const lowStockProducts = products.filter((p) => (p.stock || 0) < 5);

  const statsCards = [
    {
      title: 'Total Products',
      value: products.length,
      subtitle: `${lowStockProducts.length} low stock alerts`,
      icon: Package,
      href: '/admin/products',
    },
    {
      title: 'MEOW Collections',
      value: categories.length,
      subtitle: '6 Collections Active',
      icon: FolderTree,
      href: '/admin/categories',
    },
    {
      title: 'WhatsApp Orders',
      value: orders.length,
      subtitle: `Total Value: ${formatPrice(totalRevenue)}`,
      icon: ShoppingBag,
      href: '/admin/orders',
    },
    {
      title: 'Customer Enquiries',
      value: enquiries.length,
      subtitle: `${enquiries.filter((e) => e.status === 'new').length} pending response`,
      icon: Inbox,
      href: '/admin/enquiries',
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Store Operations & Metrics"
        description="Real-time database overview of products, categories, WhatsApp orders, and customer messages."
        actionButton={
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-meow-dark text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-meow-dark/85 shadow-sm"
          >
            + Add New Product
          </Link>
        }
      />

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="p-5 rounded-xl border border-meow-border bg-white shadow-sm hover:border-meow-dark hover:shadow transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider font-medium text-meow-muted">
                  {stat.title}
                </span>
                <div className="w-8 h-8 rounded-full bg-meow-surface border border-meow-border flex items-center justify-center text-meow-dark group-hover:bg-meow-dark group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold font-mono text-meow-dark mb-1">
                {stat.value}
              </div>
              <p className="text-[11px] text-meow-subtle">{stat.subtitle}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 border border-meow-border rounded-xl p-6 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-meow-border">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark">
              Recent WhatsApp Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs text-meow-dark font-medium underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-xs text-meow-muted">
              No orders recorded yet. When customers place orders on the storefront, they will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left divide-y divide-meow-border">
                <thead>
                  <tr className="text-meow-subtle uppercase font-semibold">
                    <th className="pb-2">Order Ref</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Items</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-meow-border/60">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="hover:bg-meow-surface">
                      <td className="py-3 font-mono font-bold text-meow-dark">{o.order_ref}</td>
                      <td className="py-3 text-meow-dark">
                        {o.customer_name}
                        <span className="block text-[10px] text-meow-muted font-mono">{o.customer_phone}</span>
                      </td>
                      <td className="py-3 text-meow-muted">{o.items?.length || 1} items</td>
                      <td className="py-3 font-mono font-bold text-meow-dark">{formatPrice(o.total_amount)}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          {o.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stock Status & Quick CMS Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-meow-border rounded-xl p-6 bg-white shadow-sm space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark pb-3 border-b border-meow-border flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Stock Status</span>
            </h2>

            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-green-700 bg-green-50 p-3 rounded border border-green-200">
                All catalog products have healthy inventory levels.
              </p>
            ) : (
              <div className="space-y-2">
                {lowStockProducts.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex justify-between items-center text-xs py-1.5 border-b border-meow-border/60">
                    <span className="font-medium text-meow-dark truncate max-w-[180px]">{p.name}</span>
                    <span className="px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-bold rounded">
                      {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border border-meow-border rounded-xl p-6 bg-[#FAF9F6] space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-meow-dark">
              Quick CMS Actions
            </h3>
            <div className="space-y-1.5 text-xs">
              <Link
                href="/admin/hero"
                className="block p-2 rounded hover:bg-white text-meow-dark font-medium transition-colors"
              >
                • Manage 3D Exploded Hero Video
              </Link>
              <Link
                href="/admin/categories"
                className="block p-2 rounded hover:bg-white text-meow-dark font-medium transition-colors"
              >
                • Configure 6 Pencil-Sketch Collections
              </Link>
              <Link
                href="/admin/contact"
                className="block p-2 rounded hover:bg-white text-meow-dark font-medium transition-colors"
              >
                • Update WhatsApp Concierge Number
              </Link>
              <Link
                href="/admin/about"
                className="block p-2 rounded hover:bg-white text-meow-dark font-medium transition-colors"
              >
                • Edit About Us Philosophy & Values
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
