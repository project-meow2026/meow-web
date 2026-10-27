'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product, ProductVariant } from '@/lib/supabase/types';
import { formatPrice } from '@/lib/utils/formatters';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  key?: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Active selected color variant (-1 means default primary product)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(-1);

  const activeVariant: ProductVariant | undefined =
    selectedVariantIndex >= 0 && product.variants && product.variants.length > selectedVariantIndex
      ? product.variants[selectedVariantIndex]
      : undefined;

  // Active display image (variant primary image or default primary image)
  const displayImage =
    activeVariant?.primary_image_url ||
    activeVariant?.miniature_image_url ||
    product.primary_image_url;

  // Active price (with variant override if applicable)
  const currentPrice = activeVariant?.price_override ?? product.price;
  const currentSalePrice = product.sale_price;

  const isFavorited = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      categoryName: product.category?.name,
      variantId: activeVariant?.id || 'default-variant',
      colorName: activeVariant?.color_name || 'Standard',
      miniatureImageUrl: activeVariant?.miniature_image_url || product.primary_image_url,
      primaryImageUrl: displayImage,
      size: product.sizes?.[0] || '8',
      price: currentSalePrice ?? currentPrice,
      quantity: 1,
    });
  };

  return (
    <div className="group relative flex flex-col bg-white border border-meow-border rounded-lg overflow-hidden transition-all duration-300 hover:border-meow-dark/40 hover:shadow-md">
      {/* Top Image Container */}
      <div className="relative aspect-[4/5] bg-[#F7F6F2] overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          {displayImage ? (
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#FAF9F6] to-[#ECE8E1]">
              <div className="w-12 h-12 rounded-full border border-meow-border flex items-center justify-center mb-2 bg-white/70">
                <span className="font-editorial text-sm font-bold text-meow-dark">MEOW</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-meow-subtle font-sans">
                Handcrafted
              </span>
            </div>
          )}
        </Link>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full bg-white/85 backdrop-blur-sm text-meow-dark hover:bg-white shadow-sm transition-all"
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.5] ${
              isFavorited ? 'fill-red-500 text-red-500' : 'text-meow-dark'
            }`}
          />
        </button>

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1">
          {product.is_bestseller && (
            <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-meow-dark text-white text-[8px] sm:text-[9px] uppercase tracking-widest font-semibold rounded">
              Best Seller
            </span>
          )}
          {product.is_new_arrival && (
            <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-white text-meow-dark text-[8px] sm:text-[9px] uppercase tracking-widest font-semibold rounded shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2 bg-meow-dark/95 backdrop-blur-sm text-white text-xs uppercase tracking-widest font-medium hover:bg-meow-dark transition-colors flex items-center justify-center gap-1.5 rounded shadow"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Product Information - Mobile Compact Adjusted Sizes */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between space-y-1.5 sm:space-y-3">
        <div>
          {/* Collection / Category */}
          {product.category && (
            <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-meow-subtle block mb-0.5">
              {product.category.name}
            </span>
          )}

          {/* Product Name */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-medium text-meow-dark leading-snug line-clamp-1 group-hover:underline">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="mt-0.5 sm:mt-1 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-xs sm:text-sm font-semibold text-meow-dark">
              {formatPrice(currentSalePrice ?? currentPrice)}
            </span>
            {currentSalePrice && (
              <span className="text-[10px] sm:text-xs text-meow-subtle line-through">
                {formatPrice(currentPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Miniature Footwear Images Representing Color Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="pt-1.5 sm:pt-2 border-t border-meow-border/60">
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-0.5">
              {product.variants.map((variant, idx) => {
                const isSelected = selectedVariantIndex === idx;

                return (
                  <button
                    key={variant.id || `${variant.color_name}-${idx}`}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariantIndex((prev) => (prev === idx ? -1 : idx));
                    }}
                    title={`Color: ${variant.color_name}`}
                    className={`relative w-6 h-6 sm:w-8 sm:h-8 rounded border overflow-hidden flex-shrink-0 transition-all ${
                      isSelected
                        ? 'border-meow-dark ring-1 ring-meow-dark scale-105'
                        : 'border-meow-border hover:border-meow-muted opacity-80'
                    }`}
                  >
                    {variant.miniature_image_url ? (
                      <img
                        src={variant.miniature_image_url}
                        alt={variant.color_name}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-[7px] sm:text-[8px] uppercase bg-meow-surface text-meow-muted">
                        {variant.color_name.slice(0, 2)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {activeVariant && (
              <span className="text-[9px] sm:text-[10px] text-meow-subtle block mt-0.5">
                Color: <span className="text-meow-dark font-medium">{activeVariant.color_name}</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
