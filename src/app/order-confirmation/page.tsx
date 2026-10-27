'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  MessageCircle,
  PackageCheck,
  ArrowRight,
  Clock,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { dbService } from '@/lib/storage/db';
import { Order } from '@/lib/supabase/types';
import { formatPrice } from '@/lib/utils/formatters';
import { getWhatsAppRedirectUrl } from '@/lib/utils/whatsapp';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderRef = searchParams.get('ref');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!orderRef) {
        setLoading(false);
        return;
      }
      try {
        const found = await dbService.getOrderByRef(orderRef);
        setOrder(found);
      } catch (e) {
        console.error('Failed to load order:', e);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderRef]);

  const handleOpenWhatsApp = () => {
    if (order) {
      const url = getWhatsAppRedirectUrl(order);
      window.open(url, '_blank');
    }
  };

  return (
    <>
      <Header />

      <main className="bg-white min-h-screen py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Header Status */}
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs uppercase tracking-[0.25em] text-meow-subtle block font-sans">
              ORDER INITIATED
            </span>

            <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-meow-dark tracking-tight">
              Thank You for Your MEOW Order
            </h1>

            {orderRef && (
              <div className="inline-block px-4 py-2 bg-[#FAF9F6] border border-meow-border rounded font-mono text-sm font-bold text-meow-dark tracking-wider">
                Ref: {orderRef}
              </div>
            )}
          </div>

          {/* WhatsApp Action Callout Card */}
          <div className="bg-[#25D366]/10 border border-[#25D366]/40 rounded-xl p-6 sm:p-8 text-left space-y-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-[#128C7E] flex-shrink-0" />
              <h2 className="text-base font-semibold text-[#075E54]">
                Next Step: Confirm on WhatsApp
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#075E54] leading-relaxed">
              Your order has been safely saved in our system. To finalize dispatch and delivery scheduling, please confirm your order with our concierge on WhatsApp.
            </p>
            <button
              onClick={handleOpenWhatsApp}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs uppercase tracking-widest font-bold rounded shadow transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Send WhatsApp Confirmation Message</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Order Details Preview */}
          {order && (
            <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white text-left space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-meow-dark pb-3 border-b border-meow-border">
                Order Summary
              </h3>

              <div className="space-y-4 text-xs">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-meow-border/60">
                    <div className="flex items-center gap-3">
                      {item.miniature_image_url && (
                        <img
                          src={item.miniature_image_url}
                          alt={item.product_name}
                          className="w-12 h-12 rounded object-cover border border-meow-border"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold text-meow-dark">{item.product_name}</h4>
                        <span className="text-meow-muted">
                          Color: {item.variant_color} | Size: {item.size} | Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-meow-dark font-mono">
                      {formatPrice(item.total_price)}
                    </span>
                  </div>
                ))}

                <div className="pt-2 space-y-1">
                  <div className="flex justify-between text-meow-muted">
                    <span>Delivery To:</span>
                    <span className="font-medium text-meow-dark text-right">
                      {order.customer_name} ({order.customer_phone})<br />
                      {order.address}, {order.city}, {order.state} - {order.postal_code}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-meow-dark pt-3 border-t border-meow-border">
                    <span>Total Amount</span>
                    <span className="font-mono">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="px-8 py-3 bg-meow-dark text-white text-xs uppercase tracking-widest font-semibold hover:bg-meow-dark/85 shadow-sm"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="px-8 py-3 border border-meow-border text-meow-dark text-xs uppercase tracking-widest font-semibold hover:bg-meow-surface"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export const dynamic = 'force-dynamic';

export default function OrderConfirmationPage() {
  return (
    <React.Suspense
      fallback={
        <>
          <Header />
          <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
            <div className="w-8 h-8 border-2 border-meow-dark border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs uppercase tracking-widest text-meow-muted">Loading order confirmation...</p>
          </div>
          <Footer />
        </>
      }
    >
      <OrderConfirmationContent />
    </React.Suspense>
  );
}
