import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json({ preloadVideo: body, note: 'Saved locally' });
    }

    const { error } = await supabase
      .from('site_settings')
      .upsert({
        key: 'preload_video',
        value: body,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.warn('Supabase upsert preload_video warning:', error.message);
    }

    return NextResponse.json({ success: true, preloadVideo: body });
  } catch (err: any) {
    console.error('Error saving admin preload-video:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
