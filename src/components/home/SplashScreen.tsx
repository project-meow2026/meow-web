'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  forceShow?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, forceShow = false }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'sketching' | 'revealing' | 'done'>('sketching');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if user already saw splash screen in this session
    if (!forceShow) {
      const seen = sessionStorage.getItem('meow_splash_seen');
      if (seen === 'true') {
        onComplete();
        return;
      }
    }

    // Progress counter simulation paired with SVG drawing stroke
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase('revealing');
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
              sessionStorage.setItem('meow_splash_seen', 'true');
              setPhase('done');
              onComplete();
            }, 600);
          }, 1200);
          return 100;
        }
        return prev + 2;
      });
    }, 45);

    // Fallback safety timeout (maximum 5 seconds)
    const timeout = setTimeout(() => {
      sessionStorage.setItem('meow_splash_seen', 'true');
      setFadeOut(true);
      setTimeout(onComplete, 400);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete, forceShow]);

  const handleSkip = () => {
    sessionStorage.setItem('meow_splash_seen', 'true');
    setFadeOut(true);
    setTimeout(onComplete, 300);
  };

  if (phase === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#FAF9F5] flex flex-col justify-between items-center p-6 sm:p-10 transition-opacity duration-700 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage: 'radial-gradient(#E8E4DC 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Top Bar: Brand Logo & Skip Button */}
      <div className="w-full max-w-5xl flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="MEOW"
            width={130}
            height={40}
            className="h-8 sm:h-9 w-auto object-contain"
            priority
          />
        </div>

        <button
          onClick={handleSkip}
          className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-meow-muted hover:text-meow-dark transition-colors px-3 py-1.5 rounded-full border border-meow-border bg-white/70 backdrop-blur-sm"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Stage: Progressive Pencil Sketch into Finished Footwear Visual */}
      <div className="relative w-full max-w-lg aspect-square sm:aspect-[4/3] flex items-center justify-center">
        {/* Stage 1: Hand-drawn Pencil Sketch with Progressive Stroke Drawing */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
            phase === 'revealing' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <svg
            viewBox="0 0 600 400"
            className="w-full h-full max-w-md drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="pencil-filter" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>

            {/* Paper Texture Soft Ground Shadow */}
            <ellipse cx="300" cy="330" rx="190" ry="24" fill="#3A3835" fillOpacity="0.08" />

            {/* Drawing lines with stroke-dashoffset tied to progress */}
            <g
              filter="url(#pencil-filter)"
              stroke="#2B2824"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Sole Profile Contour */}
              <path
                d="M 120 280 C 130 310, 200 320, 310 320 C 440 320, 480 300, 490 270 C 495 245, 460 235, 420 235 C 340 230, 290 260, 210 260 C 150 260, 125 250, 120 280 Z"
                strokeWidth="3.5"
                fill="#F7F5EE"
                strokeDasharray="1400"
                strokeDashoffset={1400 - (1400 * Math.min(progress * 1.3, 100)) / 100}
                className="transition-all duration-100"
              />

              {/* Cork Midsole Texture Hatching */}
              <path
                d="M 150 295 Q 310 315 465 290"
                strokeWidth="2"
                strokeDasharray="800"
                strokeDashoffset={800 - (800 * Math.min(Math.max((progress - 20) * 1.5, 0), 100)) / 100}
              />
              <path
                d="M 160 302 L 165 295 M 210 308 L 215 300 M 270 312 L 275 304 M 330 312 L 335 304 M 390 308 L 395 300 M 440 298 L 445 290"
                strokeWidth="1.5"
                strokeOpacity={progress > 40 ? 0.7 : 0}
              />

              {/* Front Buckle Strap */}
              <path
                d="M 360 235 C 365 190, 400 178, 440 190 C 460 200, 465 220, 460 240"
                strokeWidth="3.2"
                fill="#EDE8DC"
                strokeDasharray="400"
                strokeDashoffset={400 - (400 * Math.min(Math.max((progress - 35) * 1.8, 0), 100)) / 100}
              />
              {/* Buckle 1 */}
              <rect
                x="398"
                y="180"
                width="16"
                height="22"
                rx="4"
                strokeWidth="2.5"
                fill="#FFF"
                strokeOpacity={progress > 55 ? 1 : 0}
              />

              {/* Rear Instep Buckle Strap */}
              <path
                d="M 220 250 C 215 170, 255 140, 320 140 C 355 145, 370 175, 365 230"
                strokeWidth="3.5"
                fill="#EDE8DC"
                strokeDasharray="500"
                strokeDashoffset={500 - (500 * Math.min(Math.max((progress - 50) * 2, 0), 100)) / 100}
              />
              {/* Buckle 2 */}
              <rect
                x="280"
                y="136"
                width="18"
                height="24"
                rx="4"
                strokeWidth="2.5"
                fill="#FFF"
                strokeOpacity={progress > 70 ? 1 : 0}
              />

              {/* Fine Crosshatch Shading on Straps */}
              <path
                d="M 250 175 L 265 240 M 275 160 L 290 238 M 305 165 L 318 238 M 335 180 L 345 235"
                strokeWidth="1"
                strokeOpacity={progress > 80 ? 0.45 : 0}
              />
            </g>

            {/* Simulated Animated Graphite Pencil Tip */}
            {progress < 98 && (
              <g
                transform={`translate(${140 + (progress / 100) * 320}, ${
                  220 + Math.sin(progress * 0.2) * 45
                }) rotate(-35)`}
                className="transition-transform duration-75"
              >
                {/* Pencil Wood body */}
                <polygon points="0,0 12,-40 22,-40 10,0" fill="#D4A373" />
                <polygon points="12,-40 22,-40 24,-120 14,-120" fill="#E29578" />
                <polygon points="0,0 5,-15 10,0" fill="#F4A261" />
                {/* Graphite core tip */}
                <polygon points="0,0 3,-8 7,0" fill="#2B2824" />
              </g>
            )}
          </svg>
        </div>

        {/* Stage 2: Finished High-Resolution Footwear Visual Reveal */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
            phase === 'revealing' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-meow-border bg-white">
            <img
              src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=85"
              alt="MEOW Anatomical Footwear Finished Visual"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs uppercase tracking-widest font-medium drop-shadow">
                Handcrafted Anatomical Comfort
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Brand Tagline, Progress Bar, & Caption */}
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-4">
        {/* Tagline */}
        <p className="font-editorial text-lg sm:text-xl text-meow-dark tracking-wide italic">
          &ldquo;Quiet confidence. Timeless comfort.&rdquo;
        </p>

        {/* Progress Bar & Percentage */}
        <div className="w-full space-y-1.5">
          <div className="w-full h-1 bg-meow-border rounded-full overflow-hidden">
            <div
              className="h-full bg-meow-dark transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-meow-subtle font-mono tracking-wider">
            <span>{phase === 'sketching' ? 'DRAWING SKETCH...' : 'FINISHED PIECE'}</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Caption */}
        <p className="text-[11px] uppercase tracking-[0.2em] text-meow-muted">
          Pencil-Crafted Minimal Footwear
        </p>
      </div>
    </div>
  );
};
