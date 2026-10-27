import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { INITIAL_PRELOAD_VIDEO } from '@/lib/storage/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const CLOUDINARY_HERO_VIDEO = 'https://res.cloudinary.com/k7t4skr1/video/upload/v1793007834/meow/hero/desktop/qlqsgtcvyihqq2bsnu0s.mp4';
    let videoSetting: any = null;

    // 1. Try Supabase
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'preload_video')
        .single();

      if (data?.value?.video_url?.trim()) {
        const raw = data.value.video_url.trim();
        if (raw !== CLOUDINARY_HERO_VIDEO && !raw.includes('hero-desktop')) {
          videoSetting = data.value;
        }
      }
    }

    // 2. Try server disk file fallback
    if (!videoSetting) {
      try {
        const filePath = path.join(process.cwd(), 'public', 'settings', 'preload-video.json');
        const content = await fs.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(content);
        if (parsed?.video_url?.trim()) {
          videoSetting = parsed;
        }
      } catch (_) {}
    }

    return NextResponse.json(
      { preloadVideo: videoSetting || INITIAL_PRELOAD_VIDEO },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (err: any) {
    console.error('Error fetching preload-video:', err);
    return NextResponse.json(
      { preloadVideo: INITIAL_PRELOAD_VIDEO },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  }
}
