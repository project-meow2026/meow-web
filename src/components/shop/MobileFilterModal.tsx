'use client';

import React from 'react';
import { X, Check } from 'lucide-react';
import { Category } from '@/lib/supabase/types';
import { FilterState } from './FilterSidebar';
import { formatPrice } from '@/lib/utils/formatters';

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  availableColors: string[];
  totalResults: number;
}

export const MobileFilterModal: React.FC<MobileFilterModalProps> = ({
  isOpen,
  onClose,
  categories,
  filters,
  onChange,
  onReset,
  availableColors,
  totalResults,
}) => {
  if (!isOpen) return null;

  const sizesList = ['5', '6', '7', '8', '9', '10', '11'];

  const toggleCategory = (slug: string) => {
    const updated = filters.categories.includes(slug)
      ? filters.categories.filter((s) => s !== slug)
      : [...filters.categories, slug];
    onChange({ ...filters, categories: updated });
  };

  const toggleSize = (size: string) => {
    const updated = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onChange({ ...filters, sizes: updated });
  };

  const toggleColor = (color: string) => {
    const updated = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onChange({ ...filters, colors: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white ml-auto h-full shadow-2xl flex flex-col justify-between z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-meow-border">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-meow-dark">
            Filter Footwear
          </h3>
          <button onClick={onClose} className="p-1 text-meow-muted hover:text-meow-dark">
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-meow-dark">
              Collections
            </h4>
            <div className="space-y-2">
              {categories.map((cat) => {
                const isChecked = filters.categories.includes(cat.slug);
                return (
                  <label key={cat.slug} className="flex items-center gap-2.5 text-xs text-meow-dark cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCategory(cat.slug)}
                      className="rounded border-meow-border text-meow-dark accent-meow-dark"
                    />
                    <span>{cat.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-4 border-t border-meow-border">
            <div className="flex justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-meow-dark">Max Price</span>
              <span className="font-mono text-meow-muted">{formatPrice(filters.priceRange[1])}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="250"
              value={filters.priceRange[1]}
              onChange={(e) =>
                onChange({
                  ...filters,
                  priceRange: [filters.priceRange[0], Number(e.target.value)],
                })
              }
              className="w-full accent-meow-dark"
            />
          </div>

          {/* Sizes */}
          <div className="space-y-2 pt-4 border-t border-meow-border">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-meow-dark">
              Sizes
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {sizesList.map((sz) => {
                const isSelected = filters.sizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`py-2 text-xs font-medium rounded border ${
                      isSelected
                        ? 'bg-meow-dark text-white border-meow-dark'
                        : 'bg-white text-meow-dark border-meow-border'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors */}
          {availableColors.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-meow-border">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-meow-dark">
                Colors
              </h4>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((col) => {
                  const isSelected = filters.colors.includes(col);
                  return (
                    <button
                      key={col}
                      type="button"
                      onClick={() => toggleColor(col)}
                      className={`px-3 py-1 text-xs rounded-full border ${
                        isSelected
                          ? 'bg-meow-dark text-white border-meow-dark'
                          : 'bg-meow-surface text-meow-muted border-meow-border'
                      }`}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-meow-border bg-white flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-3 text-xs uppercase tracking-widest font-semibold border border-meow-border text-meow-dark rounded"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 text-xs uppercase tracking-widest font-semibold bg-meow-dark text-white rounded flex items-center justify-center gap-2"
          >
            <span>Apply ({totalResults})</span>
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
