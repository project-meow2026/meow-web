import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { INITIAL_MEOW_CATEGORIES } from '@/lib/storage/db';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const NO_CACHE_HEADERS = { 'Cache-Control': 'no-store, no-cache, must-revalidate' };

// GET: Fetch all categories
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ categories: INITIAL_MEOW_CATEGORIES }, { headers: NO_CACHE_HEADERS });
    }

    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('active') === 'true';

    let query = supabase.from('categories').select('*').order('display_order', { ascending: true });
    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('API /api/categories GET error:', error);
      return NextResponse.json({ categories: INITIAL_MEOW_CATEGORIES }, { headers: NO_CACHE_HEADERS });
    }

    if (data && data.length > 0) {
      return NextResponse.json({ categories: data }, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({ categories: INITIAL_MEOW_CATEGORIES }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error('Error in /api/categories GET:', err);
    return NextResponse.json({ categories: INITIAL_MEOW_CATEGORIES }, { headers: NO_CACHE_HEADERS });
  }
}

// POST: Upsert category with service role key (bypasses RLS and safely resolves UUIDs)
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase server not configured' }, { status: 503 });
    }

    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload: Record<string, any> = {
      name: body.name.trim(),
      slug: slug.trim(),
      description: body.description || '',
      sketch_image_url: body.sketch_image_url || null,
      banner_image_url: body.banner_image_url || null,
      display_order: Number(body.display_order) || 1,
      is_active: body.is_active ?? true,
      updated_at: new Date().toISOString(),
    };

    // Check if category exists either by valid UUID id or by slug
    let existingCategory: { id: string } | null = null;

    if (body.id && UUID_REGEX.test(body.id)) {
      const { data } = await supabase.from('categories').select('id').eq('id', body.id).maybeSingle();
      if (data) existingCategory = data;
    }

    if (!existingCategory && slug) {
      const { data } = await supabase.from('categories').select('id').eq('slug', slug).maybeSingle();
      if (data) existingCategory = data;
    }

    let savedData;
    if (existingCategory) {
      // Update existing category
      const { data, error } = await supabase
        .from('categories')
        .update(payload)
        .eq('id', existingCategory.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating category in Supabase:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      savedData = data;
    } else {
      // Insert new category
      const { data, error } = await supabase
        .from('categories')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error('Error inserting category in Supabase:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      savedData = data;
    }

    return NextResponse.json({ success: true, category: savedData });
  } catch (err: any) {
    console.error('API /api/categories POST error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

// DELETE: Delete category by id or slug
export async function DELETE(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase server not configured' }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json({ error: 'Category id or slug required' }, { status: 400 });
    }

    let query = supabase.from('categories').delete();
    if (id && UUID_REGEX.test(id)) {
      query = query.eq('id', id);
    } else if (slug) {
      query = query.eq('slug', slug);
    } else if (id) {
      query = query.eq('slug', id);
    }

    const { error } = await query;
    if (error) {
      console.error('Error deleting category from Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API /api/categories DELETE error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
