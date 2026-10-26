'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { VariantManager } from '@/components/admin/VariantManager';
import { dbService } from '@/lib/storage/db';
import { Product, Category, ProductVariant, ProductImage } from '@/lib/supabase/types';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('2485');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('25');
  const [primaryImage, setPrimaryImage] = useState('');
  const [subImage1, setSubImage1] = useState('');
  const [subImage2, setSubImage2] = useState('');
  const [subImage3, setSubImage3] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([
    '5', '6', '7', '8', '9', '10', '11',
  ]);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Color Variants (with miniature footwear images)
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  useEffect(() => {
    async function load() {
      const cats = await dbService.getCategories();
      setCategories(cats);
      if (cats.length > 0) setCategoryId(cats[0].id || cats[0].slug);
    }
    load();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
    );
  };

  const toggleSize = (sz: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !primaryImage) {
      alert('Product Name and Primary Image are mandatory.');
      return;
    }

    setSaving(true);
    try {
      const selectedCat = categories.find((c) => c.id === categoryId || c.slug === categoryId);

      await dbService.saveProduct({
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/\s+/g, '-'),
        category_id: selectedCat?.id || categoryId,
        category: selectedCat,
        description: description.trim() || 'Premium handcrafted footwear featuring anatomical comfort footbeds.',
        price: Number(price) || 2485,
        sale_price: salePrice ? Number(salePrice) : null,
        stock: Number(stock) || 0,
        primary_image_url: primaryImage,
        sizes: selectedSizes,
        highlights: ['Lightweight Comfort', 'Cushioned Footbed', 'Premium Materials', 'Built for Everyday'],
        specifications: {
          'Sole Material': 'High-density EVA',
          'Insole': 'Anatomical Cork Footbed',
          'Upper': 'Water-resistant Vegan Nubuck',
          'Closure': 'Dual Adjustable Buckles',
          'Fit': 'True to size',
        },
        is_bestseller: isBestseller,
        is_new_arrival: isNewArrival,
        is_featured: isFeatured,
        is_active: isActive,
        variants,
        images: [subImage1, subImage2, subImage3]
          .filter(Boolean)
          .map((url, idx) => ({
            id: `img-${Date.now()}-${idx}`,
            product_id: '',
            image_url: url,
            display_order: idx + 1,
          })) as ProductImage[],
      });

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const allSizes = ['4', '5', '6', '7', '8', '9', '10', '11'];

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-meow-muted hover:text-meow-dark"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
      </div>

      <AdminHeader
        title="Add New MEOW Footwear"
        description="Enter product details, pricing, upload high-res photography, and configure color variants with miniature thumbnails."
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Product Information Card */}
        <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark pb-3 border-b border-meow-border">
            1. Basic Information & Collection
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Women's EVA Cloud Mule Sandal (ID4069)"
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border outline-none focus:border-meow-dark"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border outline-none focus:border-meow-dark font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                Collection / Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border outline-none focus:border-meow-dark cursor-pointer bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id || c.slug} value={c.id || c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                Regular Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border outline-none focus:border-meow-dark font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                Sale Price (₹ Optional)
              </label>
              <input
                type="number"
                min="0"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="Leave blank if no discount"
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border outline-none focus:border-meow-dark font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-meow-dark block mb-1">
              Product Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Craftsmanship details, anatomical footbed ergonomic story, styling notes..."
              className="w-full text-xs p-3.5 rounded border border-meow-border outline-none focus:border-meow-dark"
            />
          </div>
        </div>

        {/* Media & Sizing Card */}
        <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark pb-3 border-b border-meow-border">
            2. Primary Imagery & Size Availability
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <ImageUploader
              label="Primary Product Image (Cloudinary or Direct URL)"
              folder="meow/products"
              value={primaryImage}
              aspectRatio="aspect-[4/3]"
              onChange={(url) => setPrimaryImage(url)}
            />

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-meow-dark block mb-2">
                  Available Footwear Sizes (UK / IND)
                </label>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSize(sz)}
                        className={`w-10 h-10 rounded border text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-meow-dark text-white border-meow-dark'
                            : 'bg-meow-surface text-meow-muted border-meow-border hover:border-meow-dark'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-meow-dark block mb-1">
                  Overall Total Stock Inventory
                </label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border"
                />
              </div>

              {/* Promotional Display Flags */}
              <div className="pt-2 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-meow-dark block mb-1">
                  Homepage Placement Flags
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBestseller}
                      onChange={(e) => setIsBestseller(e.target.checked)}
                      className="rounded accent-meow-dark"
                    />
                    <span>Best Seller</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNewArrival}
                      onChange={(e) => setIsNewArrival(e.target.checked)}
                      className="rounded accent-meow-dark"
                    />
                    <span>New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded accent-meow-dark"
                    />
                    <span>Featured Product</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded accent-meow-dark"
                    />
                    <span>Published Active</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Multiple Product Sub-Images Section */}
          <div className="pt-6 border-t border-meow-border space-y-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-meow-dark block">
                Additional Product Sub-Images (3 Angles: Side, Insole, Outsole)
              </span>
              <p className="text-[11px] text-meow-muted mt-0.5">
                Upload up to 3 high-resolution alternate angles (e.g. side profile, top ergonomic insole, outsole tread). These show in the storefront product gallery alongside the primary image.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-1">
              <ImageUploader
                label="Sub-Image 1 (Side Profile)"
                folder="meow/products"
                value={subImage1}
                aspectRatio="aspect-[4/3]"
                onChange={(url) => setSubImage1(url)}
              />

              <ImageUploader
                label="Sub-Image 2 (Top / Insole Contour)"
                folder="meow/products"
                value={subImage2}
                aspectRatio="aspect-[4/3]"
                onChange={(url) => setSubImage2(url)}
              />

              <ImageUploader
                label="Sub-Image 3 (Outsole / Tread Angle)"
                folder="meow/products"
                value={subImage3}
                aspectRatio="aspect-[4/3]"
                onChange={(url) => setSubImage3(url)}
              />
            </div>
          </div>
        </div>

        {/* Color Variant Management with Miniature Footwear Images */}
        <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
          <VariantManager variants={variants} onChange={setVariants} />
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 p-4 border border-meow-border rounded-xl bg-white sticky bottom-6 shadow-lg">
          <Link
            href="/admin/products"
            className="px-6 py-2.5 border border-meow-border text-meow-dark text-xs uppercase tracking-wider font-semibold rounded hover:bg-meow-surface"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 bg-meow-dark text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-meow-dark/85 shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Product & Publish'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
