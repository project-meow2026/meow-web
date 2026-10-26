import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'desktop';

    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure public/videos directory exists
    const videosDir = path.join(process.cwd(), 'public', 'videos');
    await fs.mkdir(videosDir, { recursive: true });

    // Clean filename
    const ext = path.extname(file.name) || '.mp4';
    const filename = `hero-${type}-${Date.now()}${ext}`;
    const filePath = path.join(videosDir, filename);

    await fs.writeFile(filePath, buffer);

    const videoUrl = `/videos/${filename}`;

    // Immediately update Supabase database using service role client
    const supabase = getSupabaseServerClient();
    let heroRecord = null;

    if (supabase) {
      const { data: existingRows } = await supabase
        .from('hero_banners')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1);

      const existingId = existingRows && existingRows.length > 0 ? existingRows[0].id : null;
      const column = type === 'desktop' ? 'desktop_video_url' : 'mobile_video_url';

      if (existingId) {
        const { data, error } = await supabase
          .from('hero_banners')
          .update({
            [column]: videoUrl,
            is_published: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingId)
          .select()
          .single();

        if (error) console.error('Supabase update error in upload-video:', error);
        heroRecord = data;
      } else {
        const { data, error } = await supabase
          .from('hero_banners')
          .insert({
            badge: 'SPRING / SUMMER',
            heading: 'THE ART OF DRESSING WELL',
            subtitle: 'Quiet confidence. Timeless comfort.',
            cta_text: 'DISCOVER THE COLLECTION',
            cta_link: '/shop',
            [column]: videoUrl,
            is_published: true,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) console.error('Supabase insert error in upload-video:', error);
        heroRecord = data;
      }
    }

    return NextResponse.json({
      success: true,
      url: videoUrl,
      hero: heroRecord,
    });
  } catch (err: any) {
    console.error('Error saving video in /api/upload-video:', err);
    return NextResponse.json({ error: err.message || 'Failed to save video' }, { status: 500 });
  }
}
