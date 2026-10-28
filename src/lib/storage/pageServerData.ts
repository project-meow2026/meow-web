import { getSupabaseServerClient } from '@/lib/supabase/server';
import {
  INITIAL_ABOUT_SECTION,
  INITIAL_COLLECTIONS_PAGE,
  INITIAL_SHOP_HERO_BANNER,
} from '@/lib/storage/db';
import {
  AboutSection,
  CollectionsPageSetting,
  ShopHeroBannerSetting,
  Product,
} from '@/lib/supabase/types';
import fs from 'fs/promises';
import path from 'path';

/**
 * Server-side loaders so pages render with real admin content (and image URLs)
 * directly in the initial HTML. This lets the browser start downloading banner
 * images immediately instead of waiting for JS → API → Supabase → image.
 */

async function readDiskJson<T = any>(file: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), 'public', 'settings', file), 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

const ts = (v: any) => (v?.updated_at ? new Date(v.updated_at).getTime() : 0);

/** Reads a site_settings key, preferring whichever (Supabase vs disk) is newer. */
async function getSetting<T = any>(key: string, diskValue: any): Promise<T | null> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('value, updated_at')
        .eq('key', key)
        .maybeSingle();
      if (data?.value) {
        const remote = { ...data.value, updated_at: data.value.updated_at || data.updated_at };
        if (!diskValue || ts(remote) >= ts(diskValue)) return remote as T;
      }
    } catch {}
  }
  return (diskValue as T) || null;
}

export async function getAboutServerData(): Promise<AboutSection> {
  const disk = await readDiskJson('about.json');
  const value = await getSetting<AboutSection>('about_section', disk);
  return { ...INITIAL_ABOUT_SECTION, ...(value || {}) };
}

export async function getCollectionsServerData(): Promise<CollectionsPageSetting> {
  const disk = await readDiskJson('collections.json');
  const value = await getSetting<CollectionsPageSetting>('collections_page', disk);
  return {
    ...INITIAL_COLLECTIONS_PAGE,
    ...(value || {}),
    cards:
      value?.cards && value.cards.length > 0 ? value.cards : INITIAL_COLLECTIONS_PAGE.cards,
  };
}

export async function getShopHeroServerData(): Promise<ShopHeroBannerSetting> {
  const disk = await readDiskJson<Record<string, any>>('banners.json');
  const value = await getSetting<ShopHeroBannerSetting>('shop_hero_banner', disk?.shop_hero_banner);
  return value || INITIAL_SHOP_HERO_BANNER;
}

export async function getActiveProductsServerData(): Promise<Product[]> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (data && data.length > 0) return data as Product[];
    } catch {}
  }
  const disk = await readDiskJson<Product[]>('products.json');
  return Array.isArray(disk) ? disk.filter((p) => p.is_active !== false) : [];
}

export async function getProductBySlugServerData(slug: string): Promise<Product | null> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(*), images:product_images(*), variants:product_variants(*)')
        .eq('slug', slug)
        .maybeSingle();
      if (data) return data as Product;
    } catch {}
  }
  const disk = await readDiskJson<Product[]>('products.json');
  return (Array.isArray(disk) && disk.find((p) => p.slug === slug)) || null;
}
