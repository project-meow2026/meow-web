import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { INITIAL_HERO_BANNER } from '@/lib/storage/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const CLOUDINARY_HERO_VIDEO = 'https://res.cloudinary.com/k7t4skr1/video/upload/v1793007834/meow/hero/desktop/qlqsgtcvyihqq2bsnu0s.mp4';

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { hero: { ...INITIAL_HERO_BANNER, desktop_video_url: CLOUDINARY_HERO_VIDEO } },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
      );
    }

    // Fetch all rows to find the one with active video and eliminate duplicate discrepancies
    const { data: rows, error } = await supabase
      .from('hero_banners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('API /api/hero GET error:', error);
      return NextResponse.json(
        { hero: { ...INITIAL_HERO_BANNER, desktop_video_url: CLOUDINARY_HERO_VIDEO } },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
      );
    }

    let activeBanner = null;

    if (rows && rows.length > 0) {
      // Find row with non-empty desktop_video_url or mobile_video_url
      activeBanner = rows.find(
        (r) =>
          (r.desktop_video_url && !r.desktop_video_url.includes('mixkit.co')) ||
          (r.mobile_video_url && !r.mobile_video_url.includes('mixkit.co'))
      );

      // If none found with video, take the latest row
      if (!activeBanner) {
        activeBanner = rows[0];
      }
      // If hero banner had the preloader video mistakenly assigned to it, restore hero banner and update preloader setting
      if (activeBanner?.desktop_video_url && activeBanner.desktop_video_url.includes('1793086833851')) {
        const preloaderUploadedUrl = activeBanner.desktop_video_url;
        try {
          await supabase
            .from('hero_banners')
            .update({ desktop_video_url: CLOUDINARY_HERO_VIDEO, updated_at: new Date().toISOString() })
            .eq('id', activeBanner.id);

          await supabase
            .from('site_settings')
            .upsert({
              key: 'preload_video',
              value: { is_enabled: true, video_url: preloaderUploadedUrl, auto_close_on_end: true, updated_at: new Date().toISOString() },
              updated_at: new Date().toISOString(),
            });
        } catch (_) {}

        activeBanner.desktop_video_url = CLOUDINARY_HERO_VIDEO;
      }
    }

    const videoUrl =
      (activeBanner?.desktop_video_url && !activeBanner.desktop_video_url.includes('mixkit.co') && !activeBanner.desktop_video_url.startsWith('/videos/'))
        ? activeBanner.desktop_video_url
        : CLOUDINARY_HERO_VIDEO;

    const sanitized = {
      ...(activeBanner || INITIAL_HERO_BANNER),
      desktop_video_url: videoUrl,
      mobile_video_url: activeBanner?.mobile_video_url?.includes('mixkit.co') ? null : activeBanner?.mobile_video_url || null,
      poster_image_url: activeBanner?.poster_image_url?.includes('unsplash.com') ? null : activeBanner?.poster_image_url || null,
      is_published: true,
    };

    // Ensure database rows have the active video so future direct queries also see it
    if (activeBanner && (!activeBanner.desktop_video_url || activeBanner.desktop_video_url !== videoUrl)) {
      try {
        await supabase
          .from('hero_banners')
          .update({ desktop_video_url: videoUrl, is_published: true, updated_at: new Date().toISOString() })
          .eq('id', activeBanner.id);
      } catch (_) {}
    }

    return NextResponse.json(
      { hero: sanitized },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (err: any) {
    console.error('Error in /api/hero GET:', err);
    return NextResponse.json(
      { hero: { ...INITIAL_HERO_BANNER, desktop_video_url: CLOUDINARY_HERO_VIDEO } },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  }
}
