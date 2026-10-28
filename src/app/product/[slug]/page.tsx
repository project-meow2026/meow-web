import React from 'react';
import ProductClient from './ProductClient';
import { getProductBySlugServerData } from '@/lib/storage/pageServerData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { color?: string; variant?: string };
}) {
  // Load product on the server so the main gallery image is in the initial HTML
  const product = await getProductBySlugServerData(params.slug);
  return (
    <ProductClient
      params={params}
      initialProduct={product}
      initialColor={searchParams?.color}
      initialVariantId={searchParams?.variant}
    />
  );
}

