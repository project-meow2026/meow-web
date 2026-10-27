'use client';

import React from 'react';
import { Category } from '@/lib/supabase/types';
import { RotateCcw } from 'lucide-react';
import { formatPrice } from '@/lib/utils/formatters';

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  sizes: string[];
  colors?: string[];
  inStockOnly?: boolean;
}

interface FilterSidebarProps {
  categories: Category[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  availableColors?: string[];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  filters,
  onChange,
  onReset,
}) => {
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
    <aside className="w-full space-y-7">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3.5 border-b border-meow-border">
        <h3 className="text-xs uppercase tracking-widest font-semibold text-meow-dark">
          FILTERS
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-meow-subtle hover:text-meow-dark flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 1. Category / Collection Filter */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-meow-dark">
          Category
        </h4>
        <div className="space-y-2">
          {categories.map((cat) => {
            const isChecked = filters.categories.includes(cat.slug);
            return (
              <label
                key={cat.id || cat.slug}
                className="flex items-center gap-2.5 text-xs text-meow-muted hover:text-meow-dark cursor-pointer select-none py-0.5"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCategory(cat.slug)}
                  className="rounded border-meow-border text-meow-dark focus:ring-meow-dark w-3.5 h-3.5 accent-meow-dark"
                />
                <span className={isChecked ? 'font-semibold text-meow-dark' : ''}>{cat.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Enhanced Responsive Price Range Filter */}
      <div className="space-y-3.5 pt-4 border-t border-meow-border/70">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-meow-dark">
            Price Range
          </h4>
          <span className="text-xs font-semibold text-meow-dark font-mono">
            {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
          </span>
        </div>

        {/* Quick Price Bracket Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => setPriceBracket(0, 10000)}
            className={`px-2.5 py-1 text-[11px] rounded transition-all ${
              isBracketActive(0, 10000)
                ? 'bg-meow-dark text-white font-medium'
                : 'bg-meow-surface text-meow-muted hover:text-meow-dark border border-meow-border/60'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setPriceBracket(0, 1500)}
            className={`px-2.5 py-1 text-[11px] rounded transition-all ${
              isBracketActive(0, 1500)
                ? 'bg-meow-dark text-white font-medium'
                : 'bg-meow-surface text-meow-muted hover:text-meow-dark border border-meow-border/60'
            }`}
          >
            Under ₹1.5k
          </button>
          <button
            type="button"
            onClick={() => setPriceBracket(1500, 2500)}
            className={`px-2.5 py-1 text-[11px] rounded transition-all ${
              isBracketActive(1500, 2500)
                ? 'bg-meow-dark text-white font-medium'
                : 'bg-meow-surface text-meow-muted hover:text-meow-dark border border-meow-border/60'
            }`}
          >
            ₹1.5k - ₹2.5k
          </button>
          <button
            type="button"
            onClick={() => setPriceBracket(2500, 4000)}
            className={`px-2.5 py-1 text-[11px] rounded transition-all ${
              isBracketActive(2500, 4000)
                ? 'bg-meow-dark text-white font-medium'
                : 'bg-meow-surface text-meow-muted hover:text-meow-dark border border-meow-border/60'
            }`}
          >
            ₹2.5k - ₹4k
          </button>
          <button
            type="button"
            onClick={() => setPriceBracket(4000, 10000)}
            className={`px-2.5 py-1 text-[11px] rounded transition-all ${
              isBracketActive(4000, 10000)
                ? 'bg-meow-dark text-white font-medium'
                : 'bg-meow-surface text-meow-muted hover:text-meow-dark border border-meow-border/60'
            }`}
          >
            ₹4k+
          </button>
        </div>

        {/* Max Price Range Slider */}
        <div className="space-y-1.5 pt-1">
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
            className="w-full accent-meow-dark h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-meow-subtle font-mono">
            <span>₹0</span>
            <span>Max: {formatPrice(filters.priceRange[1])}</span>
            <span>₹10,000</span>
          </div>
        </div>
      </div>

      {/* 3. Size Filter */}
      <div className="space-y-3 pt-4 border-t border-meow-border/70">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-meow-dark">
          Size (UK / IND)
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
                    : 'bg-white text-meow-dark border-meow-border hover:border-meow-dark/50'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
