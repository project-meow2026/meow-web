'use client';

import React from 'react';
import { Category } from '@/lib/supabase/types';
import { RotateCcw } from 'lucide-react';
import { formatPrice } from '@/lib/utils/formatters';

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  inStockOnly: boolean;
}

interface FilterSidebarProps {
  categories: Category[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  availableColors: string[];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  filters,
  onChange,
  onReset,
  availableColors,
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

  const toggleColor = (color: string) => {
    const updated = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onChange({ ...filters, colors: updated });
  };

  return (
    <aside className="w-full space-y-8 pr-4">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-meow-border">
        <h3 className="text-xs uppercase tracking-widest font-semibold text-meow-dark">
          FILTERS
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-meow-subtle hover:text-meow-dark flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
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
                className="flex items-center gap-2.5 text-xs text-meow-muted hover:text-meow-dark cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCategory(cat.slug)}
                  className="rounded border-meow-border text-meow-dark focus:ring-meow-dark w-3.5 h-3.5 accent-meow-dark"
                />
                <span className={isChecked ? 'font-medium text-meow-dark' : ''}>{cat.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range Filter */}
      <div className="space-y-3 pt-4 border-t border-meow-border/60">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-meow-dark">
            Price Range
          </h4>
          <span className="text-xs text-meow-muted font-mono">
            {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
          </span>
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
          className="w-full accent-meow-dark h-1.5 bg-meow-border rounded-lg cursor-pointer"
        />
      </div>

      {/* 3. Size Filter */}
      <div className="space-y-3 pt-4 border-t border-meow-border/60">
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

      {/* 4. Color Filter */}
      {availableColors.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-meow-border/60">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-meow-dark">
            Color
          </h4>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((col) => {
              const isSelected = filters.colors.includes(col);
              return (
                <button
                  key={col}
                  type="button"
                  onClick={() => toggleColor(col)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all ${
                    isSelected
                      ? 'bg-meow-dark text-white border-meow-dark font-medium'
                      : 'bg-meow-surface text-meow-muted border-meow-border hover:text-meow-dark hover:border-meow-dark/40'
                  }`}
                >
                  {col}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. In Stock Only Toggle */}
      <div className="pt-4 border-t border-meow-border/60">
        <label className="flex items-center gap-2.5 text-xs text-meow-muted hover:text-meow-dark cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="rounded border-meow-border text-meow-dark focus:ring-meow-dark w-3.5 h-3.5 accent-meow-dark"
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </aside>
  );
};
