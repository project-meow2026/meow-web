import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();

    const keyMap: Record<string, string> = {
      shop: 'shop_hero_banner',
      mid: 'mid_page_banner',
      bottom: 'bottom_cta',
      standard: 'the_meow_standard',
    };

    const settingKey = keyMap[type] || type;

    // 1. Always write to disk backup in public/settings/banners.json
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const settingsDir = path.join(process.cwd(), 'public', 'settings');
      await fs.mkdir(settingsDir, { recursive: true });
      const bannersPath = path.join(settingsDir, 'banners.json');
      let currentBanners: Record<string, any> = {};
      try {
        const raw = await fs.readFile(bannersPath, 'utf-8');
        currentBanners = JSON.parse(raw);
      } catch (_) {}
      currentBanners[settingKey] = data;
      await fs.writeFile(bannersPath, JSON.stringify(currentBanners, null, 2), 'utf-8');
    } catch (_) {}

    // 2. Also upsert to Supabase site_settings if configured
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.from('site_settings').upsert(
        {
          key: settingKey,
          value: data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );
      if (error) {
        console.warn('Supabase error saving banner setting:', error.message);
      }
    }

    return NextResponse.json({ success: true, key: settingKey, data });
  } catch (err: any) {
    console.error('API /api/admin/banners error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
