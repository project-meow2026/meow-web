'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Zap,
  ChevronRight,
  Feather,
  Layers,
  ShieldCheck,
  Sparkles,
  Minus,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGallery } from '@/components/product/ProductGallery';
import { MiniatureVariantSelector } from '@/components/product/MiniatureVariantSelector';
import { SizeSelector } from '@/components/product/SizeSelector';
import { SizeGuideModal } from '@/components/product/SizeGuideModal';
import { ProductAccordion } from '@/components/product/ProductAccordion';
import { ProductCard } from '@/components/shop/ProductCard';
import { dbService } from '@/lib/storage/db';
import { Product, ProductVariant } from '@/lib/supabase/types';
import { formatPrice } from '@/lib/utils/formatters';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const prod = await dbService.getProductBySlug(params.slug);
        if (prod) {
          setProduct(prod);
          // Set initial variant
          if (prod.variants && prod.variants.length > 0) {
            setSelectedVariant(prod.variants[0]);
          }
          // Set initial size
          if (prod.sizes && prod.sizes.length > 0) {
            setSelectedSize(prod.sizes[0]);
          }

          // Load related products from same category or general
          const all = await dbService.getProducts();
          const related = all.filter((p) => p.id !== prod.id).slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
          <div className="w-8 h-8 border-2 border-meow-dark border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs uppercase tracking-widest text-meow-muted">Loading footwear details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white px-4 text-center">
          <h2 className="font-editorial text-3xl font-medium text-meow-dark mb-2">
            Product Not Found
          </h2>
          <p className="text-xs text-meow-muted mb-6">
            The footwear item you are looking for may have moved or is currently unavailable.
          </p>
          <Link
            href="/shop"
            className="px-6 py-2.5 bg-meow-dark text-white text-xs uppercase tracking-widest font-semibold"
          >
            Explore All Footwear
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // Active variant image (checks full-size primary or miniature image)
  const activeVariantImage = selectedVariant?.primary_image_url || selectedVariant?.miniature_image_url;

  // Combine gallery images: Active colorway variant image comes FIRST as the main featured stage image!
  const galleryImages = [
    activeVariantImage || product.primary_image_url,
    ...(selectedVariant?.gallery_images || []),
    ...(activeVariantImage && activeVariantImage !== product.primary_image_url ? [product.primary_image_url] : []),
    ...(product.images?.map((i) => i.image_url) || []),
  ].filter(Boolean) as string[];

  // Price calculations
  const currentPrice = selectedVariant?.price_override ?? product.price;
  const currentSalePrice = product.sale_price;
  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a footwear size.');
      return;
    }

    addToCart({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      categoryName: product.category?.name,
      variantId: selectedVariant?.id || 'standard-variant',
      colorName: selectedVariant?.color_name || 'Standard',
      miniatureImageUrl: selectedVariant?.miniature_image_url || product.primary_image_url,
      primaryImageUrl: galleryImages[0] || product.primary_image_url,
      size: selectedSize,
      price: currentSalePrice ?? currentPrice,
      quantity,
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const comfortBadges = [
    { icon: Feather, label: 'Lightweight Comfort' },
    { icon: Layers, label: 'Cushioned Footbed' },
    { icon: ShieldCheck, label: 'Premium Materials' },
    { icon: Sparkles, label: 'Built for Everyday' },
  ];

  return (
    <>
      <Header />

      <main className="bg-white min-h-screen pb-20">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <nav className="flex items-center space-x-2 text-xs text-meow-subtle">
            <Link href="/" className="hover:text-meow-dark transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/shop" className="hover:text-meow-dark transition-colors">
              Shop
            </Link>
            {product.category && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link
                  href={`/shop?category=${product.category.slug}`}
                  className="hover:text-meow-dark transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3" />
            <span className="text-meow-dark font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>

        {/* Main Product Layout (Desktop 2-columns matching PDF page 4) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left: Gallery + Feature Badges */}
            <div className="lg:col-span-7 space-y-8">
              <ProductGallery images={galleryImages} productName={product.name} />

              {/* 4 Comfort Badges below Gallery */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-meow-border">
                {comfortBadges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={badge.label}
                      className="p-3 rounded-lg border border-meow-border bg-[#FAF9F6] flex flex-col items-center text-center space-y-1.5"
                    >
                      <Icon className="w-5 h-5 text-meow-dark stroke-[1.5]" />
                      <span className="text-[11px] font-semibold text-meow-dark leading-tight">
                        {badge.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Product Purchase Controls */}
            <div className="lg:col-span-5 space-y-6">
              {/* Best Seller Badge & Title */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  {product.is_bestseller ? (
                    <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-meow-terracotta">
                      BEST SELLER
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-meow-subtle">
                      {product.category?.name || 'MEOW FOOTWEAR'}
                    </span>
                  )}

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-2 text-meow-dark hover:opacity-75 transition-opacity"
                    aria-label="Wishlist toggle"
                  >
                    <Heart
                      className={`w-5 h-5 stroke-[1.5] ${
                        isFavorited ? 'fill-red-500 text-red-500' : 'text-meow-dark'
                      }`}
                    />
                  </button>
                </div>

                <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-meow-dark leading-tight">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-meow-dark font-sans">
                    {formatPrice(currentSalePrice ?? currentPrice)}
                  </span>
                  {currentSalePrice && (
                    <span className="text-sm text-meow-subtle line-through font-sans">
                      {formatPrice(currentPrice)}
                    </span>
                  )}
                  <span className="text-xs text-meow-subtle">inclusive of all taxes</span>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-meow-muted leading-relaxed font-sans">
                  {product.description}
                </p>
              </div>

              {/* MANDATORY REQUIREMENT: Miniature Footwear Images Representing Color Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="pt-4 border-t border-meow-border">
                  <MiniatureVariantSelector
                    variants={product.variants}
                    selectedVariant={selectedVariant}
                    onSelectVariant={(variant) => setSelectedVariant(variant)}
                  />
                </div>
              )}

              {/* Size Selector */}
              <div className="pt-4 border-t border-meow-border">
                <SizeSelector
                  sizes={selectedVariant?.available_sizes || product.sizes}
                  selectedSize={selectedSize}
                  onSelectSize={(sz) => setSelectedSize(sz)}
                  onOpenSizeGuide={() => setSizeGuideOpen(true)}
                />
              </div>

              {/* Quantity Selector */}
              <div className="pt-4 border-t border-meow-border flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-meow-dark">
                  Quantity
                </span>
                <div className="flex items-center border border-meow-border rounded">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 px-3 text-meow-dark hover:bg-meow-surface transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-meow-dark">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 px-3 text-meow-dark hover:bg-meow-surface transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="pt-4 space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-meow-dark text-white text-xs uppercase tracking-widest font-semibold hover:bg-meow-dark/85 transition-all flex items-center justify-center gap-2 shadow-sm rounded"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 border-2 border-meow-dark text-meow-dark text-xs uppercase tracking-widest font-semibold hover:bg-meow-dark hover:text-white transition-all flex items-center justify-center gap-2 rounded"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now (Instant WhatsApp)</span>
                </button>

                {addedToast && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded flex items-center gap-2 animate-fade-in-up">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Added to shopping bag! Order ready for checkout.</span>
                  </div>
                )}
              </div>

              {/* Accordions: Description, Specifications, Shipping, Care */}
              <ProductAccordion
                description={product.description}
                specifications={product.specifications}
              />
            </div>
          </div>
        </div>

        {/* Editorial Story Banner below product details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="relative rounded-2xl overflow-hidden border border-meow-border bg-gradient-to-r from-[#F5F2EB] to-[#ECE8E1] p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.7),transparent_70%)] pointer-events-none" />
            <div className="relative z-10 space-y-2 max-w-lg">
              <span className="text-xs uppercase tracking-[0.25em] text-meow-subtle font-semibold">
                ANATOMICAL ARCHITECTURE
              </span>
              <h3 className="font-editorial text-3xl sm:text-4xl font-medium text-meow-dark">
                Every Step A Story
              </h3>
              <p className="text-xs sm:text-sm text-meow-muted leading-relaxed">
                Minimal design. Maximum comfort. Handcrafted with sustainably harvested cork, feather-density EVA, and premium vegan straps.
              </p>
            </div>
            <div className="relative z-10">
              <Link
                href="/about"
                className="inline-flex px-8 py-3.5 bg-meow-dark text-white text-xs uppercase tracking-widest font-semibold hover:bg-meow-dark/85 shadow-md"
              >
                Learn Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* Recommended Footwear */}
        {relatedProducts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-12 border-t border-meow-border">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-meow-subtle block mb-1">
                  YOU MAY ALSO LIKE
                </span>
                <h2 className="font-editorial text-3xl font-medium text-meow-dark">
                  Complete Your Rotation
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-xs uppercase tracking-widest font-semibold text-meow-dark hover:text-meow-muted transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      <Footer />
    </>
  );
}
