'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Save, 
  Check, 
  Image as ImageIcon, 
  Sparkles, 
  Layers, 
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { 
  dbService, 
  INITIAL_MID_PAGE_BANNER, 
  INITIAL_BOTTOM_CTA, 
  INITIAL_THE_MEOW_STANDARD,
  INITIAL_SHOP_HERO_BANNER,
} from '@/lib/storage/db';
import { 
  MidPageBannerSetting, 
  BottomCtaSetting, 
  TheMeowStandardSetting,
  ShopHeroBannerSetting,
} from '@/lib/supabase/types';

export default function AdminBannersPage() {
  const [activeTab, setActiveTab] = useState<'shop' | 'mid' | 'bottom' | 'standard'>('shop');
  const [shopBanner, setShopBanner] = useState<ShopHeroBannerSetting>(INITIAL_SHOP_HERO_BANNER);
  const [midBanner, setMidBanner] = useState<MidPageBannerSetting>(INITIAL_MID_PAGE_BANNER);
  const [bottomCta, setBottomCta] = useState<BottomCtaSetting>(INITIAL_BOTTOM_CTA);
  const [standardBanner, setStandardBanner] = useState<TheMeowStandardSetting>(INITIAL_THE_MEOW_STANDARD);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [shop, mid, btm, std] = await Promise.all([
          dbService.getShopHeroBanner(),
          dbService.getMidPageBanner(),
          dbService.getBottomCta(),
          dbService.getTheMeowStandard(),
        ]);
        setShopBanner(shop);
        setMidBanner(mid);
        setBottomCta(btm);
        setStandardBanner(std);
      } catch (err) {
        console.error('Failed to load banners:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (activeTab === 'shop') {
        const saved = await dbService.saveShopHeroBanner(shopBanner);
        setShopBanner(saved);
        setToastMsg('Shopping Page Hero Banner saved successfully!');
      } else if (activeTab === 'mid') {
        const saved = await dbService.saveMidPageBanner(midBanner);
        setMidBanner(saved);
        setToastMsg('Mid-page promotional banner saved successfully!');
      } else if (activeTab === 'bottom') {
        const saved = await dbService.saveBottomCta(bottomCta);
        setBottomCta(saved);
        setToastMsg('Bottom newsletter CTA banner saved successfully!');
      } else if (activeTab === 'standard') {
        const saved = await dbService.saveTheMeowStandard(standardBanner);
        setStandardBanner(saved);
        setToastMsg('The MEOW Standard story banner saved successfully!');
      }
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Storefront & Shopping Page Banners CMS"
        description="Customize the Shopping Page top hero banner, the homepage editorial image banner between products, the newsletter CTA, and brand story banners."
      />

      {toastMsg && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg flex items-center gap-2 animate-fade-in-up">
          <Check className="w-4 h-4 text-green-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-meow-border mb-8 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('shop')}
          className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'shop'
              ? 'border-meow-dark text-meow-dark'
              : 'border-transparent text-meow-muted hover:text-meow-dark'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-meow-terracotta" />
          <span>Shopping Page Hero Banner (/shop)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mid')}
          className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'mid'
              ? 'border-meow-dark text-meow-dark'
              : 'border-transparent text-meow-muted hover:text-meow-dark'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Mid-Page Banner (Between Products)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bottom')}
          className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'bottom'
              ? 'border-meow-dark text-meow-dark'
              : 'border-transparent text-meow-muted hover:text-meow-dark'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Bottom Newsletter CTA Banner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('standard')}
          className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'standard'
              ? 'border-meow-dark text-meow-dark'
              : 'border-transparent text-meow-muted hover:text-meow-dark'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>The MEOW Standard Story Banner</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* TAB 0: SHOPPING PAGE HERO BANNER */}
        {activeTab === 'shop' && (
          <div className="space-y-8">
            <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-meow-border">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-meow-terracotta" />
                    <span>Shopping Page Hero Banner Settings (/shop)</span>
                  </h2>
                  <p className="text-xs text-meow-muted mt-1 max-w-2xl">
                    Customize the top hero banner for your storefront shopping catalog. Set custom titles, badges, accent tags, and upload a luxury banner photo or utilize the clean editorial beige gradient.
                  </p>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <Link
                    href="/shop"
                    target="_blank"
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-meow-border rounded text-xs font-medium text-meow-dark hover:bg-meow-surface transition-colors"
                  >
                    <span>View Live Shop</span>
                    <ExternalLink className="w-3.5 h-3.5 text-meow-subtle" />
                  </Link>
                  <label className="flex items-center gap-2 cursor-pointer bg-meow-surface px-3 py-1.5 rounded border border-meow-border">
                    <input
                      type="checkbox"
                      checked={shopBanner.is_enabled}
                      onChange={(e) => setShopBanner({ ...shopBanner, is_enabled: e.target.checked })}
                      className="rounded border-meow-border text-meow-dark focus:ring-meow-dark h-4 w-4"
                    />
                    <span className="text-xs font-semibold text-meow-dark">Enabled</span>
                  </label>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-meow-dark mb-1.5">
                      Badge / Eyebrow Text
                    </label>
                    <input
                      type="text"
                      value={shopBanner.badge}
                      onChange={(e) => setShopBanner({ ...shopBanner, badge: e.target.value })}
                      placeholder="DISCOVER"
                      className="w-full text-xs px-3.5 py-2.5 bg-meow-surface border border-meow-border rounded-md outline-none focus:border-meow-dark font-sans"
                    />
                    <p className="text-[11px] text-meow-subtle mt-1">Small uppercase tag displayed above the main heading.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-meow-dark mb-1.5">
                      Main Heading
                    </label>
                    <input
                      type="text"
                      value={shopBanner.heading}
                      onChange={(e) => setShopBanner({ ...shopBanner, heading: e.target.value })}
                      placeholder="ALL PRODUCTS"
                      className="w-full text-xs px-3.5 py-2.5 bg-meow-surface border border-meow-border rounded-md outline-none focus:border-meow-dark font-editorial text-sm"
                    />
                    <p className="text-[11px] text-meow-subtle mt-1">Large editorial title displayed prominently at the top of the shopping page.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-meow-dark mb-1.5">
                      Subtitle / Caption Description
                    </label>
                    <textarea
                      rows={3}
                      value={shopBanner.subtitle}
                      onChange={(e) => setShopBanner({ ...shopBanner, subtitle: e.target.value })}
                      placeholder="Crafted for everyday comfort. Engineered anatomical support."
                      className="w-full text-xs px-3.5 py-2.5 bg-meow-surface border border-meow-border rounded-md outline-none focus:border-meow-dark"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-meow-dark mb-1.5">
                      Right Accent Tag
                    </label>
                    <input
                      type="text"
                      value={shopBanner.accent_tag || ''}
                      onChange={(e) => setShopBanner({ ...shopBanner, accent_tag: e.target.value })}
                      placeholder="STEP INTO STYLE"
                      className="w-full text-xs px-3.5 py-2.5 bg-meow-surface border border-meow-border rounded-md outline-none focus:border-meow-dark font-sans"
                    />
                    <p className="text-[11px] text-meow-subtle mt-1">Bordered accent label positioned to the right.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-meow-dark mb-1.5">
                      Hero Banner Background Image
                    </label>
                    <p className="text-[11px] text-meow-muted mb-2">
                      Upload a banner photo for your shopping page. If empty, the clean editorial beige gradient will be used.
                    </p>
                    <ImageUploader
                      label="Shopping Page Hero Banner Image"
                      folder="meow/banners"
                      value={shopBanner.background_image_url || ''}
                      aspectRatio="aspect-[16/5]"
                      onChange={(url) => setShopBanner({ ...shopBanner, background_image_url: url })}
                    />
                    {shopBanner.background_image_url && (
                      <button
                        type="button"
                        onClick={() => setShopBanner({ ...shopBanner, background_image_url: null })}
                        className="mt-2 text-xs text-red-600 hover:text-red-700 underline font-medium"
                      >
                        Remove Image & Use Default Beige Gradient
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: MID-PAGE BANNER BETWEEN PRODUCTS */}
        {activeTab === 'mid' && (
          <div className="space-y-8">
            <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-meow-border">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark">
                    Mid-Page Banner Settings ("Every Step A Story")
                  </h2>
                  <p className="text-xs text-meow-muted mt-0.5">
                    This banner appears on the homepage directly between the Best Sellers and New Arrivals product grids.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-meow-dark">
                  <input
                    type="checkbox"
                    checked={midBanner.is_enabled}
                    onChange={(e) => setMidBanner({ ...midBanner, is_enabled: e.target.checked })}
                    className="w-4 h-4 rounded border-meow-border text-meow-dark focus:ring-0"
                  />
                  <span>Enable Banner</span>
                </label>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Cloudinary Image Uploader */}
                <div className="space-y-3">
                  <ImageUploader
                    label="Banner Lifestyle Image (Left Side)"
                    folder="meow/banners"
                    value={midBanner.image_url}
                    aspectRatio="aspect-[4/3]"
                    onChange={(url) => setMidBanner({ ...midBanner, image_url: url })}
                  />
                  <p className="text-[11px] text-meow-subtle">
                    Recommended: 1200x900px or 4:3 ratio lifestyle sandal photo. Uploads directly to Cloudinary edge storage.
                  </p>
                </div>

                {/* Right: Content Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-meow-dark mb-1.5">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={midBanner.badge}
                      onChange={(e) => setMidBanner({ ...midBanner, badge: e.target.value })}
                      placeholder="MEOW HERITAGE"
                      className="w-full text-xs px-3.5 py-2.5 bg-meow-surface border border-meow-border rounded-md outline-none focus:border-meow-dark"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-meow-dark mb-1.5">
                      Main Heading
                    </label>
                    <input
                      type="text"
                      value={midBanner.heading}
                      onChange={(e) => setMidBanner({ ...midBanner, heading: e.target.value })}
                      placeholder="Every Step A Story"
                      className="w-full text-xs px-3.5 py-2.5 bg-meow-surface border border-meow-border rounded-md outline-none focus:border-meow-dark font-editorial text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-meow-dark mb-1.5">
                      Subtitle / Description
                    </label>
                    <textarea
                      rows={3}
                      value={midBanner.subtitle}
                      onChange={(e) => setMidBanner({ ...midBanner, subtitle: e.target.value })}
                      placeholder="Crafted for modern lives with purpose, comfort and character."
                      className="w-full text-xs px-3.5 py-2.5 bg-meow-surface border border-meow-border rounded-md outline-none focus:border-meow-dark"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-meow-dark mb-1.5">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={midBanner.cta_text}
                        onChange={(e) => setMidBanner({ ...midBanner, cta_text: e.target.value })}
                        placeholder="EXPLORE OUR STORY"
                        className="w-full text-xs px-3.5 py-2.5 bg-meow-surface border border-meow-border rounded-md outline-none focus:border-meow-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-meow-dark mb-1.5">
                        Button Link
                      </label>
                      <input
                        type="text"
                        value={midBanner.cta_link}
                        onChange={(e) => setMidBanner({ ...midBanner, cta_link: e.target.value })}
                        placeholder="/about"
                        className="w-full text-xs px-3.5 py-2.5 bg-meow-surface border border-meow-border rounded-md outline-none focus:border-meow-dark"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOTTOM CTA NEWSLETTER BANNER */}
        {activeTab === 'bottom' && (
          <div className="space-y-8">
            <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-meow-border">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark">
                    Bottom Newsletter CTA Banner ("Get Early Access")
                  </h2>
                  <p className="text-xs text-meow-muted mt-0.5">
                    Customize the background image, headline, and newsletter subscription form above the footer.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-meow-dark">
                  <input
                    type="checkbox"
                    checked={bottomCta.is_enabled}
                    onChange={(e) => setBottomCta({ ...bottomCta, is_enabled: e.target.checked })}
                    className="w-4 h-4 rounded border-meow-border text-meow-dark focus:ring-0"
                  />
                  <span>Enable Bottom CTA</span>
                </label>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Background Image Uploader */}
                <div className="space-y-3">
                  <ImageUploader
                    label="CTA Background Image"
                    folder="meow/banners"
                    value={bottomCta.background_image_url}
                    aspectRatio="aspect-[16/7]"
                    onChange={(url) => setBottomCta({ ...bottomCta, background_image_url: url })}
                  />
                  <p className="text-[11px] text-meow-subtle">
                    Recommended: 1920x800px dark textured, stone, or leather background. Uploads to Cloudinary.
                  </p>
                </div>

                {/* Content Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-meow-dark mb-1.5">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={bottomCta.badge}
                      onChange={(e) => setBottomCta({ ...bottomCta, badge: e.target.value })}
                      placeholder="MEOW / JOURNAL"
                      className="w-full text-xs px-3.5 py-2.5 bg-meow-surface border border-meow-border rounded-md outline-none focus:border-meow-dark"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-meow-dark mb-1.5">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={bottomCta.heading}
                      onChange={(e) => setBottomCta({ ...bottomCta, heading: e.target.value })}
                      placeholder="Get Early Access"
                      className="w-full text-xs px-3.5 py-2.5 bg-meow-surface border border-meow-border rounded-md outline-none focus:border-meow-dark font-editorial text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-meow-dark mb-1.5">
                      Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={bottomCta.subtitle}
                      onChange={(e) => setBottomCta({ ...bottomCta, subtitle: e.target.value })}
                      placeholder="New arrivals, stories and special offers straight to your inbox."
                      className="w-full text-xs px-3.5 py-2.5 bg-meow-surface border border-meow-border rounded-md outline-none focus:border-meow-dark"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-meow-dark mb-1.5">
                      Subscribe Button Text
                    </label>
                    <input
                      type="text"
                      value={bottomCta.button_text}
                      onChange={(e) => setBottomCta({ ...bottomCta, button_text: e.target.value })}
                      placeholder="SUBSCRIBE"
                      className="w-full text-xs px-3.5 py-2.5 bg-meow-surface border border-meow-border rounded-md outline-none focus:border-meow-dark"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: THE MEOW STANDARD STORY BANNER */}
        {activeTab === 'standard' && (
          <div className="space-y-8">
            <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-meow-border">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark">
                    The MEOW Standard Story Section
                  </h2>
                  <p className="text-xs text-meow-muted mt-0.5">
                    Customize the lifestyle walking footwear photo and brand philosophy text.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-meow-dark">
                  <input
                    type="checkbox"
                    checked={standardBanner.is_enabled}
                    onChange={(e) => setStandardBanner({ ...standardBanner, is_enabled: e.target.checked })}
                    className="w-4 h-4 rounded border-meow-border text-meow-dark focus:ring-0"
                  />
                  <span>Enable Section</span>
                </label>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <ImageUploader
                    label="Lifestyle Walking Image (Left Side)"
                    folder="meow/banners"
                    value={standardBanner.image_url}
                    aspectRatio="aspect-[4/3]"
                    onChange={(url) => setStandardBanner({ ...standardBanner, image_url: url })}
                  />
                  <p className="text-[11px] text-meow-subtle">
                    Recommended: 1200x900px lifestyle image showing footwear walking naturally on stone.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-meow-dark mb-1.5">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={standardBanner.badge}
                      onChange={(e) => setStandardBanner({ ...standardBanner, badge: e.target.value })}
                      placeholder="THE MEOW STANDARD"
                      className="w-full text-xs px-3.5 py-2.5 bg-meow-surface border border-meow-border rounded-md outline-none focus:border-meow-dark"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-meow-dark mb-1.5">
                      Heading
                    </label>
                    <input
                      type="text"
                      value={standardBanner.heading}
                      onChange={(e) => setStandardBanner({ ...standardBanner, heading: e.target.value })}
                      placeholder="Designed for Calm, Confident Living"
                      className="w-full text-xs px-3.5 py-2.5 bg-meow-surface border border-meow-border rounded-md outline-none focus:border-meow-dark font-editorial text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-meow-dark mb-1.5">
                      Subtitle / Paragraph
                    </label>
                    <textarea
                      rows={4}
                      value={standardBanner.subtitle}
                      onChange={(e) => setStandardBanner({ ...standardBanner, subtitle: e.target.value })}
                      placeholder="We believe what touches your feet should liberate your stride..."
                      className="w-full text-xs px-3.5 py-2.5 bg-meow-surface border border-meow-border rounded-md outline-none focus:border-meow-dark"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Save Button */}
        <div className="flex items-center justify-end gap-4 p-4 border border-meow-border rounded-xl bg-white shadow-sm">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 bg-meow-dark text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-meow-dark/85 shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Banner Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
