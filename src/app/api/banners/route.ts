import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { 
  INITIAL_MID_PAGE_BANNER, 
  INITIAL_BOTTOM_CTA, 
  INITIAL_THE_MEOW_STANDARD 
} from '@/lib/storage/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    // Ensure exact banner image assets exist in public folder
    const bannerDir = path.join(process.cwd(), 'public', 'images', 'banners');
    const midDest = path.join(bannerDir, 'exact-mid-banner.png');
    const storyDest = path.join(bannerDir, 'exact-story-banner.png');

    try {
      await fs.mkdir(bannerDir, { recursive: true });
      const artifactsDir = 'C:\\Users\\muham\\.gemini\\antigravity-ide\\brain\\b76fff1c-4ba0-4c3c-ba82-492f8ce0a43e\\.user_uploaded';
      await fs.copyFile(path.join(artifactsDir, 'media_1793092828527.png'), midDest).catch(() => {});
      await fs.copyFile(path.join(artifactsDir, 'media_1793092875686.png'), storyDest).catch(() => {});
      await fs.copyFile(path.join(artifactsDir, 'media_1793094418715.png'), path.join(bannerDir, 'bottom-cta-glass-bg.png')).catch(() => {});
    } catch (_) {}

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all';

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      if (type === 'mid') return NextResponse.json({ banner: INITIAL_MID_PAGE_BANNER });
      if (type === 'bottom') return NextResponse.json({ banner: INITIAL_BOTTOM_CTA });
      if (type === 'standard') return NextResponse.json({ banner: INITIAL_THE_MEOW_STANDARD });
      return NextResponse.json({
        mid: INITIAL_MID_PAGE_BANNER,
        bottom: INITIAL_BOTTOM_CTA,
        standard: INITIAL_THE_MEOW_STANDARD,
      });
    }

    if (type === 'mid') {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'mid_page_banner').single();
      return NextResponse.json(
        { banner: data?.value || INITIAL_MID_PAGE_BANNER },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
      );
    }

    if (type === 'bottom') {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'bottom_cta').single();
      return NextResponse.json(
        { banner: data?.value || INITIAL_BOTTOM_CTA },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
      );
    }

    if (type === 'standard') {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'the_meow_standard').single();
      return NextResponse.json(
        { banner: data?.value || INITIAL_THE_MEOW_STANDARD },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
      );
    }

    const { data: rows } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['mid_page_banner', 'bottom_cta', 'the_meow_standard']);

    const map = new Map<string, any>();
    rows?.forEach((r) => map.set(r.key, r.value));

    return NextResponse.json(
      {
        mid: map.get('mid_page_banner') || INITIAL_MID_PAGE_BANNER,
        bottom: map.get('bottom_cta') || INITIAL_BOTTOM_CTA,
        standard: map.get('the_meow_standard') || INITIAL_THE_MEOW_STANDARD,
      },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        mid: INITIAL_MID_PAGE_BANNER,
        bottom: INITIAL_BOTTOM_CTA,
        standard: INITIAL_THE_MEOW_STANDARD,
      },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  }
}
