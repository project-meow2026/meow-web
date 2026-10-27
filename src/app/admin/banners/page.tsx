'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, Image as ImageIcon, Sparkles, Layers, Eye, ArrowRight } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { 
  dbService, 
  INITIAL_MID_PAGE_BANNER, 
  INITIAL_BOTTOM_CTA, 
  INITIAL_THE_MEOW_STANDARD 
} from '@/lib/storage/db';
import { 
  MidPageBannerSetting, 
  BottomCtaSetting, 
  TheMeowStandardSetting 
} from '@/lib/supabase/types';

export default function AdminBannersPage() {
  const [activeTab, setActiveTab] = useState<'mid' | 'bottom' | 'standard'>('mid');
  const [midBanner, setMidBanner] = useState<MidPageBannerSetting>(INITIAL_MID_PAGE_BANNER);
  const [bottomCta, setBottomCta] = useState<BottomCtaSetting>(INITIAL_BOTTOM_CTA);
  const [standardBanner, setStandardBanner] = useState<TheMeowStandardSetting>(INITIAL_THE_MEOW_STANDARD);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [mid, btm, std] = await Promise.all([
          dbService.getMidPageBanner(),
          dbService.getBottomCta(),
          dbService.getTheMeowStandard(),
        ]);
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
      if (activeTab === 'mid') {
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
        title="Homepage Banners & Promotional Sections CMS"
        description="Customize the editorial image banner between products, the bottom newsletter CTA background, and brand story banners."
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

            {/* Live Visual Preview */}
            <div className="border border-meow-border rounded-xl p-6 bg-white shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-meow-dark">
                <Eye className="w-4 h-4" />
                <span>Live Storefront Preview</span>
              </div>

              <div className="rounded-2xl overflow-hidden border border-neutral-200/80 bg-[#FAF8F5] grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="relative min-h-[260px] bg-neutral-100 overflow-hidden">
                  {midBanner.image_url ? (
                    <img
                      src={midBanner.image_url}
                      alt="Banner Preview"
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                      No Image Uploaded
                    </div>
                  )}
                </div>
                <div className="p-8 sm:p-12 flex flex-col justify-center space-y-4 bg-[#FAF8F5]">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#7A756F] font-sans font-medium">
                    {midBanner.badge || 'MEOW HERITAGE'}
                  </span>
                  <h3 className="font-editorial text-3xl sm:text-4xl text-[#1A1A1A] font-normal leading-tight whitespace-pre-line">
                    {midBanner.heading || 'Every Step\nA Story'}
                  </h3>
                  <p className="text-xs text-[#5C564F] font-sans leading-relaxed max-w-sm">
                    {midBanner.subtitle || 'Crafted for modern lives with purpose, comfort and character.'}
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-white text-[11px] uppercase tracking-wider font-semibold">
                      <span>{midBanner.cta_text || 'EXPLORE OUR STORY'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
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

            {/* Live Visual Preview */}
            <div className="border border-meow-border rounded-xl p-6 bg-white shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-meow-dark">
                <Eye className="w-4 h-4" />
                <span>Live Storefront Preview</span>
              </div>

              <div className="relative rounded-xl overflow-hidden min-h-[160px] p-8 sm:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-black">
                {bottomCta.background_image_url && (
                  <img
                    src={bottomCta.background_image_url}
                    alt="Bottom CTA Background"
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-60 pointer-events-none"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/80 pointer-events-none" />

                <div className="relative z-10 space-y-2 max-w-md">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-sans block">
                    {bottomCta.badge || 'MEOW / JOURNAL'}
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl text-white font-light">
                    {bottomCta.heading || 'Get Early Access'}
                  </h3>
                  <p className="text-xs text-neutral-300 font-sans">
                    {bottomCta.subtitle || 'New arrivals, stories and special offers straight to your inbox.'}
                  </p>
                </div>

                <div className="relative z-10 w-full md:w-auto">
                  <div className="flex items-center bg-white rounded-full p-1 pl-4 max-w-md shadow-lg">
                    <span className="text-xs text-neutral-400 flex-1">Enter your email</span>
                    <button
                      type="button"
                      className="px-5 py-2 rounded-full bg-[#E8CBA7] text-neutral-900 text-xs font-semibold uppercase tracking-wider"
                    >
                      {bottomCta.button_text || 'SUBSCRIBE'} →
                    </button>
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
