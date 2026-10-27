'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PreloadVideoSetting } from '@/lib/supabase/types';
import { INITIAL_PRELOAD_VIDEO } from '@/lib/storage/db';

interface PreloaderVideoModalProps {
  setting?: PreloadVideoSetting | null;
  forceShow?: boolean;
  onFinish?: () => void;
}

// Module-level flag so navigating between pages inside the site (e.g. /shop -> /) does not replay
let hasShownInCurrentSpaSession = false;

export const PreloaderVideoModal: React.FC<PreloaderVideoModalProps> = ({
  setting,
  forceShow = false,
  onFinish,
}) => {
  const isExplicitlyDisabled = setting?.is_enabled === false && !forceShow;

  const [shouldRender, setShouldRender] = useState(() => {
    if (forceShow) return true;
    if (isExplicitlyDisabled) return false;
    return !hasShownInCurrentSpaSession;
  });

  const [fadeOut, setFadeOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isDismissedRef = useRef(false);

  const videoUrl = setting?.video_url || INITIAL_PRELOAD_VIDEO.video_url;

  // Dismiss preloader cleanly and reveal the website
  const dismiss = useCallback(() => {
    if (isDismissedRef.current) return;
    isDismissedRef.current = true;
    hasShownInCurrentSpaSession = true;

    // Start smooth fade-out to reveal the website underneath
    setFadeOut(true);

    // Completely unmount the preloader overlay after transition
    setTimeout(() => {
      setShouldRender(false);
      onFinish?.();
    }, 450);
  }, [onFinish]);

  // Handle external setting updates or forceShow
  useEffect(() => {
    if (forceShow) {
      isDismissedRef.current = false;
      setShouldRender(true);
      setFadeOut(false);
      return;
    }

    if (setting?.is_enabled === false) {
      dismiss();
    }
  }, [setting, forceShow, dismiss]);

  // Autoplay video on mount + absolute fallback timer (max 4.5 seconds)
  useEffect(() => {
    if (!shouldRender || fadeOut) return;

    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.play().catch(() => {
        // Autoplay policy fallback: dismiss on first user interaction
        const handleInteraction = () => dismiss();
        window.addEventListener('click', handleInteraction, { once: true });
        window.addEventListener('touchstart', handleInteraction, { once: true });
      });
    }

    // Absolute fallback: NEVER hold visitor for more than 4.5 seconds
    const maxTimer = setTimeout(() => {
      dismiss();
    }, 4500);

    return () => clearTimeout(maxTimer);
  }, [shouldRender, fadeOut, dismiss]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden transition-opacity duration-500 ease-out select-none cursor-pointer ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      onClick={dismiss}
      onTouchStart={dismiss}
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
        onEnded={dismiss}
        onError={dismiss}
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (d && isFinite(d) && d > 0) {
            // Dismiss slightly before end to avoid showing any black freeze-frame
            const dismissMs = Math.max(1000, Math.min(4500, (d - 0.25) * 1000));
            setTimeout(() => {
              dismiss();
            }, dismissMs);
          }
        }}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (v.duration && v.currentTime >= v.duration - 0.3) {
            dismiss();
          }
        }}
        className="w-full h-full object-cover object-center pointer-events-none"
      />
    </div>
  );
};
