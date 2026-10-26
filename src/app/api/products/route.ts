import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NO_CACHE_HEADERS = { 'Cache-Control': 'no-store, no-cache, must-revalidate' };

// GET: Fetch products with filters or by id/slug
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ products: [] }, { headers: NO_CACHE_HEADERS });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const admin = searchParams.get('admin') === 'true';
    const activeOnly = searchParams.get('active') === 'true';
    const categorySlug = searchParams.get('categorySlug');
    const bestseller = searchParams.get('bestseller') === 'true';
    const newArrival = searchParams.get('newArrival') === 'true';
    const featured = searchParams.get('featured') === 'true';

    // Single product by ID
    if (id) {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          variants:product_variants(*)
        `);
      if (UUID_REGEX.test(id)) {
        query = query.eq('id', id);
      } else {
        query = query.eq('slug', id);
      }
      const { data, error } = await query.maybeSingle();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
      }
      return NextResponse.json({ product: data }, { headers: NO_CACHE_HEADERS });
    }

    // Single product by slug
    if (slug) {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('slug', slug)
        .maybeSingle();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
      }
      return NextResponse.json({ product: data }, { headers: NO_CACHE_HEADERS });
    }

    // List products
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .order('created_at', { ascending: false });

    if (!admin && activeOnly) {
      query = query.eq('is_active', true);
    }
    if (bestseller) query = query.eq('is_bestseller', true);
    if (newArrival) query = query.eq('is_new_arrival', true);
    if (featured) query = query.eq('is_featured', true);

    const { data, error } = await query;
    if (error) {
      console.warn('API /api/products GET error:', error);
      return NextResponse.json({ products: [] }, { headers: NO_CACHE_HEADERS });
    }

    let products = data || [];

    // Optional category filter by slug
    if (categorySlug) {
      products = products.filter(
        (p: any) => p.category?.slug === categorySlug || p.category_id === categorySlug
      );
    }

    return NextResponse.json({ products }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error('Error in /api/products GET:', err);
    return NextResponse.json({ products: [] }, { headers: NO_CACHE_HEADERS });
  }
}

// POST: Upsert product with service role client (bypasses RLS and safely resolves foreign keys)
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase server not configured' }, { status: 503 });
    }

    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    const {
      id,
      name,
      slug,
      category_id,
      description,
      price,
      sale_price,
      primary_image_url,
      stock,
      sizes,
      highlights,
      specifications,
      is_bestseller,
      is_new_arrival,
      is_featured,
      is_active,
      variants,
      images,
    } = body;

    const cleanSlug =
      (slug || name || '')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-') || `product-${Date.now()}`;

    // Safely resolve category_id to an existing UUID in categories table
    let resolvedCategoryId: string | null = null;
    if (category_id) {
      if (UUID_REGEX.test(category_id)) {
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('id', category_id)
          .maybeSingle();
        if (cat) resolvedCategoryId = cat.id;
      }
      if (!resolvedCategoryId) {
        const { data: catBySlug } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', category_id)
          .maybeSingle();
        if (catBySlug) resolvedCategoryId = catBySlug.id;
      }
    }

    // Check if product already exists either by valid UUID or by slug
    let existingProductId: string | null = null;
    if (id && UUID_REGEX.test(id)) {
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('id', id)
        .maybeSingle();
      if (existing) existingProductId = existing.id;
    }

    if (!existingProductId && cleanSlug) {
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('slug', cleanSlug)
        .maybeSingle();
      if (existing) existingProductId = existing.id;
    }

    const payload = {
      name: name.trim(),
      slug: cleanSlug,
      category_id: resolvedCategoryId,
      description: description || 'Premium handcrafted footwear featuring anatomical comfort footbeds.',
      price: Number(price) || 0,
      sale_price: sale_price ? Number(sale_price) : null,
      primary_image_url: primary_image_url || '',
      stock: Number(stock) || 0,
      sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ['5', '6', '7', '8', '9', '10', '11'],
      highlights:
        Array.isArray(highlights) && highlights.length > 0
          ? highlights
          : ['Lightweight Comfort', 'Cushioned Footbed', 'Premium Materials', 'Built for Everyday'],
      specifications:
        typeof specifications === 'object' && specifications !== null
          ? specifications
          : {
              'Sole Material': 'High-density EVA',
              'Insole': 'Anatomical Cork Footbed',
              'Upper': 'Water-resistant Vegan Nubuck',
              'Closure': 'Dual Adjustable Buckles',
              'Fit': 'True to size',
            },
      is_bestseller: Boolean(is_bestseller),
      is_new_arrival: is_new_arrival ?? true,
      is_featured: Boolean(is_featured),
      is_active: is_active ?? true,
      updated_at: new Date().toISOString(),
    };

    let savedProductId: string;

    if (existingProductId) {
      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', existingProductId)
        .select('id')
        .single();

      if (error) {
        console.error('Error updating product in Supabase:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      savedProductId = data.id;
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert(payload)
        .select('id')
        .single();

      if (error) {
        console.error('Error inserting product in Supabase:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      savedProductId = data.id;
    }

    // Upsert gallery sub-images if provided
    if (Array.isArray(images)) {
      await supabase.from('product_images').delete().eq('product_id', savedProductId);

      const imageRecords = images
        .map((img: any, idx: number) => {
          const url = typeof img === 'string' ? img : img?.image_url;
          if (!url) return null;
          return {
            product_id: savedProductId,
            image_url: url,
            alt_text: `${name} sub-image ${idx + 1}`,
            display_order: idx + 1,
          };
        })
        .filter(Boolean);

      if (imageRecords.length > 0) {
        await supabase.from('product_images').insert(imageRecords);
      }
    }

    // Upsert variants if provided
    if (Array.isArray(variants) && variants.length > 0) {
      // Clear previous variants for this product
      await supabase.from('product_variants').delete().eq('product_id', savedProductId);

      const variantRecords = variants.map((v: any, index: number) => {
        const variantImg = v.miniature_image_url || v.primary_image_url || primary_image_url || null;
        return {
          product_id: savedProductId,
          color_name: v.color_name || 'Standard',
          sku: v.sku || null,
          miniature_image_url: variantImg,
          primary_image_url: v.primary_image_url || variantImg,
          stock: Number(v.stock) || 10,
          is_active: v.is_active ?? true,
          display_order: index,
        };
      });

      await supabase.from('product_variants').insert(variantRecords);
    }

    // Refetch complete product with relations
    const { data: finalProduct, error: fetchError } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq('id', savedProductId)
      .single();

    if (fetchError || !finalProduct) {
      return NextResponse.json({ success: true, product: { ...payload, id: savedProductId } });
    }

    return NextResponse.json({ success: true, product: finalProduct });
  } catch (err: any) {
    console.error('API /api/products POST error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

// DELETE: Delete product by id or slug
export async function DELETE(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase server not configured' }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product id or slug required' }, { status: 400 });
    }

    let query = supabase.from('products').delete();
    if (UUID_REGEX.test(id)) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }

    const { error } = await query;
    if (error) {
      console.error('Error deleting product from Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API /api/products DELETE error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
