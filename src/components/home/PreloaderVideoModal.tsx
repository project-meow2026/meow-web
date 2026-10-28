'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PreloadVideoSetting } from '@/lib/supabase/types';

interface PreloaderVideoModalProps {
  setting?: PreloadVideoSetting | null;
  forceShow?: boolean;
  onFinish?: () => void;
}

export const PreloaderVideoModal: React.FC<PreloaderVideoModalProps> = ({
  setting,
  forceShow = false,
  onFinish,
}) => {
  // Synchronous resolution of video URL from props or localStorage to eliminate any delay
  const rawPropUrl = setting?.video_url?.trim() || '';
  const [cachedUrl] = useState(() => {
    if (rawPropUrl) return rawPropUrl;
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('meow_db_preload_video_v2');
        return raw ? JSON.parse(raw)?.video_url?.trim() || '' : '';
      } catch (_) {}
    }
    return '';
  });

  const effectiveVideoUrl = rawPropUrl || cachedUrl;
  const isEnabled = setting?.is_enabled !== false;

  const [fadeOut, setFadeOut] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isDismissedRef = useRef(false);

  // Smooth transition to website
  const dismiss = useCallback(() => {
    if (isDismissedRef.current) return;
    isDismissedRef.current = true;

    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('meow_preloader_seen', 'true');
        document.documentElement.classList.remove('meow-preloading');
      }
    } catch (_) {}

    // Elegant fade out transition to seamlessly reveal the website
    setFadeOut(true);

    setTimeout(() => {
      setIsDismissed(true);
      onFinish?.();
    }, 800);
  }, [onFinish]);

  // Handle client mount and playback
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (forceShow) {
      isDismissedRef.current = false;
      setFadeOut(false);
      setIsDismissed(false);
      document.documentElement.classList.add('meow-preloading');
      const v = videoRef.current;
      if (v) {
        v.currentTime = 0;
        v.play().catch(() => {});
      }
      return;
    }

    // Check if the head script determined we should show the preloader
    const isPreloadActive = document.documentElement.classList.contains('meow-preloading');
    if (!isPreloadActive || !isEnabled || !effectiveVideoUrl) {
      isDismissedRef.current = true;
      setIsDismissed(true);
      document.documentElement.classList.remove('meow-preloading');
      return;
    }

    // If preloading is active, play video
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      const p = v.play();
      if (p !== undefined) {
        p.catch(() => {
          // If browser policy blocks autoplay without interaction
          const handleFirstClick = () => {
            v.play().catch(() => dismiss());
          };
          window.addEventListener('click', handleFirstClick, { once: true });
          window.addEventListener('touchstart', handleFirstClick, { once: true });
        });
      }
    }

    const safetyTimer = setTimeout(() => {
      dismiss();
    }, 15000);

    return () => clearTimeout(safetyTimer);
  }, [forceShow, isEnabled, effectiveVideoUrl, dismiss]);

  if (isDismissed && !forceShow) return null;
  if (!effectiveVideoUrl) return null;

  return (
    <div
      id="meow-preloader-root"
      className={`fixed inset-0 z-[999999] bg-[#FEFEFE] flex items-center justify-center overflow-hidden transition-opacity duration-800 ease-in-out select-none ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#FEFEFE' }}
      aria-hidden="true"
    >
      {/* Video frame wrapper: crops 1-2px edge macroblocks/lines from encoder or subpixel rendering */}
      <div
        className="relative flex items-center justify-center overflow-hidden max-w-full max-h-screen bg-[#FEFEFE] scale-[1.45] sm:scale-100 transition-transform duration-500"
        style={{ backgroundColor: '#FEFEFE' }}
      >
        <video
          ref={videoRef}
          key={effectiveVideoUrl}
          src={effectiveVideoUrl}
          autoPlay
          muted
          playsInline
          controls={false}
          preload="auto"
          onEnded={dismiss}
          onError={dismiss}
          className="block max-w-full max-h-screen w-auto h-auto object-cover pointer-events-none bg-[#FEFEFE] scale-[1.05] origin-center"
          style={{
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            backgroundColor: '#FEFEFE',
          }}
        />
      </div>
    </div>
  );
};
