import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { INITIAL_PRELOAD_VIDEO } from '@/lib/storage/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ preloadVideo: INITIAL_PRELOAD_VIDEO });
    }

    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'preload_video')
      .single();

    if (error || !data?.value) {
      return NextResponse.json({ preloadVideo: INITIAL_PRELOAD_VIDEO });
    }

    return NextResponse.json({ preloadVideo: data.value });
  } catch (err: any) {
    console.error('Error fetching preload-video:', err);
    return NextResponse.json({ preloadVideo: INITIAL_PRELOAD_VIDEO });
  }
}
