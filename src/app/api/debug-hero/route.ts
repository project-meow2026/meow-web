import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: 'No supabase' });
    }
    const { data: heroData } = await supabase.from('hero_banners').select('*');
    const { data: settingsData } = await supabase.from('site_settings').select('*');
    return NextResponse.json({ hero: heroData, settings: settingsData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
