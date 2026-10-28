'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Save, Check, ExternalLink, Image as ImageIcon, LayoutGrid } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { dbService, INITIAL_COLLECTIONS_PAGE } from '@/lib/storage/db';
import { CollectionsPageSetting } from '@/lib/supabase/types';

export default function AdminCollectionsPage() {
  const [content, setContent] = useState<CollectionsPageSetting>(INITIAL_COLLECTIONS_PAGE);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function load() {
      const data = await dbService.getCollectionsPage();
      setContent({
        ...INITIAL_COLLECTIONS_PAGE,
        ...data,
        cards:
          data.cards && data.cards.length > 0
            ? data.cards
            : INITIAL_COLLECTIONS_PAGE.cards,
      });
    }
    load();
  }, []);

  const persistSection = async (
    nextContent: CollectionsPageSetting,
    message = 'Collections page saved successfully!'
  ) => {
    setSaving(true);
    try {
      const saved = await dbService.saveCollectionsPage(nextContent);
      setContent(saved);
      setToastMsg(message);
      setTimeout(() => setToastMsg(''), 3500);
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await persistSection(content);
  };

  const handleUpdateCard = (
    index: number,
    key: 'number' | 'title' | 'slug' | 'description' | 'image_url',
    val: string | null
  ) => {
    const updatedCards = [...content.cards];
    updatedCards[index] = {
      ...updatedCards[index],
      [key]: val,
    };
    const next = { ...content, cards: updatedCards };
    setContent(next);
    if (key === 'image_url') {
      persistSection(next, `Card 0${index + 1} image uploaded & saved!`);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Collections Page CMS"
        description="Manage the Collections Page Hero Banner, the 6 Collection Cards (images & descriptions), and the Bottom Philosophy Banner."
        actionButton={
          <div className="flex items-center gap-3">
            <Link
              href="/collections"
              target="_blank"
              className="flex items-center gap-1.5 px-3.5 py-2 border border-meow-border bg-white rounded text-xs font-semibold text-meow-dark hover:bg-meow-surface transition-colors"
            >
              <span>View Live Collections Page</span>
              <ExternalLink className="w-3.5 h-3.5 text-meow-subtle" />
            </Link>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-meow-dark text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-meow-dark/85 shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        }
      />

      {toastMsg && (
        <div className="mb-6 p-3.5 bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg flex items-center gap-2 animate-fade-in-up">
          <Check className="w-4 h-4 text-green-600" />
          <span className="font-medium">{toastMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 pb-16">
        {/* SECTION 1: TOP HERO BANNER */}
        <div className="p-6 sm:p-8 rounded-xl border border-meow-border bg-white shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-meow-border pb-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark">
                Section 1: Top Hero Banner ("The Six Collections")
              </h2>
              <p className="text-xs text-meow-muted mt-0.5">
                Full-width top editorial banner on the Collections page.
              </p>
            </div>
            <ImageIcon className="w-4 h-4 text-meow-subtle" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-meow-dark block mb-1">
                  Top Eyebrow Label
                </label>
                <input
                  type="text"
                  value={content.hero_badge || ''}
                  onChange={(e) => setContent({ ...content, hero_badge: e.target.value })}
                  placeholder="COLLECTIONS"
                  className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border outline-none focus:border-meow-dark"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-meow-dark block mb-1">
                  Hero Main Heading (Use Enter for line breaks)
                </label>
                <textarea
                  rows={2}
                  value={content.hero_heading || ''}
                  onChange={(e) => setContent({ ...content, hero_heading: e.target.value })}
                  placeholder={'The Six\nCollections'}
                  className="w-full text-xs p-3 rounded border border-meow-border outline-none focus:border-meow-dark font-editorial text-base"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-meow-dark block mb-1">
                  Subtitle Paragraph
                </label>
                <textarea
                  rows={3}
                  value={content.hero_subtitle || ''}
                  onChange={(e) => setContent({ ...content, hero_subtitle: e.target.value })}
                  className="w-full text-xs p-3 rounded border border-meow-border outline-none focus:border-meow-dark"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-meow-dark block mb-1">
                  Bottom Accent Tagline
                </label>
                <input
                  type="text"
                  value={content.hero_accent || ''}
                  onChange={(e) => setContent({ ...content, hero_accent: e.target.value })}
                  placeholder="DISCOVER YOUR EVERYDAY PAIR"
                  className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border outline-none focus:border-meow-dark"
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <ImageUploader
                label="Hero Banner Background Image"
                folder="meow/collections"
                value={content.hero_image_url || ''}
                aspectRatio="aspect-[16/9]"
                onChange={(url) => {
                  const next = { ...content, hero_image_url: url || null };
                  setContent(next);
                  persistSection(next, 'Collections Hero Banner image saved!');
                }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: THE 6 COLLECTION CARDS */}
        <div className="p-6 sm:p-8 rounded-xl border border-meow-border bg-white shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-meow-border pb-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark">
                Section 2: The 6 Collection Cards (3×2 Grid)
              </h2>
              <p className="text-xs text-meow-muted mt-0.5">
                Upload the full card background photo and customize the number, title, description, and category slug for each of the 6 collections.
              </p>
            </div>
            <LayoutGrid className="w-4 h-4 text-meow-subtle" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.cards.map((card, idx) => (
              <div
                key={card.id || idx}
                className="p-5 rounded-xl border border-meow-border bg-[#FAF9F6] space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-meow-dark">
                      Collection Card #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={card.number}
                      onChange={(e) => handleUpdateCard(idx, 'number', e.target.value)}
                      className="w-12 text-center text-xs font-mono font-bold px-2 py-1 rounded border border-meow-border bg-white"
                      title="Card Number"
                    />
                  </div>

                  <ImageUploader
                    label={`Card 0${idx + 1} Photo`}
                    folder="meow/collections"
                    value={card.image_url || ''}
                    aspectRatio="aspect-square"
                    onChange={(url) => handleUpdateCard(idx, 'image_url', url || null)}
                  />

                  <div>
                    <label className="text-[11px] font-semibold text-meow-dark block mb-1">
                      Collection Title (Use Enter for line break)
                    </label>
                    <textarea
                      rows={2}
                      value={card.title}
                      onChange={(e) => handleUpdateCard(idx, 'title', e.target.value)}
                      className="w-full text-xs p-2.5 rounded border border-meow-border bg-white outline-none focus:border-meow-dark font-editorial text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-meow-dark block mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={card.description}
                      onChange={(e) => handleUpdateCard(idx, 'description', e.target.value)}
                      className="w-full text-xs p-2.5 rounded border border-meow-border bg-white outline-none focus:border-meow-dark"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-meow-dark block mb-1">
                      Target Shop Category Slug
                    </label>
                    <input
                      type="text"
                      value={card.slug}
                      onChange={(e) => handleUpdateCard(idx, 'slug', e.target.value)}
                      className="w-full text-xs px-2.5 py-2 rounded border border-meow-border bg-white font-mono text-meow-muted outline-none focus:border-meow-dark"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: BOTTOM DARK PHILOSOPHY BANNER */}
        <div className="p-6 sm:p-8 rounded-xl border border-meow-border bg-white shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-meow-border pb-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark">
                Section 3: Bottom Dark Philosophy Banner ("MADE FOR EVERY STEP.")
              </h2>
              <p className="text-xs text-meow-muted mt-0.5">
                Wide rounded dark banner at the bottom of the Collections page.
              </p>
            </div>
            <ImageIcon className="w-4 h-4 text-meow-subtle" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-meow-dark block mb-1">
                  Eyebrow Label
                </label>
                <input
                  type="text"
                  value={content.philosophy_badge || ''}
                  onChange={(e) => setContent({ ...content, philosophy_badge: e.target.value })}
                  placeholder="OUR PHILOSOPHY"
                  className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border outline-none focus:border-meow-dark"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-meow-dark block mb-1">
                  Banner Heading (Use Enter for line breaks)
                </label>
                <textarea
                  rows={2}
                  value={content.philosophy_heading || ''}
                  onChange={(e) => setContent({ ...content, philosophy_heading: e.target.value })}
                  placeholder={'MADE FOR\nEVERY STEP.'}
                  className="w-full text-xs p-3 rounded border border-meow-border outline-none focus:border-meow-dark font-editorial text-base"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-meow-dark block mb-1">
                  Right Column Description Text
                </label>
                <textarea
                  rows={3}
                  value={content.philosophy_body || ''}
                  onChange={(e) => setContent({ ...content, philosophy_body: e.target.value })}
                  className="w-full text-xs p-3 rounded border border-meow-border outline-none focus:border-meow-dark"
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <ImageUploader
                label="Bottom Philosophy Banner Background Image"
                folder="meow/collections"
                value={content.philosophy_image_url || ''}
                aspectRatio="aspect-[21/9]"
                onChange={(url) => {
                  const next = { ...content, philosophy_image_url: url || null };
                  setContent(next);
                  persistSection(next, 'Philosophy Banner image saved!');
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-7 py-3 bg-meow-dark text-white text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-meow-dark/90 shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving All Changes...' : 'Save Collections Page'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

