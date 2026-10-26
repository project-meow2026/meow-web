'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';

export default function CheckoutPage() {
  return (
    <>
      <Header />

      <main className="bg-white min-h-screen">
        <div className="bg-[#FAF9F6] border-b border-meow-border py-8 text-center px-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-meow-subtle block mb-1 font-sans">
            MEOW CHECKOUT
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-meow-dark tracking-tight">
            Confirm Your Footwear Order
          </h1>
        </div>

        <CheckoutForm />
      </main>

      <Footer />
    </>
  );
}
