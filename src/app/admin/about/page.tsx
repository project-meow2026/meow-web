'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Save, Check, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { dbService, INITIAL_ABOUT_SECTION } from '@/lib/storage/db';
import { AboutSection } from '@/lib/supabase/types';

export default function AdminAboutPage() {
  const [content, setContent] = useState<AboutSection>(INITIAL_ABOUT_SECTION);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function load() {
      const data = await dbService.getAboutSection();
      setContent({
        ...INITIAL_ABOUT_SECTION,
        ...data,
        values:
          data.values && data.values.length > 0
            ? data.values
            : INITIAL_ABOUT_SECTION.values,
      });
    }
    load();
  }, []);

  const persistSection = async (nextContent: AboutSection, message = 'About Us content saved successfully!') => {
    setSaving(true);
    try {
      const saved = await dbService.saveAboutSection(nextContent);
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

  const handleUpdateValue = (index: number, key: 'title' | 'description', val: string) => {
    const updatedValues = [...content.values];
    updatedValues[index] = { ...updatedValues[index], [key]: val };
    setContent({ ...content, values: updatedValues });
  };

  return (
    <div>
      <AdminHeader
        title="About Us & Brand Narrative CMS"
        description="Manage all 4 sections and images for the About Us page (Hero Banner, About MEOW Story Image, Our Values Craft Image, and Vision & Mission Background)."
        actionButton={
          <div className="flex items-center gap-3">
            <Link
              href="/about"
              target="_blank"
              className="flex items-center gap-1.5 px-3.5 py-2 border border-meow-border bg-white rounded text-xs font-semibold text-meow-dark hover:bg-meow-surface transition-colors"
            >
              <span>View Live About Page</span>
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

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: HERO STORY BANNER */}
        <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
          <div className="pb-3 border-b border-meow-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark">
                1. Top Hero Story Banner (&ldquo;CRAFTED FOR A BOLDER YOU.&rdquo;)
              </h2>
              <p className="text-xs text-meow-muted mt-0.5">
                Full-width top hero banner with left-aligned story text and your uploaded sandal hero photo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-meow-dark block mb-1.5">
                  Eyebrow Tagline
                </label>
                <input
                  type="text"
                  value={content.tagline}
                  onChange={(e) => setContent({ ...content, tagline: e.target.value })}
                  placeholder="OUR STORY"
                  className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border bg-meow-surface focus:bg-white focus:border-meow-dark outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-meow-dark block mb-1.5">
                  Main Story Heading * (Supports Multi-line)
                </label>
                <textarea
                  rows={3}
                  required
                  value={content.heading}
                  onChange={(e) => setContent({ ...content, heading: e.target.value })}
                  placeholder={'CRAFTED\nFOR A\nBOLDER YOU.'}
                  className="w-full text-sm px-3.5 py-2.5 rounded border border-meow-border bg-meow-surface focus:bg-white focus:border-meow-dark outline-none font-editorial"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-meow-dark block mb-1.5">
                  Short Narrative Summary
                </label>
                <textarea
                  rows={3}
                  value={content.story_summary}
                  onChange={(e) => setContent({ ...content, story_summary: e.target.value })}
                  className="w-full text-xs p-3.5 rounded border border-meow-border bg-meow-surface focus:bg-white focus:border-meow-dark outline-none"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-2">
              <ImageUploader
                label="Hero Story Banner Image (Full-Width Background)"
                folder="meow/about"
                value={content.banner_image_url || ''}
                aspectRatio="aspect-[16/9]"
                onChange={async (url) => {
                  const next = { ...content, banner_image_url: url || null };
                  setContent(next);
                  await persistSection(next, 'Hero Story Banner image saved!');
                }}
              />
              <p className="text-[11px] text-meow-subtle">
                Upload the wide sandal hero banner image. Automatically saves on upload.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: ABOUT MEOW - EVERY STEP A STORY */}
        <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
          <div className="pb-3 border-b border-meow-border">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark">
              2. About MEOW Section (&ldquo;EVERY STEP A STORY&rdquo;)
            </h2>
            <p className="text-xs text-meow-muted mt-0.5">
              3-column section: Left close-up footwear photo, Center brand narrative, and Right 4 feature pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-2">
              <ImageUploader
                label="Left Editorial Footwear Close-up Image"
                folder="meow/about"
                value={content.craft_image_url || ''}
                aspectRatio="aspect-square"
                onChange={async (url) => {
                  const next = { ...content, craft_image_url: url || null };
                  setContent(next);
                  await persistSection(next, 'About MEOW left image saved!');
                }}
              />
              <p className="text-[11px] text-meow-subtle">
                Displayed on the left side of the &ldquo;EVERY STEP A STORY&rdquo; section.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-meow-dark block mb-1.5">
                  Section Heading
                </label>
                <textarea
                  rows={2}
                  value={content.craft_heading}
                  onChange={(e) => setContent({ ...content, craft_heading: e.target.value })}
                  placeholder={'EVERY STEP\nA STORY'}
                  className="w-full text-sm px-3.5 py-2.5 rounded border border-meow-border bg-meow-surface focus:bg-white focus:border-meow-dark outline-none font-editorial"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-meow-dark block mb-1.5">
                  Story Description Paragraph
                </label>
                <textarea
                  rows={4}
                  value={content.craft_body}
                  onChange={(e) => setContent({ ...content, craft_body: e.target.value })}
                  className="w-full text-xs p-3.5 rounded border border-meow-border bg-meow-surface focus:bg-white focus:border-meow-dark outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: OUR VALUES + RIGHT CRAFT IMAGE */}
        <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
          <div className="pb-3 border-b border-meow-border">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark">
              3. Our Values (4 Cards on Left) &amp; Craftsmanship Image on Right (&ldquo;TRADITION MEETS MODERN STYLE&rdquo;)
            </h2>
            <p className="text-xs text-meow-muted mt-0.5">
              Left side displays the 4 value cards; Right side displays the artisan shoemaking photo with overlay caption.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: 4 Value Cards */}
            <div className="lg:col-span-7 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-meow-dark block">
                4 Core Value Cards
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.values.map((v, i) => (
                  <div key={i} className="p-4 rounded-lg border border-meow-border bg-[#FAF9F6] space-y-2">
                    <span className="text-[10px] font-mono uppercase text-meow-subtle">
                      Card #{i + 1}
                    </span>
                    <input
                      type="text"
                      value={v.title}
                      onChange={(e) => handleUpdateValue(i, 'title', e.target.value)}
                      className="w-full text-xs font-bold uppercase tracking-wider px-2.5 py-1.5 rounded border border-meow-border bg-white outline-none focus:border-meow-dark"
                    />
                    <textarea
                      rows={3}
                      value={v.description}
                      onChange={(e) => handleUpdateValue(i, 'description', e.target.value)}
                      className="w-full text-xs p-2.5 rounded border border-meow-border bg-white outline-none focus:border-meow-dark"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Values Feature Image & Overlay Caption */}
            <div className="lg:col-span-5 space-y-4">
              <ImageUploader
                label="Right Craftsmanship Image (Next to Values)"
                folder="meow/about"
                value={content.values_image_url || ''}
                aspectRatio="aspect-[4/3]"
                onChange={async (url) => {
                  const next = { ...content, values_image_url: url || null };
                  setContent(next);
                  await persistSection(next, 'Our Values right image saved!');
                }}
              />

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-meow-dark block mb-1.5">
                  Image Overlay Text
                </label>
                <textarea
                  rows={3}
                  value={content.values_image_caption ?? 'TRADITION\nMEETS\nMODERN STYLE'}
                  onChange={(e) => setContent({ ...content, values_image_caption: e.target.value })}
                  placeholder={'TRADITION\nMEETS\nMODERN STYLE'}
                  className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border bg-meow-surface focus:bg-white focus:border-meow-dark outline-none font-editorial"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: OUR VISION & OUR MISSION */}
        <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
          <div className="pb-3 border-b border-meow-border">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark">
              4. Bottom Dark Banner: Our Vision &amp; Our Mission
            </h2>
            <p className="text-xs text-meow-muted mt-0.5">
              Full-width dark banner at the bottom of the About Us page with optional dark texture background image.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-meow-dark block mb-1.5">
                  Our Vision Statement (Left Column)
                </label>
                <textarea
                  rows={4}
                  value={content.vision_text}
                  onChange={(e) => setContent({ ...content, vision_text: e.target.value })}
                  className="w-full text-xs p-3.5 rounded border border-meow-border bg-meow-surface focus:bg-white focus:border-meow-dark outline-none font-editorial text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-meow-dark block mb-1.5">
                  Our Mission Statement (Right Column)
                </label>
                <textarea
                  rows={4}
                  value={content.mission_text}
                  onChange={(e) => setContent({ ...content, mission_text: e.target.value })}
                  className="w-full text-xs p-3.5 rounded border border-meow-border bg-meow-surface focus:bg-white focus:border-meow-dark outline-none font-editorial text-sm"
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-2">
              <ImageUploader
                label="Vision & Mission Dark Background Image (Optional)"
                folder="meow/about"
                value={content.vision_image_url || ''}
                aspectRatio="aspect-[16/9]"
                onChange={async (url) => {
                  const next = { ...content, vision_image_url: url || null };
                  setContent(next);
                  await persistSection(next, 'Vision & Mission background image saved!');
                }}
              />
              <p className="text-[11px] text-meow-subtle">
                Dark close-up footwear texture displayed behind the Vision &amp; Mission statements.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end p-4 border border-meow-border rounded-xl bg-white shadow-sm">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-meow-dark text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-meow-dark/85 shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All About Us Content'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
