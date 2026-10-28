'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product, ProductVariant } from '@/lib/supabase/types';
import { formatPrice } from '@/lib/utils/formatters';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary/upload';
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
    <div className="group relative flex flex-col h-full bg-white border border-[#EBE8E2] rounded-none overflow-hidden transition-colors duration-200">
      {/* Top Image Container - Crisp Rectangular, No Curves, No Hover Zoom */}
      <div className="relative aspect-[4/5] w-full bg-[#F7F6F2] overflow-hidden rounded-none flex-shrink-0">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          {displayImage ? (
            <img
              src={optimizeCloudinaryUrl(displayImage, 700)}
              alt={product.name}
              className="w-full h-full object-cover object-center select-none"
              loading="eager"
              decoding="async"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-[#FAF9F6] to-[#ECE8E1]">
              <div className="w-10 h-10 rounded-none border border-meow-border flex items-center justify-center mb-1.5 bg-white/70">
                <span className="font-editorial text-xs font-bold text-meow-dark">MEOW</span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-meow-subtle font-sans">
                Handcrafted
              </span>
            </div>
          )}
        </Link>

        {/* Wishlist Heart Button - Perfectly Positioned Badge */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm text-meow-dark flex items-center justify-center shadow-sm transition-colors hover:bg-white z-10"
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-3 h-3 sm:w-4 sm:h-4 stroke-[1.5] ${
              isFavorited ? 'fill-red-500 text-red-500' : 'text-neutral-700'
            }`}
          />
        </button>

        {/* Badges - Crisp Sharp Corners */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
          {product.is_bestseller && (
            <span className="px-1.5 py-0.5 sm:px-2 bg-meow-dark text-white text-[7.5px] sm:text-[9px] uppercase tracking-widest font-semibold rounded-none">
              Best Seller
            </span>
          )}
          {product.is_new_arrival && (
            <span className="px-1.5 py-0.5 sm:px-2 bg-white text-meow-dark text-[7.5px] sm:text-[9px] uppercase tracking-widest font-semibold rounded-none shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2 bg-meow-dark text-white text-xs uppercase tracking-widest font-medium hover:bg-black transition-colors flex items-center justify-center gap-1.5 rounded-none shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Product Information - Mobile Compact Adjusted Sizes with Equal Rhythm */}
      <div className="p-2 sm:p-3.5 flex flex-col flex-1 justify-between gap-1.5 sm:gap-2.5">
        <div>
          {/* Collection / Category */}
          {product.category && (
            <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-meow-subtle block mb-0.5 truncate">
              {product.category.name}
            </span>
          )}

          {/* Product Name */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-[11px] sm:text-sm font-medium text-meow-dark leading-snug line-clamp-1 group-hover:underline">
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

        {/* Circular Color Swatch Dots Matching Luxury Reference Image */}
        {product.variants && product.variants.length > 0 && (
          <div className="pt-1.5 sm:pt-2 border-t border-meow-border/50 mt-auto">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar scrollbar-none [&::-webkit-scrollbar]:hidden">
              {product.variants.map((variant, idx) => {
                const isSelected = selectedVariantIndex === idx;
                
                // Color mapping dictionary for natural luxury footwear tones
                const colorMap: Record<string, string> = {
                  black: '#1A1A1A',
                  obsidian: '#1F1F1F',
                  burgundy: '#5B1E31',
                  brown: '#4A2E18',
                  chocolate: '#3D2314',
                  camel: '#C19A6B',
                  tan: '#D2B48C',
                  sandstone: '#D8C7B5',
                  beige: '#E6DCB8',
                  espresso: '#362B28',
                  blue: '#7FA5B8',
                  sky: '#87CEEB',
                  wheat: '#F5DEB3',
                  terracotta: '#C86D51',
                  white: '#F5F5F5',
                };

                const lowerName = variant.color_name.toLowerCase();
                const matchedHex = Object.keys(colorMap).find(k => lowerName.includes(k)) 
                  ? colorMap[Object.keys(colorMap).find(k => lowerName.includes(k))!] 
                  : (idx === 0 ? '#C2A68D' : idx === 1 ? '#222222' : idx === 2 ? '#5A3825' : '#7FA5B8');

                const miniImg = variant.miniature_image_url || variant.primary_image_url;

                return (
                  <button
                    key={variant.id || `${variant.color_name}-${idx}`}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariantIndex((prev) => (prev === idx ? -1 : idx));
                    }}
                    onMouseEnter={() => setSelectedVariantIndex(idx)}
                    title={`Color: ${variant.color_name}`}
                    className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden flex-shrink-0 transition-all duration-200 border bg-[#F7F6F2] ${
                      isSelected
                        ? 'ring-2 ring-meow-dark ring-offset-1 scale-105 border-meow-dark'
                        : 'border-neutral-300 hover:scale-105 opacity-90'
                    }`}
                    aria-label={`Select color ${variant.color_name}`}
                  >
                    {miniImg ? (
                      <img
                        src={miniImg}
                        alt={variant.color_name}
                        className="w-full h-full object-cover object-center pointer-events-none"
                        loading="lazy"
                      />
                    ) : (
                      <span
                        className="w-full h-full block rounded-full"
                        style={{ backgroundColor: matchedHex }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
