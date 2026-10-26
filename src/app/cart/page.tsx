'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils/formatters';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, itemCount } = useCart();

  return (
    <>
      <Header />

      <main className="bg-white min-h-screen py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pb-6 border-b border-meow-border mb-8">
            <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-meow-dark tracking-tight">
              Your Shopping Bag
            </h1>
            <p className="text-xs text-meow-muted mt-1">
              Review your selected handcrafted footwear before WhatsApp confirmation.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-meow-border rounded-xl p-8 bg-meow-surface max-w-lg mx-auto">
              <ShoppingBag className="w-12 h-12 text-meow-subtle mx-auto mb-4 stroke-[1.2]" />
              <h2 className="font-editorial text-2xl font-medium text-meow-dark mb-2">
                Your bag is currently empty
              </h2>
              <p className="text-xs text-meow-muted mb-6">
                Discover our signature anatomical cork and lightweight EVA footwear.
              </p>
              <Link
                href="/shop"
                className="inline-flex px-8 py-3 bg-meow-dark text-white text-xs uppercase tracking-widest font-semibold hover:bg-meow-dark/85"
              >
                Shop Footwear
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Items List */}
              <div className="lg:col-span-8 divide-y divide-meow-border border border-meow-border rounded-xl p-4 sm:p-6 bg-white">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId}-${item.size}`}
                    className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-20 bg-meow-surface border border-meow-border rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.miniatureImageUrl || item.primaryImageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-meow-dark">
                          {item.productName}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-meow-muted">
                          <span>Color: <strong className="text-meow-dark font-normal">{item.colorName}</strong></span>
                          <span>•</span>
                          <span>Size: <strong className="text-meow-dark font-normal">{item.size}</strong></span>
                        </div>
                        <span className="text-xs text-meow-subtle block">
                          Unit: {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                      <div className="flex items-center border border-meow-border rounded">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.size, item.quantity - 1)}
                          className="p-1 px-2.5 text-meow-dark hover:bg-meow-surface"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-meow-dark">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.size, item.quantity + 1)}
                          className="p-1 px-2.5 text-meow-dark hover:bg-meow-surface"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-meow-dark min-w-[80px] text-right">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.variantId, item.size)}
                        className="text-meow-subtle hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-4 space-y-6">
                <div className="border border-meow-border rounded-xl p-6 bg-[#FAF9F6] space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-meow-dark pb-3 border-b border-meow-border">
                    Order Summary
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-meow-muted">
                      <span>Items ({itemCount})</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-meow-muted">
                      <span>Shipping</span>
                      <span className="text-green-600 font-semibold">FREE</span>
                    </div>
                    <div className="flex justify-between text-meow-muted">
                      <span>GST</span>
                      <span>Included</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-meow-dark pt-3 border-t border-meow-border">
                      <span>Total</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-meow-dark text-white text-xs uppercase tracking-widest font-semibold hover:bg-meow-dark/85 shadow-md"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
