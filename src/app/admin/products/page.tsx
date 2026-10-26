'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Eye, Search, AlertCircle, Check, Package } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dbService } from '@/lib/storage/db';
import { Product, Category } from '@/lib/supabase/types';
import { formatPrice } from '@/lib/utils/formatters';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        dbService.getAllProductsAdmin(),
        dbService.getAllCategoriesAdmin(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (e) {
      console.error('Failed to load products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    const handleFocus = () => loadProducts();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the product "${name}"?`)) {
      await dbService.deleteProduct(id);
      await loadProducts();
      showToast('Product deleted successfully.');
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = !selectedCategory || p.category_id === selectedCategory || p.category?.slug === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div>
      <AdminHeader
        title="Product Inventory Management"
        description="Add, edit, and organize MEOW footwear, prices, inventory levels, and colorway miniature images."
        actionButton={
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-meow-dark text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-meow-dark/85 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        }
      />

      {toastMessage && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded flex items-center gap-2 animate-fade-in-up">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-meow-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search footwear by title or slug..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded border border-meow-border bg-white outline-none focus:border-meow-dark"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-3 py-2 rounded border border-meow-border bg-white outline-none focus:border-meow-dark cursor-pointer"
          >
            <option value="">All Collections</option>
            {categories.map((c) => (
              <option key={c.id || c.slug} value={c.id || c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="border border-meow-border rounded-xl bg-white shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-meow-muted">
            {products.length === 0 ? (
              <div className="space-y-3">
                <Package className="w-10 h-10 text-meow-subtle mx-auto stroke-[1.2]" />
                <p className="font-medium text-meow-dark">Your footwear catalog is empty.</p>
                <p className="text-meow-muted max-w-sm mx-auto">
                  Click &quot;Add New Product&quot; to create your first pair with pricing, color variants, and miniature images.
                </p>
                <Link
                  href="/admin/products/new"
                  className="inline-block mt-2 px-4 py-2 bg-meow-dark text-white text-xs uppercase tracking-wider font-semibold rounded"
                >
                  Create Product
                </Link>
              </div>
            ) : (
              'No products match your search filters.'
            )}
          </div>
        ) : (
          <table className="w-full text-xs text-left divide-y divide-meow-border">
            <thead className="bg-[#FAF9F6] text-meow-dark uppercase font-semibold">
              <tr>
                <th className="px-6 py-3.5">Image</th>
                <th className="px-6 py-3.5">Product Title</th>
                <th className="px-6 py-3.5">Collection</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Colorways</th>
                <th className="px-6 py-3.5">Stock</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-meow-border/60">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-meow-surface">
                  <td className="px-6 py-3.5">
                    <div className="w-12 h-14 rounded bg-[#FAF9F6] border border-meow-border flex items-center justify-center p-1 overflow-hidden">
                      <img
                        src={prod.primary_image_url}
                        alt={prod.name}
                        className="max-w-full max-h-full object-contain mix-blend-multiply select-none"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="font-semibold text-sm text-meow-dark block leading-snug">{prod.name}</span>
                    <span className="text-[11px] text-meow-subtle font-mono">{prod.slug}</span>
                  </td>
                  <td className="px-6 py-3.5 text-meow-muted">
                    {prod.category?.name || categories.find((c) => c.id === prod.category_id || c.slug === prod.category_id)?.name || 'MEOW Collection'}
                  </td>
                  <td className="px-6 py-3.5 font-mono font-bold text-meow-dark">
                    {formatPrice(prod.sale_price ?? prod.price)}
                    {prod.sale_price && (
                      <span className="block text-[10px] text-meow-subtle line-through">
                        {formatPrice(prod.price)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-1">
                      {prod.variants?.slice(0, 4).map((v, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded border border-meow-border overflow-hidden"
                          title={v.color_name}
                        >
                          <img
                            src={v.miniature_image_url || prod.primary_image_url}
                            alt={v.color_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {(prod.variants?.length || 0) > 4 && (
                        <span className="text-[10px] font-mono text-meow-subtle">
                          +{(prod.variants?.length || 0) - 4}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`font-mono font-semibold px-2 py-0.5 rounded text-[11px] ${
                        (prod.stock || 0) < 5
                          ? 'bg-red-50 text-red-700'
                          : 'bg-green-50 text-green-700'
                      }`}
                    >
                      {prod.stock || 0} pairs
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right space-x-2">
                    <Link
                      href={`/product/${prod.slug}`}
                      target="_blank"
                      className="inline-block p-1.5 text-meow-muted hover:text-meow-dark rounded border border-meow-border"
                      title="View on Storefront"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/products/${prod.id}`}
                      className="inline-block p-1.5 text-meow-dark hover:bg-meow-surface rounded border border-meow-border"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(prod.id, prod.name)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-red-200"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
