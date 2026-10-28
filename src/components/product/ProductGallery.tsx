'use client';

import React, { useState, useEffect } from 'react';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary/upload';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset to first image when first image changes (e.g., variant selected)
  useEffect(() => {
    setActiveImageIndex(0);
  }, [images[0]]);

  const activeImage = images[activeImageIndex] || images[0] || '';

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 items-start">
      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[540px] w-full md:w-20 pb-2 md:pb-0 flex-shrink-0">
          {images.map((img, idx) => {
            const isSelected = idx === activeImageIndex;
            return (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-[#F7F6F2] ${
                  isSelected
                    ? 'border-meow-dark ring-1 ring-meow-dark'
                    : 'border-meow-border hover:border-meow-muted opacity-80 hover:opacity-100'
                }`}
              >
                <img
                  src={optimizeCloudinaryUrl(img, 200)}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover object-center select-none"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Image Stage */}
      <div className="relative flex-1 w-full aspect-[4/5] bg-[#F7F6F2] rounded-xl overflow-hidden border border-meow-border flex items-center justify-center group">
        {activeImage ? (
          <img
            src={optimizeCloudinaryUrl(activeImage, 1000)}
            alt={productName}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center select-none transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#FAF9F6] to-[#ECE8E1]">
            <div className="w-16 h-16 rounded-full border border-meow-border flex items-center justify-center mb-3 bg-white/80">
              <span className="font-editorial text-xl font-bold text-meow-dark">MEOW</span>
            </div>
            <span className="text-xs uppercase tracking-widest text-meow-subtle font-sans">
              Handcrafted Footwear
            </span>
          </div>
        )}

        {/* Carousel arrows for multi-image gallery */}
        {images.length > 1 && (
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={prevImage}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-meow-dark hover:bg-white shadow transition-transform hover:scale-105"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-meow-dark hover:bg-white shadow transition-transform hover:scale-105"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Zoom cue badge */}
        <div className="absolute bottom-3 right-3 p-2 rounded-full bg-white/70 backdrop-blur-sm text-meow-dark pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
