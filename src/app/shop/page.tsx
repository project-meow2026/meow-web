import React from 'react';
import ShopClient from './ShopClient';
import {
  getShopHeroServerData,
  getActiveProductsServerData,
} from '@/lib/storage/pageServerData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ShopPage() {
  // Load hero banner + products on the server so images are in the initial HTML
  const [hero, products] = await Promise.all([
    getShopHeroServerData(),
    getActiveProductsServerData(),
  ]);
  return <ShopClient initialHero={hero} initialProducts={products} />;
}

