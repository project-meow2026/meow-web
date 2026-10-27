import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const CLOUDINARY_HERO_VIDEO = 'https://res.cloudinary.com/k7t4skr1/video/upload/v1793007834/meow/hero/desktop/qlqsgtcvyihqq2bsnu0s.mp4';

export async function GET() {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const supabase = getSupabaseServerClient();

    const localVideoPath = path.join(process.cwd(), 'public', 'videos', 'hero-desktop-1793086833851.mp4');
    let localFileExists = false;

    try {
      await fs.access(localVideoPath);
      localFileExists = true;
    } catch {
      localFileExists = false;
    }

    let uploadedCloudinaryUrl: string | null = null;

    if (localFileExists && cloudName && apiKey && apiSecret) {
      const fileBuffer = await fs.readFile(localVideoPath);
      const timestamp = Math.round(Date.now() / 1000);
      const folder = 'meow/preloader';
      const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

      const formData = new FormData();
      const blob = new Blob([fileBuffer], { type: 'video/mp4' });
      formData.append('file', blob, 'preloader-intro.mp4');
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folder);

      const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const cData = await res.json();
        uploadedCloudinaryUrl = cData.secure_url || cData.url;

        // Clean up the local video from the project code so it is no longer in git/local filesystem
        try {
          await fs.unlink(localVideoPath);
        } catch (_) {}
      }
    }

    // Update Supabase site_settings and hero_banners to separate them completely
    if (supabase) {
      // 1. Ensure Hero Banner is the authentic 3D footwear film
      const { data: heroRows } = await supabase
        .from('hero_banners')
        .select('id, desktop_video_url')
        .order('created_at', { ascending: false })
        .limit(1);

      if (heroRows && heroRows.length > 0) {
        await supabase
          .from('hero_banners')
          .update({
            desktop_video_url: CLOUDINARY_HERO_VIDEO,
            is_published: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', heroRows[0].id);
      }

      // 2. Ensure Preloader Video setting has the Cloudinary preloader URL
      if (uploadedCloudinaryUrl) {
        await supabase
          .from('site_settings')
          .upsert({
            key: 'preload_video',
            value: {
              is_enabled: true,
              video_url: uploadedCloudinaryUrl,
              auto_close_on_end: true,
              updated_at: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
          });
      }
    }

    return NextResponse.json({
      success: true,
      heroVideo: CLOUDINARY_HERO_VIDEO,
      preloaderVideo: uploadedCloudinaryUrl || 'Cloudinary preloader',
    });
  } catch (err: any) {
    console.error('Migration error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
