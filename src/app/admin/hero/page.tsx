'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Save, Check, Video, Play, Pause, RefreshCw, Upload, Eye, Trash2, ArrowUpRight } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { dbService, INITIAL_HERO_BANNER } from '@/lib/storage/db';
import { HeroBanner } from '@/lib/supabase/types';
import { uploadMediaToCloudinary, deleteMediaFromCloudinary } from '@/lib/cloudinary/upload';

export default function AdminHeroPage() {
  const [hero, setHero] = useState<HeroBanner>(INITIAL_HERO_BANNER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDraggingDesktop, setIsDraggingDesktop] = useState(false);
  const [isDraggingMobile, setIsDraggingMobile] = useState(false);

  const desktopFileInputRef = useRef<HTMLInputElement | null>(null);
  const mobileFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function loadHero() {
      try {
        const data = await dbService.getHeroBanner();
        setHero(data);
      } catch (e) {
        console.error('Failed to load hero banner:', e);
      } finally {
        setLoading(false);
      }
    }
    loadHero();
  }, []);

  const uploadVideoFile = async (file: File, type: 'desktop' | 'mobile') => {
    if (!file) return;

    if (type === 'desktop') setUploadingDesktop(true);
    else setUploadingMobile(true);
    setUploadProgress(15);

    try {
      // Direct client-side secure upload to Cloudinary CDN
      const folder = type === 'desktop' ? 'meow/hero/desktop' : 'meow/hero/mobile';
      const cRes = await uploadMediaToCloudinary(file, folder, (percent) => {
        setUploadProgress(percent);
      });

      if (!cRes?.url) {
        throw new Error('Failed to upload video to Cloudinary');
      }

      const videoUrl = cRes.url;

      const updated: HeroBanner = {
        ...hero,
        [type === 'desktop' ? 'desktop_video_url' : 'mobile_video_url']: videoUrl,
      };
      setHero(updated);

      // Ensure local state and Supabase are in sync
      await dbService.saveHeroBanner(updated);

      setToastMsg(`Video uploaded to Cloudinary successfully! Now streaming on homepage.`);
      setTimeout(() => setToastMsg(''), 5000);
    } catch (err: any) {
      alert(`Video upload error: ${err.message || 'Error uploading video'}`);
    } finally {
      setUploadingDesktop(false);
      setUploadingMobile(false);
      setUploadProgress(0);
      if (type === 'desktop' && desktopFileInputRef.current) desktopFileInputRef.current.value = '';
      if (type === 'mobile' && mobileFileInputRef.current) mobileFileInputRef.current.value = '';
    }
  };

  const handleApplyVideoUrl = async (type: 'desktop' | 'mobile', url: string) => {
    if (!url.trim()) return;
    setSaving(true);
    try {
      const updated: HeroBanner = {
        ...hero,
        [type === 'desktop' ? 'desktop_video_url' : 'mobile_video_url']: url.trim(),
      };
      setHero(updated);
      const saved = await dbService.saveHeroBanner(updated);
      setHero(saved);
      setToastMsg(`${type === 'desktop' ? 'Desktop' : 'Mobile'} video URL applied and saved to database!`);
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveVideo = async (type: 'desktop' | 'mobile') => {
    const videoUrl = type === 'desktop' ? hero.desktop_video_url : hero.mobile_video_url;
    if (!videoUrl) return;

    const confirmed = window.confirm(
      `Are you sure you want to remove this ${type} video? It will be deleted from Cloudinary storage and the database.`
    );
    if (!confirmed) return;

    setSaving(true);
    try {
      if (videoUrl.includes('cloudinary.com')) {
        await deleteMediaFromCloudinary(videoUrl, 'video');
      }

      const updated: HeroBanner = {
        ...hero,
        [type === 'desktop' ? 'desktop_video_url' : 'mobile_video_url']: null,
      };
      setHero(updated);

      const saved = await dbService.saveHeroBanner(updated);
      setHero(saved);

      setToastMsg(`${type === 'desktop' ? 'Desktop' : 'Mobile'} video removed from database and Cloudinary.`);
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      alert(`Error removing video: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dbService.saveHeroBanner(hero);
      setToastMsg('Hero banner settings saved to Supabase & storefront successfully.');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Hero Banner & 3D Footwear Video"
        description="Manage the exploded-layer 3D footwear video assets for desktop and mobile, poster stills, typography, and CTA buttons."
        actionButton={
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-meow-border rounded text-xs font-semibold text-meow-dark hover:bg-meow-surface"
          >
            <span>View Homepage</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        }
      />

      {/* Preloading Intro Video Notice Banner */}
      <div className="mb-6 p-4 bg-[#F7F6F2] border border-meow-border rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-white border border-meow-border text-meow-dark flex-shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-meow-dark">
              Preloading Intro Video Section
            </h4>
            <p className="text-xs text-meow-muted mt-0.5">
              Looking to configure the full-screen video that plays once when visitors first open the site?
            </p>
          </div>
        </div>
        <Link
          href="/admin/preloader"
          className="flex-shrink-0 px-4 py-2 bg-meow-dark text-white rounded text-xs uppercase tracking-wider font-semibold hover:bg-meow-dark/85 transition-colors"
        >
          Manage Preload Video
        </Link>
      </div>

      {toastMsg && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded flex items-center gap-2 animate-fade-in-up">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Editorial Text & Links Card */}
        <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark pb-3 border-b border-meow-border">
            1. Editorial Headline &amp; Call-To-Action
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                Badge / Season Tag
              </label>
              <input
                type="text"
                value={hero.badge}
                onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                placeholder="e.g. SPRING / SUMMER"
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border uppercase tracking-widest"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                Main Headline
              </label>
              <input
                type="text"
                value={hero.heading}
                onChange={(e) => setHero({ ...hero, heading: e.target.value })}
                placeholder="e.g. THE ART OF DRESSING WELL"
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border uppercase tracking-wide font-editorial"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-meow-dark block mb-1">
              Subtitle / Supporting Philosophy
            </label>
            <input
              type="text"
              value={hero.subtitle}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
              placeholder="e.g. Quiet confidence. Timeless comfort."
              className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={hero.cta_text}
                onChange={(e) => setHero({ ...hero, cta_text: e.target.value })}
                placeholder="e.g. DISCOVER THE COLLECTION"
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                CTA Destination URL
              </label>
              <input
                type="text"
                value={hero.cta_link}
                onChange={(e) => setHero({ ...hero, cta_link: e.target.value })}
                placeholder="/shop"
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-meow-dark cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hero.is_published}
                onChange={(e) => setHero({ ...hero, is_published: e.target.checked })}
                className="rounded accent-meow-dark w-4 h-4"
              />
              <span>Publish Hero Section on Storefront</span>
            </label>
          </div>
        </div>

        {/* 3D Exploded Footwear Video Assets Card */}
        <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark pb-3 border-b border-meow-border flex items-center gap-2">
            <Video className="w-4 h-4 text-meow-dark" />
            <span>2. 3D Footwear Video Assets (Cloudinary)</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Desktop Hero Video */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-meow-dark block">
                Desktop Hero Video Asset
              </label>

              {hero.desktop_video_url ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-meow-border bg-black group shadow-sm">
                  <video
                    src={hero.desktop_video_url}
                    controls
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleRemoveVideo('desktop')}
                    className="absolute top-2 right-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow flex items-center gap-1 disabled:opacity-50 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Video</span>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => desktopFileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingDesktop(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingDesktop(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingDesktop(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) uploadVideoFile(file, 'desktop');
                  }}
                  className={`border-2 border-dashed ${
                    isDraggingDesktop
                      ? 'border-meow-dark bg-[#F4F1EA] scale-[1.01]'
                      : 'border-meow-border hover:border-meow-dark bg-meow-surface hover:bg-white'
                  } rounded-lg aspect-video flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all`}
                >
                  {uploadingDesktop ? (
                    <div className="space-y-2 flex flex-col items-center">
                      <RefreshCw className="w-6 h-6 animate-spin text-meow-dark" />
                      <span className="text-xs font-medium">Uploading directly to Cloudinary ({uploadProgress}%)</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Video className="w-8 h-8 text-meow-subtle mx-auto stroke-[1.2]" />
                      <p className="text-xs font-medium text-meow-dark">
                        Drag &amp; drop video here, or <span className="underline font-semibold">browse</span>
                      </p>
                      <p className="text-[10px] text-meow-subtle">
                        MP4, WebM, MOV up to 150MB
                      </p>
                    </div>
                  )}
                </div>
              )}

              <input
                ref={desktopFileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/m4v"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadVideoFile(file, 'desktop');
                }}
                className="hidden"
              />

              <div className="flex gap-2">
                <input
                  type="url"
                  value={hero.desktop_video_url || ''}
                  onChange={(e) => setHero({ ...hero, desktop_video_url: e.target.value })}
                  placeholder="Or paste direct video URL (e.g. Cloudinary, MP4)..."
                  className="flex-1 text-xs px-3 py-2 rounded border border-meow-border font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleApplyVideoUrl('desktop', hero.desktop_video_url || '')}
                  className="px-3.5 py-2 bg-meow-dark text-white text-xs font-semibold rounded hover:bg-meow-dark/85 shrink-0"
                >
                  Apply &amp; Save
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-meow-subtle">Authentic 3D Footwear Film:</span>
                <button
                  type="button"
                  onClick={() => handleApplyVideoUrl('desktop', 'https://res.cloudinary.com/k7t4skr1/video/upload/v1793007834/meow/hero/desktop/qlqsgtcvyihqq2bsnu0s.mp4')}
                  className="text-meow-terracotta hover:underline font-semibold"
                >
                  Restore Original Hero Video
                </button>
              </div>
            </div>

            {/* Mobile Hero Video & Poster */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-meow-dark block">
                  Mobile Hero Video Asset (Optional)
                </label>

                {hero.mobile_video_url ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-meow-border bg-black group shadow-sm">
                    <video
                      src={hero.mobile_video_url}
                      controls
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleRemoveVideo('mobile')}
                      className="absolute top-2 right-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow flex items-center gap-1 disabled:opacity-50 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Video</span>
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => mobileFileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDraggingMobile(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDraggingMobile(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDraggingMobile(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) uploadVideoFile(file, 'mobile');
                    }}
                    className={`border-2 border-dashed ${
                      isDraggingMobile
                        ? 'border-meow-dark bg-[#F4F1EA] scale-[1.01]'
                        : 'border-meow-border hover:border-meow-dark bg-meow-surface hover:bg-white'
                    } rounded-lg aspect-video flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all`}
                  >
                    {uploadingMobile ? (
                      <div className="space-y-2 flex flex-col items-center">
                        <RefreshCw className="w-6 h-6 animate-spin text-meow-dark" />
                        <span className="text-xs font-medium">Uploading directly to Cloudinary ({uploadProgress}%)</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Video className="w-8 h-8 text-meow-subtle mx-auto stroke-[1.2]" />
                        <p className="text-xs font-medium text-meow-dark">
                          Drag &amp; drop mobile video here, or <span className="underline font-semibold">browse</span>
                        </p>
                        <p className="text-[10px] text-meow-subtle">
                          MP4, WebM, MOV up to 150MB
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <input
                  ref={mobileFileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/m4v"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadVideoFile(file, 'mobile');
                  }}
                  className="hidden"
                />

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={hero.mobile_video_url || ''}
                    onChange={(e) => setHero({ ...hero, mobile_video_url: e.target.value })}
                    placeholder="Paste Mobile video URL..."
                    className="flex-1 text-xs px-3 py-2 rounded border border-meow-border font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyVideoUrl('mobile', hero.mobile_video_url || '')}
                    className="px-3.5 py-2 bg-meow-dark text-white text-xs font-semibold rounded hover:bg-meow-dark/85 shrink-0"
                  >
                    Apply &amp; Save
                  </button>
                </div>
              </div>

              <div>
                <ImageUploader
                  label="Hero Poster Still (Optional)"
                  folder="meow/hero/desktop"
                  value={hero.poster_image_url || ''}
                  aspectRatio="aspect-video"
                  onChange={async (url) => {
                    const updated = { ...hero, poster_image_url: url };
                    setHero(updated);
                    await dbService.saveHeroBanner(updated);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 p-4 border border-meow-border rounded-xl bg-white shadow-sm">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 bg-meow-dark text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-meow-dark/85 shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
