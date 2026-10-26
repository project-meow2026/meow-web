'use client';

import React from 'react';
import { Plus, Trash2, Image as ImageIcon, Layers } from 'lucide-react';
import { ProductVariant } from '@/lib/supabase/types';
import { ImageUploader } from './ImageUploader';

interface VariantManagerProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}

export const VariantManager: React.FC<VariantManagerProps> = ({ variants, onChange }) => {
  const handleAddVariant = () => {
    const newVariant: ProductVariant = {
      id: 'var-' + Date.now(),
      product_id: '',
      color_name: 'New Color',
      sku: '',
      miniature_image_url: '',
      primary_image_url: '',
      gallery_images: [],
      available_sizes: ['5', '6', '7', '8', '9', '10', '11'],
      stock: 15,
      price_override: null,
      is_active: true,
      display_order: variants.length + 1,
    };
    onChange([...variants, newVariant]);
  };

  const handleUpdateVariant = (index: number, updated: Partial<ProductVariant>) => {
    const copy = [...variants];
    copy[index] = { ...copy[index], ...updated };
    onChange(copy);
  };

  const handleRemoveVariant = (index: number) => {
    const copy = variants.filter((_, i) => i !== index);
    onChange(copy);
  };

  return (
    <div className="space-y-6 pt-4 border-t border-meow-border">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-meow-dark flex items-center gap-2">
            <Layers className="w-4 h-4 text-meow-dark" />
            <span>Product Color Variants & Miniature Footwear Images</span>
          </h3>
          <p className="text-xs text-meow-muted mt-0.5">
            MANDATORY: Upload small miniature footwear images for each colorway. Storefront will display these actual miniature images.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddVariant}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-meow-dark text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-meow-dark/85"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Color Variant</span>
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="p-6 text-center border border-dashed border-meow-border rounded-lg bg-meow-surface text-xs text-meow-muted">
          No color variants added yet. Click &quot;Add Color Variant&quot; to configure colors and upload corresponding miniature footwear photos.
        </div>
      ) : (
        <div className="space-y-6">
          {variants.map((variant, idx) => (
            <div
              key={variant.id || idx}
              className="p-5 border border-meow-border rounded-xl bg-white shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-meow-border">
                <span className="text-xs font-bold uppercase tracking-wider text-meow-dark">
                  Variant #{idx + 1}: {variant.color_name}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(idx)}
                  className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Variant</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Color Name */}
                <div>
                  <label className="text-xs font-medium text-meow-dark block mb-1">
                    Color Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={variant.color_name}
                    onChange={(e) => handleUpdateVariant(idx, { color_name: e.target.value })}
                    placeholder="e.g. Desert Brown, Arctic White, Matte Black"
                    className="w-full text-xs px-3 py-2 rounded border border-meow-border"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="text-xs font-medium text-meow-dark block mb-1">
                    SKU Identifier
                  </label>
                  <input
                    type="text"
                    value={variant.sku || ''}
                    onChange={(e) => handleUpdateVariant(idx, { sku: e.target.value })}
                    placeholder="e.g. MEOW-BRN-01"
                    className="w-full text-xs px-3 py-2 rounded border border-meow-border"
                  />
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="text-xs font-medium text-meow-dark block mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) =>
                      handleUpdateVariant(idx, { stock: Number(e.target.value) || 0 })
                    }
                    className="w-full text-xs px-3 py-2 rounded border border-meow-border"
                  />
                </div>
              </div>

              {/* Miniature Footwear Image Upload & Variant Main Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div>
                  <ImageUploader
                    label="Miniature Footwear Image (For color selector swatches)"
                    folder="meow/variants"
                    value={variant.miniature_image_url}
                    aspectRatio="aspect-square"
                    onChange={(url) =>
                      handleUpdateVariant(idx, {
                        miniature_image_url: url,
                        primary_image_url: variant.primary_image_url || url,
                      })
                    }
                  />
                  <span className="text-[10px] text-meow-muted mt-1 block">
                    Displays in the product detail page color picker swatch.
                  </span>
                </div>

                <div>
                  <ImageUploader
                    label="Full-Size Variant Image (Shows on main stage when clicked)"
                    folder="meow/variants"
                    value={variant.primary_image_url || variant.miniature_image_url || ''}
                    aspectRatio="aspect-[4/3]"
                    onChange={(url) =>
                      handleUpdateVariant(idx, {
                        primary_image_url: url,
                        miniature_image_url: variant.miniature_image_url || url,
                      })
                    }
                  />
                  <span className="text-[10px] text-meow-muted mt-1 block">
                    Automatically defaults to the miniature image if left blank.
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
