'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils/formatters';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, subtotal, itemCount } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-meow-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-meow-dark" />
              <h2 className="text-base font-semibold uppercase tracking-wider text-meow-dark">
                Shopping Bag ({itemCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-meow-muted hover:text-meow-dark transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-meow-border">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-meow-surface flex items-center justify-center mb-4 text-meow-subtle border border-meow-border">
                  <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
                </div>
                <h3 className="font-editorial text-xl font-medium text-meow-dark mb-1">
                  Your bag is empty
                </h3>
                <p className="text-xs text-meow-muted max-w-xs mb-6">
                  Experience timeless comfort and anatomical support with our handcrafted footwear.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-meow-dark text-white text-xs uppercase tracking-widest font-medium hover:bg-meow-dark/85 transition-colors"
                >
                  <span>Explore Footwear</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.productId}-${item.variantId}-${item.size}`} className="py-4 flex gap-4">
                  {/* Miniature Image */}
                  <div className="w-20 h-20 bg-meow-surface border border-meow-border rounded overflow-hidden flex-shrink-0 relative">
                    {item.miniatureImageUrl || item.primaryImageUrl ? (
                      <img
                        src={item.miniatureImageUrl || item.primaryImageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-meow-subtle">
                        Shoe
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium text-meow-dark leading-snug">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.variantId, item.size)}
                          className="text-meow-subtle hover:text-red-500 transition-colors p-1 -mr-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                        </button>
                      </div>

                      <div className="mt-1 flex items-center gap-3 text-xs text-meow-muted">
                        <span>Color: <strong className="text-meow-dark font-normal">{item.colorName}</strong></span>
                        <span>•</span>
                        <span>Size: <strong className="text-meow-dark font-normal">{item.size}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-meow-border rounded">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.size, item.quantity - 1)}
                          className="p-1 px-2 text-meow-dark hover:bg-meow-surface transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-medium text-meow-dark">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.size, item.quantity + 1)}
                          className="p-1 px-2 text-meow-dark hover:bg-meow-surface transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-semibold text-meow-dark">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout CTA */}
          {items.length > 0 && (
            <div className="border-t border-meow-border px-6 py-5 bg-white space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-meow-muted">
                  <span>Subtotal</span>
                  <span className="font-medium text-meow-dark">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-meow-muted">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-meow-dark pt-2 border-t border-meow-border/60">
                  <span>Total (incl. of all taxes)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-meow-dark text-white text-xs uppercase tracking-widest font-semibold hover:bg-meow-dark/90 transition-colors shadow-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[11px] text-center text-meow-subtle">
                  Seamless order placement directly with MEOW Concierge on WhatsApp
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
