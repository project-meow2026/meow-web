import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Guaranteed server filesystem persistence
    try {
      const settingsDir = path.join(process.cwd(), 'public', 'settings');
      await fs.mkdir(settingsDir, { recursive: true });
      await fs.writeFile(
        path.join(settingsDir, 'preload-video.json'),
        JSON.stringify(body, null, 2),
        'utf-8'
      );
    } catch (fsErr) {
      console.warn('Could not save preload-video.json to disk:', fsErr);
    }

    // 2. Supabase database persistence
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'preload_video',
            value: body,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );

      if (error) {
        console.warn('Supabase upsert preload_video warning:', error.message);
      }
    }

    return NextResponse.json({ success: true, preloadVideo: body });
  } catch (err: any) {
    console.error('Error saving admin preload-video:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
