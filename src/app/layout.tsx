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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var p = window.location.pathname;
                  if (p !== '/' && p !== '') return;
                  var isReload = false;
                  if (window.performance) {
                    var nav = window.performance.getEntriesByType && window.performance.getEntriesByType('navigation')[0];
                    if (nav && nav.type === 'reload') isReload = true;
                    else if (window.performance.navigation && window.performance.navigation.type === 1) isReload = true;
                  }
                  var seen = false;
                  try {
                    seen = sessionStorage.getItem('meow_preloader_seen') === 'true';
                  } catch(e) {}
                  if (!isReload && !seen) {
                    document.documentElement.classList.add('meow-preloading');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html.meow-preloading {
                background-color: #FFFFFF !important;
                overflow: hidden !important;
              }
              html.meow-preloading body {
                background-color: #FFFFFF !important;
              }
              /* Hide website completely when opening fresh so it NEVER blinks or shows first */
              html.meow-preloading #meow-website-root {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
              }
              /* Show preloader video immediately from frame 0 */
              html.meow-preloading #meow-preloader-root {
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
              }
              #meow-preloader-root {
                display: none;
              }
            `,
          }}
        />
      </head>
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
