import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CLOUDINARY_HERO_VIDEO = 'https://res.cloudinary.com/k7t4skr1/video/upload/v1793007834/meow/hero/desktop/qlqsgtcvyihqq2bsnu0s.mp4';

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase server not configured' }, { status: 503 });
    }

    const { data: rows, error } = await supabase
      .from('hero_banners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching hero banner from Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let data = rows && rows.length > 0
      ? rows.find(r => r.desktop_video_url && !r.desktop_video_url.includes('mixkit.co')) || rows[0]
      : null;

    if (data) {
      // Purge any legacy mock media or mistakenly assigned preloader video from hero banner
      const hasMockVideo = data.desktop_video_url?.includes('mixkit.co') || data.mobile_video_url?.includes('mixkit.co');
      const hasPreloaderVideo = data.desktop_video_url?.includes('1793086833851');
      const hasMockPoster = data.poster_image_url?.includes('unsplash.com');

      if (hasMockVideo || hasMockPoster || hasPreloaderVideo) {
        const cleanPayload = {
          desktop_video_url: (hasMockVideo || hasPreloaderVideo) ? CLOUDINARY_HERO_VIDEO : data.desktop_video_url,
          mobile_video_url: hasMockVideo ? null : data.mobile_video_url,
          poster_image_url: hasMockPoster ? null : data.poster_image_url,
        };
        await supabase.from('hero_banners').update(cleanPayload).eq('id', data.id);
        data.desktop_video_url = cleanPayload.desktop_video_url;
        data.mobile_video_url = cleanPayload.mobile_video_url;
        data.poster_image_url = cleanPayload.poster_image_url;
      }

      if (!data.desktop_video_url) {
        data.desktop_video_url = CLOUDINARY_HERO_VIDEO;
      }
    }

    return NextResponse.json({ hero: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const payload = {
      badge: body.badge || 'SPRING / SUMMER',
      heading: body.heading || 'THE ART OF DRESSING WELL',
      subtitle: body.subtitle || 'Quiet confidence. Timeless comfort.',
      cta_text: body.cta_text || 'DISCOVER THE COLLECTION',
      cta_link: body.cta_link || '/shop',
      desktop_video_url: body.desktop_video_url ? body.desktop_video_url.trim() : null,
      mobile_video_url: body.mobile_video_url ? body.mobile_video_url.trim() : null,
      poster_image_url: body.poster_image_url ? body.poster_image_url.trim() : null,
      is_published: body.is_published ?? true,
      updated_at: new Date().toISOString(),
    };

    // 1. Always write to persistent disk backup first
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const settingsDir = path.join(process.cwd(), 'public', 'settings');
      await fs.mkdir(settingsDir, { recursive: true });
      await fs.writeFile(path.join(settingsDir, 'hero.json'), JSON.stringify(payload, null, 2), 'utf-8');
    } catch (_) {}

    // 2. Also update Supabase if configured
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ success: true, hero: payload });
    }

    // Check if a row already exists in hero_banners table
    const { data: existingRows, error: checkError } = await supabase
      .from('hero_banners')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1);

    if (checkError) {
      console.warn('Check existing hero banner error:', checkError);
    }

    const existingId = existingRows && existingRows.length > 0 ? existingRows[0].id : null;

    let result = payload;
    if (existingId) {
      const { data, error } = await supabase
        .from('hero_banners')
        .update(payload)
        .eq('id', existingId)
        .select()
        .single();

      if (!error && data) {
        result = data;
      }
    } else {
      const { data, error } = await supabase
        .from('hero_banners')
        .insert(payload)
        .select()
        .single();

      if (!error && data) {
        result = data;
      }
    }

    return NextResponse.json({ success: true, hero: result });
  } catch (error: any) {
    console.error('API /api/admin/hero error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
