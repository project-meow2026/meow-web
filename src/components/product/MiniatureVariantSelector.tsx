'use client';

import React from 'react';
import { ProductVariant } from '@/lib/supabase/types';

interface MiniatureVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelectVariant: (variant: ProductVariant) => void;
}

export const MiniatureVariantSelector: React.FC<MiniatureVariantSelectorProps> = ({
  variants,
  selectedVariant,
  onSelectVariant,
}) => {
  if (!variants || variants.length <= 1) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-meow-dark">
          Color: <strong className="text-meow-dark font-normal capitalize">{selectedVariant?.color_name || 'Original'}</strong>
        </span>
        <span className="text-[11px] text-meow-subtle">
          {variants.length} colorways available
        </span>
      </div>

      {/* Miniature footwear images for each colorway */}
      <div className="flex items-center gap-3 flex-wrap">
        {variants.map((variant) => {
          const isSelected =
            selectedVariant?.id === variant.id ||
            (selectedVariant &&
              variant &&
              ((selectedVariant.id === 'primary-base' && variant.id === 'primary-base') ||
                (selectedVariant.color_name === variant.color_name &&
                  (selectedVariant.miniature_image_url === variant.miniature_image_url ||
                    selectedVariant.primary_image_url === variant.primary_image_url))));

          return (
            <button
              key={variant.id || variant.color_name}
              type="button"
              onClick={() => onSelectVariant(variant)}
              aria-label={`Select ${variant.color_name} colorway`}
              className={`group relative w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden border-2 transition-all duration-200 bg-[#F7F6F2] ${
                isSelected
                  ? 'border-meow-dark ring-2 ring-meow-dark/20 scale-105 shadow-md'
                  : 'border-meow-border hover:border-meow-muted opacity-80 hover:opacity-100'
              }`}
            >
              {/* Miniature footwear photo */}
              {(variant.miniature_image_url || variant.primary_image_url) ? (
                <img
                  src={(variant.miniature_image_url || variant.primary_image_url)!}
                  alt={variant.color_name}
                  className="w-full h-full object-cover object-center select-none"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-meow-subtle uppercase">
                  <span>Shoe</span>
                </div>
              )}

              {/* Selected indicator check badge */}
              {isSelected && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-meow-dark ring-1 ring-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
