'use client';

import React from 'react';
import { Ruler } from 'lucide-react';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  onOpenSizeGuide: () => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelectSize,
  onOpenSizeGuide,
}) => {
  const allSizes = sizes.length > 0 ? sizes : ['5', '6', '7', '8', '9', '10', '11'];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-meow-dark">
          Size (UK / IND): <strong className="text-meow-dark font-normal">{selectedSize || 'Select a size'}</strong>
        </span>
        <button
          type="button"
          onClick={onOpenSizeGuide}
          className="text-xs text-meow-muted hover:text-meow-dark flex items-center gap-1 transition-colors underline"
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>Size Guide</span>
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {allSizes.map((sz) => {
          const isSelected = selectedSize === sz;

          return (
            <button
              key={sz}
              type="button"
              onClick={() => onSelectSize(sz)}
              className={`w-11 h-11 rounded border text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-meow-dark text-white border-meow-dark shadow-sm'
                  : 'bg-white text-meow-dark border-meow-border hover:border-meow-dark/60'
              }`}
            >
              {sz}
            </button>
          );
        })}
      </div>
    </div>
  );
};
