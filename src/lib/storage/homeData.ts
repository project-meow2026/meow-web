import { getSupabaseServerClient } from '@/lib/supabase/server';
import { 
  INITIAL_HERO_BANNER, 
  INITIAL_PRELOAD_VIDEO, 
  INITIAL_MID_PAGE_BANNER,
  INITIAL_BOTTOM_CTA,
  INITIAL_THE_MEOW_STANDARD,
  INITIAL_MEOW_CATEGORIES,
} from '@/lib/storage/db';
import { 
  Category, 
  Product, 
  HeroBanner, 
  PreloadVideoSetting,
  MidPageBannerSetting,
  BottomCtaSetting,
  TheMeowStandardSetting 
} from '@/lib/supabase/types';
import fs from 'fs/promises';
import path from 'path';

export interface HomeServerData {
  categories: Category[];
  products: Product[];
  heroBanner: HeroBanner;
  preloadVideo: PreloadVideoSetting;
  midBanner: MidPageBannerSetting;
  bottomCta: BottomCtaSetting;
  standardBanner: TheMeowStandardSetting;
}

export async function getHomeServerData(): Promise<HomeServerData> {
  let categories: Category[] = INITIAL_MEOW_CATEGORIES;
  let products: Product[] = [];
  let heroBanner: HeroBanner = INITIAL_HERO_BANNER;
  let preloadVideo: PreloadVideoSetting = INITIAL_PRELOAD_VIDEO;
  let midBanner: MidPageBannerSetting = INITIAL_MID_PAGE_BANNER;
  let bottomCta: BottomCtaSetting = INITIAL_BOTTOM_CTA;
  let standardBanner: TheMeowStandardSetting = INITIAL_THE_MEOW_STANDARD;

  // 1. Read persistent disk cache first (fast, reliable, survives restarts)
  try {
    const settingsDir = path.join(process.cwd(), 'public', 'settings');
    const preloadPath = path.join(settingsDir, 'preload-video.json');
    const heroPath = path.join(settingsDir, 'hero.json');
    const bannersPath = path.join(settingsDir, 'banners.json');

    const [preloadRaw, heroRaw, bannersRaw] = await Promise.all([
      fs.readFile(preloadPath, 'utf-8').catch(() => null),
      fs.readFile(heroPath, 'utf-8').catch(() => null),
      fs.readFile(bannersPath, 'utf-8').catch(() => null),
    ]);

    if (preloadRaw) {
      const parsed = JSON.parse(preloadRaw);
      if (parsed?.video_url) preloadVideo = parsed;
    }
    if (heroRaw) {
      const parsed = JSON.parse(heroRaw);
      if (parsed) heroBanner = parsed;
    }
    if (bannersRaw) {
      const parsed = JSON.parse(bannersRaw);
      if (parsed?.mid_page_banner) midBanner = parsed.mid_page_banner;
      if (parsed?.bottom_cta) bottomCta = parsed.bottom_cta;
      if (parsed?.the_meow_standard) standardBanner = parsed.the_meow_standard;
    }
  } catch (fsErr) {
    console.warn('Could not read settings from disk:', fsErr);
  }

  // 2. Query Supabase for latest live admin content
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const [catRes, prodRes, heroRes, settingsRes] = await Promise.all([
        supabase.from('categories').select('*').eq('is_active', true).order('display_order', { ascending: true }),
        supabase.from('products').select('*, category:categories(*), variants:product_variants(*)').eq('is_active', true),
        supabase.from('hero_banners').select('*').order('created_at', { ascending: false }).limit(1),
        supabase.from('site_settings').select('key, value').in('key', ['preload_video', 'mid_page_banner', 'bottom_cta', 'the_meow_standard']),
      ]);

      if (catRes.data && catRes.data.length > 0) {
        categories = catRes.data as Category[];
      }
      if (prodRes.data && prodRes.data.length > 0) {
        products = prodRes.data as Product[];
      }
      if (heroRes.data && heroRes.data.length > 0) {
        heroBanner = heroRes.data[0] as HeroBanner;
      }
      if (settingsRes.data && settingsRes.data.length > 0) {
        for (const row of settingsRes.data) {
          if (row.key === 'preload_video' && row.value?.video_url) {
            preloadVideo = row.value as PreloadVideoSetting;
          } else if (row.key === 'mid_page_banner' && row.value) {
            midBanner = row.value as MidPageBannerSetting;
          } else if (row.key === 'bottom_cta' && row.value) {
            bottomCta = row.value as BottomCtaSetting;
          } else if (row.key === 'the_meow_standard' && row.value) {
            standardBanner = row.value as TheMeowStandardSetting;
          }
        }
      }
    } catch (dbErr) {
      console.warn('Error querying Supabase for home data:', dbErr);
    }
  }

  return {
    categories,
    products,
    heroBanner,
    preloadVideo,
    midBanner,
    bottomCta,
    standardBanner,
  };
}
