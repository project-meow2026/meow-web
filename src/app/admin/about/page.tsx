'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, Plus, Trash2 } from 'lucide-react';
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
      setContent(data);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dbService.saveAboutSection(content);
      setToastMsg('About Us content updated successfully.');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
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
        description="Update MEOW brand heritage, craftsmanship story, mission, vision, and core values."
      />

      {toastMsg && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded flex items-center gap-2 animate-fade-in-up">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Banner & Brand Story */}
        <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark pb-3 border-b border-meow-border">
            1. Hero Story Banner
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                Tagline Badge
              </label>
              <input
                type="text"
                value={content.tagline}
                onChange={(e) => setContent({ ...content, tagline: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                Main Story Heading *
              </label>
              <input
                type="text"
                required
                value={content.heading}
                onChange={(e) => setContent({ ...content, heading: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border font-editorial text-sm font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-meow-dark block mb-1">
              Short Narrative Summary
            </label>
            <textarea
              rows={3}
              value={content.story_summary}
              onChange={(e) => setContent({ ...content, story_summary: e.target.value })}
              className="w-full text-xs p-3.5 rounded border border-meow-border"
            />
          </div>

          <ImageUploader
            label="Story Banner Image (Cloudinary)"
            folder="meow/about"
            value={content.banner_image_url}
            aspectRatio="aspect-banner"
            onChange={(url) => setContent({ ...content, banner_image_url: url })}
          />
        </div>

        {/* Craft Story Section */}
        <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark pb-3 border-b border-meow-border">
            2. Craftsmanship Section (&ldquo;EVERY STEP A STORY&rdquo;)
          </h2>

          <div>
            <label className="text-xs font-semibold text-meow-dark block mb-1">
              Craft Heading
            </label>
            <input
              type="text"
              value={content.craft_heading}
              onChange={(e) => setContent({ ...content, craft_heading: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border font-editorial text-sm font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-meow-dark block mb-1">
              Craft Description
            </label>
            <textarea
              rows={3}
              value={content.craft_body}
              onChange={(e) => setContent({ ...content, craft_body: e.target.value })}
              className="w-full text-xs p-3.5 rounded border border-meow-border"
            />
          </div>

          <ImageUploader
            label="Supporting Craftsmanship Editorial Photography"
            folder="meow/about"
            value={content.craft_image_url}
            aspectRatio="aspect-[4/3]"
            onChange={(url) => setContent({ ...content, craft_image_url: url })}
          />
        </div>

        {/* Vision & Mission */}
        <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark pb-3 border-b border-meow-border">
            3. Brand Vision & Mission
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                Vision Statement
              </label>
              <textarea
                rows={3}
                value={content.vision_text}
                onChange={(e) => setContent({ ...content, vision_text: e.target.value })}
                className="w-full text-xs p-3 rounded border border-meow-border"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                Mission Statement
              </label>
              <textarea
                rows={3}
                value={content.mission_text}
                onChange={(e) => setContent({ ...content, mission_text: e.target.value })}
                className="w-full text-xs p-3 rounded border border-meow-border"
              />
            </div>
          </div>
        </div>

        {/* Core Values Cards */}
        <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark pb-3 border-b border-meow-border">
            4. Core Values (4 Pillars)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.values.map((v, i) => (
              <div key={i} className="p-4 rounded-lg border border-meow-border bg-meow-surface space-y-2">
                <input
                  type="text"
                  value={v.title}
                  onChange={(e) => handleUpdateValue(i, 'title', e.target.value)}
                  className="w-full text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border border-meow-border bg-white"
                />
                <textarea
                  rows={2}
                  value={v.description}
                  onChange={(e) => handleUpdateValue(i, 'description', e.target.value)}
                  className="w-full text-xs p-2 rounded border border-meow-border bg-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end p-4 border border-meow-border rounded-xl bg-white shadow-sm">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 bg-meow-dark text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-meow-dark/85 shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save About Us Content'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
