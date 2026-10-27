'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PreloadVideoSetting } from '@/lib/supabase/types';
import { INITIAL_PRELOAD_VIDEO } from '@/lib/storage/db';

interface PreloaderVideoModalProps {
  setting?: PreloadVideoSetting | null;
  forceShow?: boolean;
  onFinish?: () => void;
}

// In-memory session tracking: ensures video shows first on initial website link open / page refresh,
// but does not interrupt the user when using client-side Link navigation (e.g. /shop -> /).
let hasShownInCurrentSpaSession = false;

export const PreloaderVideoModal: React.FC<PreloaderVideoModalProps> = ({
  setting,
  forceShow = false,
  onFinish,
}) => {
  const isExplicitlyDisabled = setting?.is_enabled === false && !forceShow;

  // Immediately render on initial open so the preloader video shows FIRST without any flash of the homepage
  const [shouldRender, setShouldRender] = useState(() => {
    if (forceShow) return true;
    if (isExplicitlyDisabled) return false;
    return !hasShownInCurrentSpaSession;
  });

  const [fadeOut, setFadeOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videoUrl = setting?.video_url || INITIAL_PRELOAD_VIDEO.video_url;

  useEffect(() => {
    if (forceShow) {
      setShouldRender(true);
      setFadeOut(false);
      return;
    }

    if (setting?.is_enabled === false) {
      setShouldRender(false);
      onFinish?.();
      return;
    }
  }, [setting, forceShow, onFinish]);

  // Autoplay video as soon as mounted
  useEffect(() => {
    if (!shouldRender || fadeOut) return;

    hasShownInCurrentSpaSession = true;

    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      const playPromise = v.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if browser policy delays autoplay
          const handleFirstTouch = () => {
            v.play().catch(() => {});
            window.removeEventListener('click', handleFirstTouch);
            window.removeEventListener('touchstart', handleFirstTouch);
          };
          window.addEventListener('click', handleFirstTouch, { once: true });
          window.addEventListener('touchstart', handleFirstTouch, { once: true });
        });
      }
    }

    // Safety fallback: auto-transition after 8 seconds in case video hangs or network stalls
    const safetyTimeout = setTimeout(() => {
      handleComplete();
    }, 8000);

    return () => clearTimeout(safetyTimeout);
  }, [shouldRender, fadeOut]);

  const handleComplete = () => {
    hasShownInCurrentSpaSession = true;
    setFadeOut(true);
    setTimeout(() => {
      setShouldRender(false);
      onFinish?.();
    }, 900);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden transition-opacity duration-1000 select-none cursor-pointer ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      onClick={handleComplete}
      aria-hidden="true"
    >
      {/* Pure Fullscreen Video without any texts, skip, or buttons */}
      <video
        ref={videoRef}
        key={videoUrl}
        src={videoUrl}
        autoPlay
        muted
        playsInline
        controls={false}
        preload="auto"
        onEnded={handleComplete}
        className="w-full h-full object-cover object-center pointer-events-none"
      />
    </div>
  );
};
