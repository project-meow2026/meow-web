import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: 'No supabase' });
    }
    const { data, error } = await supabase.from('hero_banners').select('*');
    return NextResponse.json({ rows: data, error });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
