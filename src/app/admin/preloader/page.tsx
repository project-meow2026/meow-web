'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Save, Check, Video, Play, Pause, Volume2, VolumeX, Eye, ArrowRight, Upload, Sparkles } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dbService, INITIAL_PRELOAD_VIDEO } from '@/lib/storage/db';
import { PreloadVideoSetting } from '@/lib/supabase/types';
import { PreloaderVideoModal } from '@/components/home/PreloaderVideoModal';

export default function AdminPreloaderPage() {
  const [setting, setSetting] = useState<PreloadVideoSetting>(INITIAL_PRELOAD_VIDEO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await dbService.getPreloadVideo();
        setSetting(data);
      } catch (err) {
        console.error('Failed to load preload video settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const saved = await dbService.savePreloadVideo(setting);
      setSetting(saved);
      setToastMsg('Preloading intro video settings saved successfully!');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      console.error('Failed to save preload video setting:', err);
      alert('Failed to save preload video setting.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'desktop');

      // Upload via video endpoint
      const res = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to upload video');
      }

      setSetting((prev) => ({
        ...prev,
        video_url: data.url,
      }));

      setToastMsg('Video uploaded successfully!');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err: any) {
      console.error('Video upload error:', err);
      alert(`Upload error: ${err.message || 'Failed to upload video'}`);
    } finally {
      setUploading(false);
    }
  };

  const togglePreviewPlay = () => {
    const v = videoPreviewRef.current;
    if (v) {
      if (v.paused) {
        v.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        v.pause();
        setIsPlaying(false);
      }
    }
  };

  const togglePreviewMute = () => {
    const v = videoPreviewRef.current;
    if (v) {
      v.muted = !v.muted;
      setIsMuted(v.muted);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminHeader
          title="Preloading Intro Video"
          description="Configure the luxury cinematic video that plays once when visitors first open the website."
        />
        <div className="p-12 text-center text-xs uppercase tracking-widest text-meow-muted">
          Loading preloader video settings...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Test Live Modal Overlay in Admin */}
      {previewOpen && (
        <PreloaderVideoModal
          setting={setting}
          forceShow={true}
          onFinish={() => setPreviewOpen(false)}
        />
      )}

      {/* Page Header */}
      <AdminHeader
        title="Preloading Intro Video"
        description="Configure the luxury cinematic video that plays once when visitors first open the website."
        actionButton={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-meow-border bg-white text-meow-dark text-xs uppercase tracking-wider font-semibold rounded hover:bg-meow-surface shadow-sm transition-all"
            >
              <Eye className="w-4 h-4 text-meow-dark" />
              <span>Test Intro as Visitor</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-meow-dark text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-meow-dark/85 shadow-sm transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        }
      />

      {toastMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg flex items-center gap-2 animate-fade-in-up">
          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Activation & Visibility */}
        <div className="bg-white border border-meow-border rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-6 border-b border-meow-border">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-meow-dark" />
                <span>Preloader Status</span>
              </h2>
              <p className="text-xs text-meow-muted mt-1">
                When enabled, the video will play once when a customer opens the store, stored in session storage.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={setting.is_enabled}
                onChange={(e) => setSetting({ ...setting, is_enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-meow-dark"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-meow-dark block">
                Auto-Close on Video End
              </span>
              <p className="text-xs text-meow-muted mt-0.5">
                Automatically transition to the homepage when the video finishes playing.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={setting.auto_close_on_end !== false}
                onChange={(e) => setSetting({ ...setting, auto_close_on_end: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-meow-dark"></div>
            </label>
          </div>
        </div>

        {/* Section 2: Video Asset & Live Preview */}
        <div className="bg-white border border-meow-border rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark flex items-center gap-2">
              <Video className="w-4 h-4 text-meow-dark" />
              <span>Intro Video File / URL</span>
            </h2>
            <p className="text-xs text-meow-muted mt-1">
              Upload an MP4/WebM video or paste a Cloudinary/CDN video link.
            </p>
          </div>

          {/* Video URL Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-meow-dark">
              Video Direct URL (MP4 / WebM)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={setting.video_url}
                onChange={(e) => setSetting({ ...setting, video_url: e.target.value })}
                placeholder="https://res.cloudinary.com/.../intro.mp4"
                className="flex-1 text-xs px-3.5 py-2.5 rounded border border-meow-border bg-white outline-none focus:border-meow-dark"
              />

              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-meow-surface border border-meow-border rounded text-xs font-semibold text-meow-dark hover:bg-white transition-colors disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : 'Upload Video'}</span>
              </button>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="pt-4 border-t border-meow-border">
            <span className="text-xs font-semibold uppercase tracking-wider text-meow-dark block mb-3">
              Live Video Preview
            </span>

            {setting.video_url ? (
              <div className="relative aspect-video max-w-2xl bg-black rounded-lg overflow-hidden border border-meow-border shadow-inner group">
                <video
                  ref={videoPreviewRef}
                  key={setting.video_url}
                  src={setting.video_url}
                  playsInline
                  loop
                  muted={isMuted}
                  className="w-full h-full object-cover"
                />

                {/* Floating Preview Controls */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between p-2 rounded bg-black/60 backdrop-blur-sm text-white text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePreviewPlay}
                      className="p-1 hover:text-white/80"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>

                    <button
                      type="button"
                      onClick={togglePreviewMute}
                      className="p-1 hover:text-white/80"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  <span className="text-[10px] uppercase tracking-wider text-white/70">
                    {setting.is_enabled ? 'Active on first visit' : 'Disabled'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-meow-surface border border-dashed border-meow-border rounded-lg text-xs text-meow-muted">
                No video configured yet. Upload a video file or enter a video URL above.
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Overlay Copy & Text Customization */}
        <div className="bg-white border border-meow-border rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-meow-dark" />
              <span>Intro Text & Labels</span>
            </h2>
            <p className="text-xs text-meow-muted mt-1">
              Customize the editorial badge, headline, and button text displayed over the preloading video.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-meow-dark">
                Top Badge Text
              </label>
              <input
                type="text"
                value={setting.badge || ''}
                onChange={(e) => setSetting({ ...setting, badge: e.target.value })}
                placeholder="MEOW FOOTWEAR"
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border bg-white outline-none focus:border-meow-dark"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-meow-dark">
                Skip Button Label
              </label>
              <input
                type="text"
                value={setting.skip_button_text || ''}
                onChange={(e) => setSetting({ ...setting, skip_button_text: e.target.value })}
                placeholder="Skip Intro"
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border bg-white outline-none focus:border-meow-dark"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-meow-dark">
                Main Headline
              </label>
              <input
                type="text"
                value={setting.title || ''}
                onChange={(e) => setSetting({ ...setting, title: e.target.value })}
                placeholder="THE ART OF DRESSING WELL"
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border bg-white outline-none focus:border-meow-dark font-editorial text-sm font-medium"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-meow-dark">
                Subtitle / Philosophy Note
              </label>
              <input
                type="text"
                value={setting.subtitle || ''}
                onChange={(e) => setSetting({ ...setting, subtitle: e.target.value })}
                placeholder="Quiet confidence. Timeless comfort."
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border bg-white outline-none focus:border-meow-dark"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Button Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 border border-meow-border bg-white text-meow-dark text-xs uppercase tracking-wider font-semibold rounded hover:bg-meow-surface shadow-sm transition-all"
          >
            <Eye className="w-4 h-4 text-meow-dark" />
            <span>Test Intro as Visitor</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-meow-dark text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-meow-dark/85 shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
