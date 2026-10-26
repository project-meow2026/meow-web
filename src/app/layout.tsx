import type { Metadata } from 'next';
import '@/styles/globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CartDrawer } from '@/components/layout/CartDrawer';

export const metadata: Metadata = {
  title: 'MEOW — The Art of Dressing Well | Minimal Luxury Footwear',
  description:
    'Experience quiet confidence and timeless comfort with MEOW Footwear. Handcrafted anatomical footbeds, ultra-lightweight EVA, and minimalist aesthetics.',
  keywords: [
    'MEOW',
    'MEOW Footwear',
    'luxury footwear',
    'anatomical cork sandals',
    'EVA comfort slides',
    'double density footwear',
    'women sandals',
    'kids footwear',
  ],
  authors: [{ name: 'MEOW Footwear' }],
  openGraph: {
    title: 'MEOW — The Art of Dressing Well',
    description: 'Quiet confidence. Timeless comfort. Handcrafted minimalist footwear.',
    url: 'https://mymeow.in',
    siteName: 'MEOW Footwear',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: any;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-meow-dark antialiased min-h-screen flex flex-col selection:bg-meow-dark selection:text-white">
        <CartProvider>
          <WishlistProvider>
            {children}
            <CartDrawer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
