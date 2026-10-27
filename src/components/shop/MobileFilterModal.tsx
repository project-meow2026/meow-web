'use client';

import React from 'react';
import { X, Check, RotateCcw } from 'lucide-react';
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
  availableColors?: string[];
  totalResults: number;
}

export const MobileFilterModal: React.FC<MobileFilterModalProps> = ({
  isOpen,
  onClose,
  categories,
  filters,
  onChange,
  onReset,
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

  const setPriceBracket = (min: number, max: number) => {
    onChange({
      ...filters,
      priceRange: [min, max],
    });
  };

  const isBracketActive = (min: number, max: number) => {
    return filters.priceRange[0] === min && filters.priceRange[1] === max;
  };

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white ml-auto h-full shadow-2xl flex flex-col justify-between z-10 animate-fade-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-meow-border">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-meow-dark">
              Filters
            </h3>
            <span className="text-xs text-meow-muted">({totalResults} items)</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-meow-muted hover:text-meow-dark">
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
                  <label key={cat.slug} className="flex items-center gap-2.5 text-xs text-meow-dark cursor-pointer py-0.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCategory(cat.slug)}
                      className="rounded border-meow-border text-meow-dark accent-meow-dark w-4 h-4"
                    />
                    <span className={isChecked ? 'font-semibold text-meow-dark' : 'text-meow-muted'}>{cat.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3 pt-4 border-t border-meow-border">
            <div className="flex justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-meow-dark">Price Range</span>
              <span className="font-mono text-meow-dark font-semibold">
                {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
              </span>
            </div>

            {/* Price Presets */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setPriceBracket(0, 10000)}
                className={`px-2.5 py-1 text-xs rounded transition-all ${
                  isBracketActive(0, 10000)
                    ? 'bg-meow-dark text-white font-medium'
                    : 'bg-meow-surface text-meow-muted border border-meow-border/60'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setPriceBracket(0, 1500)}
                className={`px-2.5 py-1 text-xs rounded transition-all ${
                  isBracketActive(0, 1500)
                    ? 'bg-meow-dark text-white font-medium'
                    : 'bg-meow-surface text-meow-muted border border-meow-border/60'
                }`}
              >
                Under ₹1.5k
              </button>
              <button
                type="button"
                onClick={() => setPriceBracket(1500, 2500)}
                className={`px-2.5 py-1 text-xs rounded transition-all ${
                  isBracketActive(1500, 2500)
                    ? 'bg-meow-dark text-white font-medium'
                    : 'bg-meow-surface text-meow-muted border border-meow-border/60'
                }`}
              >
                ₹1.5k - ₹2.5k
              </button>
              <button
                type="button"
                onClick={() => setPriceBracket(2500, 4000)}
                className={`px-2.5 py-1 text-xs rounded transition-all ${
                  isBracketActive(2500, 4000)
                    ? 'bg-meow-dark text-white font-medium'
                    : 'bg-meow-surface text-meow-muted border border-meow-border/60'
                }`}
              >
                ₹2.5k - ₹4k
              </button>
              <button
                type="button"
                onClick={() => setPriceBracket(4000, 10000)}
                className={`px-2.5 py-1 text-xs rounded transition-all ${
                  isBracketActive(4000, 10000)
                    ? 'bg-meow-dark text-white font-medium'
                    : 'bg-meow-surface text-meow-muted border border-meow-border/60'
                }`}
              >
                ₹4k+
              </button>
            </div>

            <div className="space-y-1 pt-1">
              <input
                type="range"
                min="500"
                max="10000"
                step="100"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    priceRange: [filters.priceRange[0], Math.max(filters.priceRange[0] + 100, Number(e.target.value))],
                  })
                }
                className="w-full accent-meow-dark h-2 bg-neutral-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-meow-subtle font-mono">
                <span>₹0</span>
                <span>Max: {formatPrice(filters.priceRange[1])}</span>
                <span>₹10,000</span>
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2 pt-4 border-t border-meow-border">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-meow-dark">
              Sizes (UK / IND)
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {sizesList.map((sz) => {
                const isSelected = filters.sizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`py-2 text-xs font-medium rounded border transition-colors ${
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
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-meow-border bg-white flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-3 text-xs uppercase tracking-widest font-semibold border border-meow-border text-meow-dark rounded hover:bg-meow-surface flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 text-xs uppercase tracking-widest font-semibold bg-meow-dark text-white rounded flex items-center justify-center gap-2 hover:bg-meow-dark/90"
          >
            <span>Apply ({totalResults})</span>
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
