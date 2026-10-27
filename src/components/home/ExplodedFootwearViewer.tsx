'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Layers, RefreshCw, Eye, Sparkles, Film } from 'lucide-react';

interface ExplodedFootwearViewerProps {
  desktopVideoUrl?: string | null;
  mobileVideoUrl?: string | null;
  posterImageUrl?: string | null;
  autoPlayVideo?: boolean;
}

export const ExplodedFootwearViewer: React.FC<ExplodedFootwearViewerProps> = ({
  desktopVideoUrl,
  mobileVideoUrl,
  posterImageUrl,
  autoPlayVideo = true,
}) => {
  const [viewMode, setViewMode] = useState<'3d-exploded' | 'video'>('3d-exploded');
  const [explosionProgress, setExplosionProgress] = useState(0); // 0 (assembled) to 100 (fully exploded)
  const [isAutoExploding, setIsAutoExploding] = useState(true);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Layers data for exploded view
  const layers = [
    {
      id: 1,
      name: 'Layer 01 — Upper Straps & Buckles',
      description: 'Hand-finished water-resistant Vegan Nubuck with custom engraved anti-corrosion buckles.',
      yOffset: -120, // offset in px when 100% exploded
      color: '#A2704E',
      badge: 'Ergonomic Hold',
    },
    {
      id: 2,
      name: 'Layer 02 — Microfiber Footbed Lining',
      description: 'Ultra-soft, moisture-wicking breathable lining that prevents skin chafing.',
      yOffset: -60,
      color: '#D8C7B5',
      badge: 'Skin Comfort',
    },
    {
      id: 3,
      name: 'Layer 03 — Anatomical Cork-Latex Core',
      description: 'Natural sustainable cork contours designed to match the natural arch and heel bone.',
      yOffset: 0,
      color: '#C6A987',
      badge: 'Orthopedic Core',
    },
    {
      id: 4,
      name: 'Layer 04 — High-Rebound Shock Absorber',
      description: 'Dual-density impact dampening layer reducing joint fatigue during prolonged walking.',
      yOffset: 60,
      color: '#E8E5DF',
      badge: 'Impact Absorption',
    },
    {
      id: 5,
      name: 'Layer 05 — Anti-Skid Traction Outsole',
      description: 'Lightweight EVA outsole with engineered flex grooves for secure wet-and-dry grip.',
      yOffset: 120,
      color: '#2A2927',
      badge: 'Multi-Surface Grip',
    },
  ];

  // Subtle automatic cinematic explosion & re-assembly loop
  useEffect(() => {
    if (!isAutoExploding || viewMode !== '3d-exploded') return;

    let forward = true;
    const interval = setInterval(() => {
      setExplosionProgress((prev) => {
        if (forward) {
          if (prev >= 100) {
            forward = false;
            return 100;
          }
          return prev + 1.2;
        } else {
          if (prev <= 0) {
            forward = true;
            return 0;
          }
          return prev - 1.2;
        }
      });
    }, 45);

    return () => clearInterval(interval);
  }, [isAutoExploding, viewMode]);



  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[21/11] bg-gradient-to-b from-[#F9F8F6] to-[#ECE8E1] rounded-2xl overflow-hidden border border-meow-border flex items-center justify-center select-none shadow-sm">
      {/* Background Organic Sand Dune Ambient Aesthetics */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.8),transparent_70%)]" />

      {/* TOP CONTROLS: Mode Switcher & Auto-Explode Toggle */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-white/80 backdrop-blur-md rounded-full border border-meow-border shadow-sm">
          <button
            onClick={() => setViewMode('3d-exploded')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              viewMode === '3d-exploded'
                ? 'bg-meow-dark text-white shadow-sm'
                : 'text-meow-muted hover:text-meow-dark'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Exploded 3D Anatomy</span>
            </span>
          </button>

          {desktopVideoUrl && (
            <button
              onClick={() => setViewMode('video')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                viewMode === 'video'
                  ? 'bg-meow-dark text-white shadow-sm'
                  : 'text-meow-muted hover:text-meow-dark'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" />
                <span>3D Film</span>
              </span>
            </button>
          )}
        </div>

        {viewMode === '3d-exploded' && (
          <button
            onClick={() => setIsAutoExploding(!isAutoExploding)}
            className="px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-full border border-meow-border text-xs text-meow-dark hover:bg-white transition-all flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAutoExploding ? 'animate-spin' : ''}`} />
            <span>{isAutoExploding ? 'Motion Active' : 'Manual Control'}</span>
          </button>
        )}
      </div>

      {/* MODE 1: INTERACTIVE 3D EXPLODED VIEW */}
      {viewMode === '3d-exploded' && (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Central Layer Assembly Stage */}
          <div className="relative w-72 sm:w-96 md:w-[480px] h-64 sm:h-80 flex items-center justify-center">
            {/* Ground shadow reacting to explosion progress */}
            <div
              className="absolute bottom-6 w-3/4 h-8 bg-black/15 rounded-full blur-md transition-all duration-300"
              style={{
                transform: `scale(${1 - (explosionProgress / 100) * 0.25})`,
                opacity: 0.6 - (explosionProgress / 100) * 0.2,
              }}
            />

            {/* Render 5 Individual 3D Exploded Layers */}
            {layers.map((layer, index) => {
              const currentOffset = (layer.yOffset * (explosionProgress / 100));
              const isHovered = activeLayer === layer.id;

              return (
                <div
                  key={layer.id}
                  onMouseEnter={() => {
                    setActiveLayer(layer.id);
                    setIsAutoExploding(false);
                  }}
                  onMouseLeave={() => setActiveLayer(null)}
                  className="absolute cursor-pointer transition-transform duration-300 ease-out flex items-center justify-center group"
                  style={{
                    transform: `translateY(${currentOffset}px) scale(${isHovered ? 1.05 : 1})`,
                    zIndex: 10 + index,
                  }}
                >
                  {/* Visual Footwear Component Vector Render */}
                  <svg
                    viewBox="0 0 420 180"
                    className="w-64 sm:w-80 md:w-96 h-auto drop-shadow-md transition-all"
                  >
                    {/* Layer 1: Straps and Buckles */}
                    {layer.id === 1 && (
                      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                        {/* Rear strap */}
                        <path
                          d="M 120 100 C 130 50, 190 30, 260 30 C 295 30, 310 60, 305 100"
                          stroke={layer.color}
                          strokeWidth="24"
                        />
                        {/* Front strap */}
                        <path
                          d="M 280 100 C 290 60, 330 50, 370 60 C 390 70, 395 85, 390 100"
                          stroke={layer.color}
                          strokeWidth="22"
                        />
                        {/* Antique Brass Buckles */}
                        <rect x="230" y="24" width="22" height="28" rx="4" fill="#C9A050" stroke="#8C6B28" strokeWidth="2" />
                        <line x1="241" y1="24" x2="241" y2="52" stroke="#4A3B1C" strokeWidth="2.5" />
                        <rect x="335" y="48" width="20" height="26" rx="4" fill="#C9A050" stroke="#8C6B28" strokeWidth="2" />
                        <line x1="345" y1="48" x2="345" y2="74" stroke="#4A3B1C" strokeWidth="2.5" />
                      </g>
                    )}

                    {/* Layer 2: Microfiber Footbed Lining */}
                    {layer.id === 2 && (
                      <g fill="none">
                        <path
                          d="M 50 110 C 60 120, 130 125, 230 125 C 340 125, 390 115, 398 95 C 400 80, 360 70, 320 70 C 230 70, 180 90, 110 90 C 70 90, 50 100, 50 110 Z"
                          fill={layer.color}
                          stroke="#C4B29E"
                          strokeWidth="2"
                        />
                        {/* MEOW debossed logo on heel */}
                        <text x="95" y="104" fill="#8D7A68" fontSize="12" fontWeight="bold" letterSpacing="2">
                          meow
                        </text>
                      </g>
                    )}

                    {/* Layer 3: Anatomical Cork-Latex Core */}
                    {layer.id === 3 && (
                      <g fill="none">
                        <path
                          d="M 45 118 C 55 132, 130 138, 230 138 C 345 138, 395 125, 402 102 C 405 85, 365 75, 320 75 C 230 75, 175 98, 105 98 C 65 98, 45 105, 45 118 Z"
                          fill={layer.color}
                          stroke="#9E7E5A"
                          strokeWidth="2"
                        />
                        {/* Granulated Cork Texture dots */}
                        <circle cx="90" cy="115" r="1.5" fill="#5A432D" />
                        <circle cx="150" cy="120" r="1.5" fill="#5A432D" />
                        <circle cx="210" cy="122" r="1.5" fill="#5A432D" />
                        <circle cx="270" cy="122" r="1.5" fill="#5A432D" />
                        <circle cx="330" cy="116" r="1.5" fill="#5A432D" />
                        <circle cx="370" cy="104" r="1.5" fill="#5A432D" />
                      </g>
                    )}

                    {/* Layer 4: Shock-absorbing Cushion Midsole */}
                    {layer.id === 4 && (
                      <path
                        d="M 42 125 C 50 140, 130 146, 230 146 C 350 146, 400 132, 405 108 C 402 102, 360 92, 320 92 C 230 92, 175 108, 105 108 C 65 108, 42 115, 42 125 Z"
                        fill={layer.color}
                        stroke="#C9C5BD"
                        strokeWidth="2"
                      />
                    )}

                    {/* Layer 5: Anti-Skid Traction Outsole */}
                    {layer.id === 5 && (
                      <g fill="none">
                        <path
                          d="M 40 132 C 48 150, 130 156, 230 156 C 355 156, 405 140, 410 115 C 405 108, 360 98, 320 98 C 230 98, 175 115, 105 115 C 65 115, 40 120, 40 132 Z"
                          fill={layer.color}
                          stroke="#111"
                          strokeWidth="2"
                        />
                        {/* Flex grooves */}
                        <path d="M 120 148 L 130 135 M 180 152 L 190 138 M 240 153 L 250 140 M 300 150 L 310 138 M 360 142 L 370 130" stroke="#555" strokeWidth="2.5" />
                      </g>
                    )}
                  </svg>

                  {/* Interactive Callout Label when exploded > 35% */}
                  {explosionProgress > 35 && (
                    <div
                      className={`absolute left-full ml-4 whitespace-nowrap bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-meow-border shadow-md transition-all ${
                        isHovered ? 'scale-105 border-meow-dark ring-2 ring-meow-dark/10' : 'opacity-85'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
                        <span className="text-xs font-semibold text-meow-dark">{layer.badge}</span>
                      </div>
                      <p className="text-[10px] text-meow-muted max-w-xs hidden sm:block">
                        {layer.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* BOTTOM SCRUBBER BAR: Manual explosion slider */}
          <div className="absolute bottom-4 left-6 right-6 z-20 flex items-center justify-between gap-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-meow-border">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-meow-muted">
              Assembled
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(explosionProgress)}
              onChange={(e) => {
                setExplosionProgress(Number(e.target.value));
                setIsAutoExploding(false);
              }}
              className="w-full accent-meow-dark h-1.5 bg-meow-border rounded-lg cursor-pointer"
            />
            <span className="text-[11px] uppercase tracking-wider font-semibold text-meow-dark whitespace-nowrap">
              Exploded ({Math.round(explosionProgress)}%)
            </span>
          </div>
        </div>
      )}

      {/* MODE 2: CINEMATIC 3D FOOTWEAR VIDEO */}
      {viewMode === 'video' && desktopVideoUrl && (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={desktopVideoUrl}
            poster={posterImageUrl || undefined}
            autoPlay={autoPlayVideo}
            muted
            loop
            playsInline
            controls={false}
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}
    </div>
  );
};
