import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { 
  Category, 
  Product, 
  ProductVariant, 
  ProductImage, 
  HeroBanner, 
  ContactInfoSetting, 
  SocialLinksSetting, 
  AboutSection, 
  Order, 
  OrderItem, 
  ContactEnquiry,
  PreloadVideoSetting,
  MidPageBannerSetting,
  BottomCtaSetting,
  TheMeowStandardSetting,
  ShopHeroBannerSetting,
} from '@/lib/supabase/types';

// Initial default categories for MEOW as required by Master Prompt Section 4
export const INITIAL_MEOW_CATEGORIES: Category[] = [
  {
    id: 'c1-eva-women',
    name: 'EVA for Women',
    slug: 'eva-for-women',
    description: 'Featherlight, water-resistant everyday comfort crafted with ultra-cushioned high-rebound EVA technology.',
    sketch_image_url: '/images/sketches/eva-women.svg',
    banner_image_url: null,
    display_order: 1,
    is_active: true,
  },
  {
    id: 'c2-cork-women',
    name: 'Cork Inn for Women',
    slug: 'cork-inn-for-women',
    description: 'Anatomically shaped natural cork footbeds paired with premium adjustable straps for all-day posture support.',
    sketch_image_url: '/images/sketches/cork-inn-women.svg',
    banner_image_url: null,
    display_order: 2,
    is_active: true,
  },
  {
    id: 'c3-dd-women',
    name: 'Double Density for Women',
    slug: 'double-density-for-women',
    description: 'Engineered dual-layer comfort combining high-density shock-absorption outsole with a pillowy soft top layer.',
    sketch_image_url: '/images/sketches/double-density-women.svg',
    banner_image_url: null,
    display_order: 3,
    is_active: true,
  },
  {
    id: 'c4-eva-kids',
    name: 'EVA for Kids',
    slug: 'eva-for-kids',
    description: 'Super-light, washable, and flexible slip-ons engineered to withstand active play and keep little feet smiling.',
    sketch_image_url: '/images/sketches/eva-kids.svg',
    banner_image_url: null,
    display_order: 4,
    is_active: true,
  },
  {
    id: 'c5-cork-kids',
    name: 'Cork Inn for Kids',
    slug: 'cork-inn-kids',
    description: 'Natural foot-forming cork footbeds with gentle arch contours and durable protective soles for growing feet.',
    sketch_image_url: '/images/sketches/cork-inn-kids.svg',
    banner_image_url: null,
    display_order: 5,
    is_active: true,
  },
  {
    id: 'c6-magic-kids',
    name: 'Magic Craft for Kids',
    slug: 'magic-craft-for-kids',
    description: 'Playful textures, sensory grips, and quick-fastening straps crafted for creative adventures and all-day ease.',
    sketch_image_url: '/images/sketches/magic-craft-kids.svg',
    banner_image_url: null,
    display_order: 6,
    is_active: true,
  },
];

export const INITIAL_HERO_BANNER: HeroBanner = {
  id: 'meow-hero-banner-main',
  badge: 'SPRING / SUMMER',
  heading: 'THE ART OF DRESSING WELL',
  subtitle: 'Quiet confidence. Timeless comfort.',
  cta_text: 'DISCOVER THE COLLECTION',
  cta_link: '/shop',
  desktop_video_url: 'https://res.cloudinary.com/k7t4skr1/video/upload/v1793007834/meow/hero/desktop/qlqsgtcvyihqq2bsnu0s.mp4',
  mobile_video_url: null,
  poster_image_url: null,
  is_published: true,
};

export const INITIAL_CONTACT_INFO: ContactInfoSetting = {
  phone: '+91 98765 43210',
  whatsapp: '919876543210',
  email: 'support@mymeow.in',
  hours: 'Mon - Sat, 10:00 AM - 7:00 PM',
  address: 'MEOW Footwear Studio, Panampilly Nagar, Kochi, Kerala 682036, India',
};

export const INITIAL_SOCIAL_LINKS: SocialLinksSetting = {
  instagram: 'https://instagram.com/meowfootwear',
  facebook: 'https://facebook.com/meowfootwear',
  youtube: 'https://youtube.com/@meowfootwear',
  pinterest: 'https://pinterest.com/meowfootwear',
};

export const INITIAL_ABOUT_SECTION: AboutSection = {
  id: 'meow-about-main',
  tagline: 'OUR STORY',
  heading: 'CRAFTED\nFOR A\nBOLDER YOU.',
  story_summary: 'MEOW is more than footwear — it’s a blend of craftsmanship, comfort, and contemporary style, made for everyday journeys.',
  story_detail: '',
  banner_image_url: null,
  craft_heading: 'EVERY STEP\nA STORY',
  craft_body: 'MEOW brings together minimal design and maximum comfort. We create footwear that fits your everyday life — from relaxed casuals to refined formals — with a focus on quality, durability and timeless design.',
  craft_image_url: null,
  values_image_url: null,
  values_image_caption: 'TRADITION\nMEETS\nMODERN STYLE',
  vision_image_url: null,
  mission_text: 'TO CRAFT FOOTWEAR\nTHAT INSPIRES CONFIDENCE\nEVERYDAY.',
  vision_text: 'TO MAKE EVERY STEP\nA MORE COMFORTABLE\nWORLD.',
  values: [
    { title: 'QUALITY FIRST', description: 'We believe in footwear that lasts, made with care and precision.' },
    { title: 'MINIMAL DESIGN', description: 'Clean, versatile styles for every occasion.' },
    { title: 'CUSTOMER FOCUS', description: 'Your comfort and satisfaction drive our journey.' },
    { title: 'A GREENER TOMORROW', description: 'Responsible choices for a better future.' },
  ],
};

export const INITIAL_PRELOAD_VIDEO: PreloadVideoSetting = {
  is_enabled: true,
  video_url: 'https://res.cloudinary.com/k7t4skr1/video/upload/v1793096513/meow/preloader/ashqa9vo1hihytmejjx0.mp4',
  auto_close_on_end: true,
};

export const INITIAL_MID_PAGE_BANNER: MidPageBannerSetting = {
  is_enabled: true,
  image_url: '/images/banners/exact-mid-banner.png',
  badge: 'MEOW HERITAGE',
  heading: 'Every Step\nA Story',
  subtitle: 'Crafted for modern lives with purpose, comfort and character.',
  cta_text: 'EXPLORE OUR STORY',
  cta_link: '/about',
};

export const INITIAL_BOTTOM_CTA: BottomCtaSetting = {
  is_enabled: true,
  background_image_url: '/images/banners/bottom-cta-glass-bg.png',
  badge: 'MEOW JOURNAL',
  heading: 'Style Stories,\nNew Arrivals & More',
  subtitle: 'Be the first to know about new releases, styling ideas and everything MEOW.',
  button_text: '→',
};

export const INITIAL_THE_MEOW_STANDARD: TheMeowStandardSetting = {
  is_enabled: true,
  image_url: '/images/banners/exact-story-banner.png',
  badge: 'THE MEOW STANDARD',
  heading: 'Designed for Calm,\nConfident Living',
  subtitle: 'We believe what touches your feet should liberate your stride. From natural cork footbeds to pillowy double-density outsoles, every MEOW piece is made for modern life.',
};

export const INITIAL_SHOP_HERO_BANNER: ShopHeroBannerSetting = {
  is_enabled: true,
  badge: 'DISCOVER',
  heading: 'ALL PRODUCTS',
  subtitle: 'Crafted for everyday comfort. Engineered anatomical support.',
  accent_tag: 'STEP INTO STYLE',
  background_image_url: null,
  video_url: null,
  overlay_opacity: 30,
  text_color: 'dark',
};

// Storage keys for local persistence (v2 clean keys)
const STORAGE_KEYS = {
  CATEGORIES: 'meow_db_categories_v2',
  PRODUCTS: 'meow_db_products_v2',
  HERO: 'meow_db_hero_v2',
  PRELOAD_VIDEO: 'meow_db_preload_video_v2',
  MID_PAGE_BANNER: 'meow_db_mid_page_banner_v2',
  BOTTOM_CTA: 'meow_db_bottom_cta_v2',
  THE_MEOW_STANDARD: 'meow_db_the_meow_standard_v2',
  SHOP_HERO_BANNER: 'meow_db_shop_hero_banner_v2',
  CONTACT: 'meow_db_contact_v2',
  SOCIAL: 'meow_db_social_v2',
  ABOUT: 'meow_db_about_v2',
  ORDERS: 'meow_db_orders_v2',
  ENQUIRIES: 'meow_db_enquiries_v2',
};

// Clean legacy stale mock caches
if (typeof window !== 'undefined') {
  try {
    const oldHero = localStorage.getItem('meow_db_hero');
    if (oldHero && (oldHero.includes('mixkit.co') || oldHero.includes('unsplash.com'))) {
      localStorage.removeItem('meow_db_hero');
    }
    const currentHero = localStorage.getItem(STORAGE_KEYS.HERO);
    if (currentHero && (currentHero.includes('mixkit.co') || currentHero.includes('unsplash.com'))) {
      localStorage.removeItem(STORAGE_KEYS.HERO);
    }
  } catch (_) {}
}

// Helper for local storage access
const getLocalData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw);
    // Discard any legacy object containing mock URLs
    const str = JSON.stringify(parsed);
    if (str.includes('mixkit.co') || str.includes('unsplash.com')) {
      localStorage.removeItem(key);
      return defaultValue;
    }
    return parsed;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
};

const setLocalData = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
};

// ============================================================================
// DATA ACCESS LAYER: DB SERVICE
// ============================================================================

export const dbService = {
  // --------------------------------------------------------------------------
  // CATEGORIES
  // --------------------------------------------------------------------------
  async getCategories(): Promise<Category[]> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/categories?active=true&t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const resData = await res.json();
          if (resData.categories && resData.categories.length > 0) {
            setLocalData(STORAGE_KEYS.CATEGORIES, resData.categories);
            return resData.categories as Category[];
          }
        }
      } catch (err) {
        console.warn('API /api/categories error, falling back:', err);
      }
    }

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (error) {
        console.warn('Supabase getCategories error, falling back to local cache:', error.message);
      } else if (data && data.length > 0) {
        return data as Category[];
      }
    }
    return getLocalData<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_MEOW_CATEGORIES);
  },

  async getAllCategoriesAdmin(): Promise<Category[]> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/categories?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const resData = await res.json();
          if (resData.categories && resData.categories.length > 0) {
            setLocalData(STORAGE_KEYS.CATEGORIES, resData.categories);
            return resData.categories as Category[];
          }
        }
      } catch (err) {
        console.warn('API /api/categories admin error, falling back:', err);
      }
    }

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data as Category[];
    }
    return getLocalData<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_MEOW_CATEGORIES);
  },

  async saveCategory(category: Partial<Category>): Promise<Category> {
    const categories = await this.getAllCategoriesAdmin();
    let updated: Category;

    if (category.id) {
      const index = categories.findIndex((c) => c.id === category.id || (category.slug && c.slug === category.slug));
      if (index >= 0) {
        updated = { ...categories[index], ...category, updated_at: new Date().toISOString() };
        categories[index] = updated;
      } else {
        updated = {
          id: category.id,
          name: category.name || '',
          slug: category.slug || '',
          description: category.description || '',
          sketch_image_url: category.sketch_image_url || null,
          banner_image_url: category.banner_image_url || null,
          display_order: category.display_order || categories.length + 1,
          is_active: category.is_active ?? true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        categories.push(updated);
      }
    } else {
      updated = {
        id: 'cat-' + Date.now(),
        name: category.name || '',
        slug: category.slug || (category.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: category.description || '',
        sketch_image_url: category.sketch_image_url || null,
        banner_image_url: category.banner_image_url || null,
        display_order: category.display_order || categories.length + 1,
        is_active: category.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      categories.push(updated);
    }

    setLocalData(STORAGE_KEYS.CATEGORIES, categories);

    // Call server API route with service role permissions to bypass RLS and PostgreSQL UUID constraints
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
        const resData = await res.json();
        if (res.ok && resData.category) {
          const savedCat = resData.category as Category;
          const idx = categories.findIndex((c) => c.slug === savedCat.slug || c.id === savedCat.id);
          if (idx >= 0) {
            categories[idx] = savedCat;
          } else {
            categories.push(savedCat);
          }
          setLocalData(STORAGE_KEYS.CATEGORIES, categories);
          return savedCat;
        }
      } catch (e) {
        console.warn('API /api/categories POST error, using local state:', e);
      }
    }

    return updated;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const categories = await this.getAllCategoriesAdmin();
    const filtered = categories.filter((c) => c.id !== id && c.slug !== id);
    setLocalData(STORAGE_KEYS.CATEGORIES, filtered);

    if (typeof window !== 'undefined') {
      try {
        await fetch(`/api/categories?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
      } catch (e) {
        console.warn('API /api/categories DELETE error:', e);
      }
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (e) {
        console.warn('Failed to delete category from Supabase:', e);
      }
    }
    return true;
  },

  // --------------------------------------------------------------------------
  // PRODUCTS
  // --------------------------------------------------------------------------
  async getProducts(filter?: {
    categorySlug?: string;
    isBestseller?: boolean;
    isNewArrival?: boolean;
    isFeatured?: boolean;
    search?: string;
    sort?: string;
  }): Promise<Product[]> {
    let products: Product[] = [];

    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams();
        params.set('active', 'true');
        params.set('t', String(Date.now()));
        if (filter?.categorySlug) params.set('categorySlug', filter.categorySlug);
        if (filter?.isBestseller) params.set('bestseller', 'true');
        if (filter?.isNewArrival) params.set('newArrival', 'true');
        if (filter?.isFeatured) params.set('featured', 'true');

        const res = await fetch(`/api/products?${params.toString()}`, { cache: 'no-store' });
        if (res.ok) {
          const resData = await res.json();
          if (Array.isArray(resData.products) && resData.products.length > 0) {
            products = resData.products;
          }
        }
      } catch (e) {
        console.warn('API /api/products GET error, falling back:', e);
      }
    }

    if (products.length === 0) {
      const all = await this.getAllProductsAdmin();
      products = all.filter((p) => p.is_active !== false);
    }

    // Strict deduplication
    const seen = new Set<string>();
    const deduplicated: Product[] = [];
    for (const p of products) {
      const key = (p.id || p.slug || '').trim().toLowerCase();
      if (key && !seen.has(key)) {
        seen.add(key);
        deduplicated.push(p);
      }
    }
    products = deduplicated;

    // Apply local filters if needed
    if (filter?.categorySlug) {
      products = products.filter(
        (p) => p.category?.slug === filter.categorySlug || p.category_id === filter.categorySlug
      );
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
      );
    }
    if (filter?.sort) {
      if (filter.sort === 'price-low') {
        products.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
      } else if (filter.sort === 'price-high') {
        products.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
      } else if (filter.sort === 'name-asc') {
        products.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    return products;
  },

  async getAllProductsAdmin(): Promise<Product[]> {
    const localProducts = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    let serverProducts: Product[] = [];

    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/products?admin=true&t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const resData = await res.json();
          if (Array.isArray(resData.products)) {
            serverProducts = resData.products;
          }
        }
      } catch (e) {
        console.warn('API /api/products GET admin error:', e);
      }
    }

    if (serverProducts.length === 0 && isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(*),
            images:product_images(*),
            variants:product_variants(*)
          `)
          .order('created_at', { ascending: false });
        if (!error && data) serverProducts = data as unknown as Product[];
      } catch (_) {}
    }

    // Strict deduplication matching by ID or by SLUG (server products are authoritative)
    const merged: Product[] = [];
    const seenIds = new Set<string>();
    const seenSlugs = new Set<string>();

    for (const sp of serverProducts) {
      if (sp.id) seenIds.add(sp.id);
      if (sp.slug) seenSlugs.add(sp.slug.toLowerCase().trim());
      merged.push(sp);
    }

    for (const lp of localProducts) {
      const idMatch = lp.id && seenIds.has(lp.id);
      const slugMatch = lp.slug && seenSlugs.has(lp.slug.toLowerCase().trim());
      if (!idMatch && !slugMatch) {
        if (lp.id) seenIds.add(lp.id);
        if (lp.slug) seenSlugs.add(lp.slug.toLowerCase().trim());
        merged.unshift(lp);
      }
    }

    // Auto-sync any unsaved local products to Supabase via server API in the background
    if (typeof window !== 'undefined' && localProducts.length > 0) {
      for (const lp of localProducts) {
        const existsOnServer = serverProducts.some(
          (sp) => (sp.id && sp.id === lp.id) || (sp.slug && sp.slug.toLowerCase() === lp.slug?.toLowerCase())
        );
        if (!existsOnServer) {
          fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lp),
          }).catch(() => {});
        }
      }
    }

    setLocalData(STORAGE_KEYS.PRODUCTS, merged);
    return merged;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch(`/api/products?slug=${encodeURIComponent(slug)}&t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.product) return resData.product as Product;
        }
      } catch (_) {}
    }

    const all = await this.getAllProductsAdmin();
    return all.find((p) => p.slug === slug) || null;
  },

  async getProductById(id: string): Promise<Product | null> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch(`/api/products?id=${encodeURIComponent(id)}&t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.product) return resData.product as Product;
        }
      } catch (_) {}
    }

    const all = await this.getAllProductsAdmin();
    return all.find((p) => p.id === id) || null;
  },

  async saveProduct(product: Partial<Product>): Promise<Product> {
    const products = await this.getAllProductsAdmin();
    let updated: Product = {
      id: product.id || 'prod-' + Date.now(),
      category_id: product.category_id || null,
      category: product.category,
      name: product.name || '',
      slug:
        product.slug ||
        (product.name || '').toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-') ||
        `prod-${Date.now()}`,
      description: product.description || 'Premium handcrafted footwear featuring anatomical comfort footbeds.',
      price: Number(product.price) || 0,
      sale_price: product.sale_price ? Number(product.sale_price) : null,
      primary_image_url: product.primary_image_url || '',
      stock: Number(product.stock) || 0,
      sizes: product.sizes || ['5', '6', '7', '8', '9', '10', '11'],
      highlights: product.highlights || ['Lightweight Comfort', 'Cushioned Footbed'],
      specifications: product.specifications || {},
      is_bestseller: Boolean(product.is_bestseller),
      is_new_arrival: product.is_new_arrival ?? true,
      is_featured: Boolean(product.is_featured),
      is_active: product.is_active ?? true,
      variants: product.variants || [],
      images: product.images || [],
      created_at: product.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Immediate optimistic update to local storage
    const existingIndex = products.findIndex(
      (p) => p.id === updated.id || (p.slug && p.slug === updated.slug)
    );
    if (existingIndex >= 0) {
      products[existingIndex] = { ...products[existingIndex], ...updated };
    } else {
      products.unshift(updated);
    }
    setLocalData(STORAGE_KEYS.PRODUCTS, products);

    // Call server API with service role permissions to safely persist in Supabase PostgreSQL
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.product) {
            const saved = resData.product as Product;
            const idx = products.findIndex(
              (p) => p.slug === saved.slug || p.id === saved.id || p.id === updated.id
            );
            if (idx >= 0) {
              products[idx] = saved;
            } else {
              products.unshift(saved);
            }
            setLocalData(STORAGE_KEYS.PRODUCTS, products);
            return saved;
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          console.warn('API /api/products save warning:', errData);
        }
      } catch (e) {
        console.warn('API /api/products save network error, stored in local cache:', e);
      }
    }

    return updated;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const products = await this.getAllProductsAdmin();
    const filtered = products.filter((p) => p.id !== id && p.slug !== id);
    setLocalData(STORAGE_KEYS.PRODUCTS, filtered);

    if (typeof window !== 'undefined') {
      try {
        await fetch(`/api/products?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      } catch (e) {
        console.warn('API /api/products delete error:', e);
      }
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (e) {
        console.warn('Failed to delete product from Supabase:', e);
      }
    }
    return true;
  },

  // --------------------------------------------------------------------------
  // HERO BANNER
  // --------------------------------------------------------------------------
  async getHeroBanner(): Promise<HeroBanner> {
    const DEFAULT_VIDEO = INITIAL_HERO_BANNER.desktop_video_url || 'https://res.cloudinary.com/k7t4skr1/video/upload/v1793007834/meow/hero/desktop/qlqsgtcvyihqq2bsnu0s.mp4';
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/hero?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const resData = await res.json();
          if (resData.hero) {
            const rawVideo = resData.hero.desktop_video_url;
            const validVideo = rawVideo && !rawVideo.includes('mixkit.co') ? rawVideo : DEFAULT_VIDEO;
            const sanitized: HeroBanner = {
              ...resData.hero,
              desktop_video_url: validVideo,
              mobile_video_url: resData.hero.mobile_video_url?.includes('mixkit.co') ? null : resData.hero.mobile_video_url,
              poster_image_url: resData.hero.poster_image_url?.includes('unsplash.com') ? null : resData.hero.poster_image_url,
            };
            setLocalData(STORAGE_KEYS.HERO, sanitized);
            return sanitized;
          }
        }
      } catch (_) {}
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: rows, error } = await supabase
          .from('hero_banners')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && rows && rows.length > 0) {
          const activeRow = rows.find(r => r.desktop_video_url && !r.desktop_video_url.includes('mixkit.co')) || rows[0];
          const rawVideo = activeRow.desktop_video_url;
          const validVideo = rawVideo && !rawVideo.includes('mixkit.co') ? rawVideo : DEFAULT_VIDEO;
          const sanitized: HeroBanner = {
            ...activeRow,
            desktop_video_url: validVideo,
            mobile_video_url: activeRow.mobile_video_url?.includes('mixkit.co') ? null : activeRow.mobile_video_url,
            poster_image_url: activeRow.poster_image_url?.includes('unsplash.com') ? null : activeRow.poster_image_url,
          };
          setLocalData(STORAGE_KEYS.HERO, sanitized);
          return sanitized;
        }
      } catch (err) {
        console.warn('Error fetching hero banner from Supabase:', err);
      }
    }

    const cached = getLocalData<HeroBanner>(STORAGE_KEYS.HERO, INITIAL_HERO_BANNER);
    if (!cached.desktop_video_url || cached.desktop_video_url.includes('mixkit.co')) {
      cached.desktop_video_url = DEFAULT_VIDEO;
      setLocalData(STORAGE_KEYS.HERO, cached);
    }
    return cached;
  },

  async saveHeroBanner(hero: Partial<HeroBanner>): Promise<HeroBanner> {
    const current = await this.getHeroBanner();
    const updated: HeroBanner = {
      ...current,
      ...hero,
      updated_at: new Date().toISOString(),
    };
    setLocalData(STORAGE_KEYS.HERO, updated);

    // Call server API route with service role permissions to bypass RLS and guarantee DB persistence
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/admin/hero', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
        const resData = await res.json();
        if (res.ok && resData.hero) {
          setLocalData(STORAGE_KEYS.HERO, resData.hero);
          return resData.hero as HeroBanner;
        }
      } catch (e) {
        console.warn('API /api/admin/hero save error, using cached state:', e);
      }
    }

    return updated;
  },

  // --------------------------------------------------------------------------
  // PRELOAD VIDEO INTRO (Shown once on first website visit)
  // --------------------------------------------------------------------------
  async getPreloadVideo(): Promise<PreloadVideoSetting> {
    const cached = getLocalData<PreloadVideoSetting>(STORAGE_KEYS.PRELOAD_VIDEO, INITIAL_PRELOAD_VIDEO);

    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/preload-video?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const resData = await res.json();
          if (resData.preloadVideo?.video_url?.trim()) {
            setLocalData(STORAGE_KEYS.PRELOAD_VIDEO, resData.preloadVideo);
            return resData.preloadVideo as PreloadVideoSetting;
          }
        }
      } catch (_) {}
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'preload_video')
          .single();
        if (!error && data?.value?.video_url?.trim()) {
          setLocalData(STORAGE_KEYS.PRELOAD_VIDEO, data.value);
          return data.value as PreloadVideoSetting;
        }
      } catch (err) {
        console.warn('Error fetching preload video from Supabase:', err);
      }
    }

    return cached;
  },

  async savePreloadVideo(setting: Partial<PreloadVideoSetting>): Promise<PreloadVideoSetting> {
    const current = await this.getPreloadVideo();
    const updated: PreloadVideoSetting = {
      ...current,
      ...setting,
      updated_at: new Date().toISOString(),
    };
    setLocalData(STORAGE_KEYS.PRELOAD_VIDEO, updated);

    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/admin/preload-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
        const resData = await res.json();
        if (res.ok && resData.preloadVideo) {
          setLocalData(STORAGE_KEYS.PRELOAD_VIDEO, resData.preloadVideo);
          return resData.preloadVideo as PreloadVideoSetting;
        }
      } catch (e) {
        console.warn('API /api/admin/preload-video save error, using cached state:', e);
      }
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('site_settings').upsert({
          key: 'preload_video',
          value: updated,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Failed to update preload video in Supabase:', e);
      }
    }

    return updated;
  },

  // --------------------------------------------------------------------------
  // HOMEPAGE BANNERS (MID-PAGE, BOTTOM CTA, THE MEOW STANDARD)
  // --------------------------------------------------------------------------
  async getMidPageBanner(): Promise<MidPageBannerSetting> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/banners?type=mid&t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const resData = await res.json();
          if (resData.banner) {
            setLocalData(STORAGE_KEYS.MID_PAGE_BANNER, resData.banner);
            return resData.banner as MidPageBannerSetting;
          }
        }
      } catch (_) {}
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'mid_page_banner')
          .single();
        if (!error && data?.value) {
          setLocalData(STORAGE_KEYS.MID_PAGE_BANNER, data.value);
          return data.value as MidPageBannerSetting;
        }
      } catch (_) {}
    }

    return getLocalData<MidPageBannerSetting>(STORAGE_KEYS.MID_PAGE_BANNER, INITIAL_MID_PAGE_BANNER);
  },

  async saveMidPageBanner(setting: Partial<MidPageBannerSetting>): Promise<MidPageBannerSetting> {
    const current = await this.getMidPageBanner();
    const updated: MidPageBannerSetting = {
      ...current,
      ...setting,
      updated_at: new Date().toISOString(),
    };
    setLocalData(STORAGE_KEYS.MID_PAGE_BANNER, updated);

    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/admin/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'mid', data: updated }),
        });
      } catch (_) {}
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('site_settings').upsert({
          key: 'mid_page_banner',
          value: updated,
          updated_at: new Date().toISOString(),
        });
      } catch (_) {}
    }

    return updated;
  },

  async getBottomCta(): Promise<BottomCtaSetting> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/banners?type=bottom&t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const resData = await res.json();
          if (resData.banner) {
            setLocalData(STORAGE_KEYS.BOTTOM_CTA, resData.banner);
            return resData.banner as BottomCtaSetting;
          }
        }
      } catch (_) {}
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'bottom_cta')
          .single();
        if (!error && data?.value) {
          setLocalData(STORAGE_KEYS.BOTTOM_CTA, data.value);
          return data.value as BottomCtaSetting;
        }
      } catch (_) {}
    }

    return getLocalData<BottomCtaSetting>(STORAGE_KEYS.BOTTOM_CTA, INITIAL_BOTTOM_CTA);
  },

  async saveBottomCta(setting: Partial<BottomCtaSetting>): Promise<BottomCtaSetting> {
    const current = await this.getBottomCta();
    const updated: BottomCtaSetting = {
      ...current,
      ...setting,
      updated_at: new Date().toISOString(),
    };
    setLocalData(STORAGE_KEYS.BOTTOM_CTA, updated);

    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/admin/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'bottom', data: updated }),
        });
      } catch (_) {}
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('site_settings').upsert({
          key: 'bottom_cta',
          value: updated,
          updated_at: new Date().toISOString(),
        });
      } catch (_) {}
    }

    return updated;
  },

  async getTheMeowStandard(): Promise<TheMeowStandardSetting> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/banners?type=standard&t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const resData = await res.json();
          if (resData.banner) {
            setLocalData(STORAGE_KEYS.THE_MEOW_STANDARD, resData.banner);
            return resData.banner as TheMeowStandardSetting;
          }
        }
      } catch (_) {}
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'the_meow_standard')
          .single();
        if (!error && data?.value) {
          setLocalData(STORAGE_KEYS.THE_MEOW_STANDARD, data.value);
          return data.value as TheMeowStandardSetting;
        }
      } catch (_) {}
    }

    return getLocalData<TheMeowStandardSetting>(STORAGE_KEYS.THE_MEOW_STANDARD, INITIAL_THE_MEOW_STANDARD);
  },

  async saveTheMeowStandard(setting: Partial<TheMeowStandardSetting>): Promise<TheMeowStandardSetting> {
    const current = await this.getTheMeowStandard();
    const updated: TheMeowStandardSetting = {
      ...current,
      ...setting,
      updated_at: new Date().toISOString(),
    };
    setLocalData(STORAGE_KEYS.THE_MEOW_STANDARD, updated);

    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/admin/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'standard', data: updated }),
        });
      } catch (_) {}
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('site_settings').upsert({
          key: 'the_meow_standard',
          value: updated,
          updated_at: new Date().toISOString(),
        });
      } catch (_) {}
    }

    return updated;
  },

  async getShopHeroBanner(): Promise<ShopHeroBannerSetting> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/banners?type=shop&t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const resData = await res.json();
          if (resData.banner) {
            setLocalData(STORAGE_KEYS.SHOP_HERO_BANNER, resData.banner);
            return resData.banner as ShopHeroBannerSetting;
          }
        }
      } catch (_) {}
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'shop_hero_banner')
          .single();
        if (!error && data?.value) {
          setLocalData(STORAGE_KEYS.SHOP_HERO_BANNER, data.value);
          return data.value as ShopHeroBannerSetting;
        }
      } catch (_) {}
    }

    return getLocalData<ShopHeroBannerSetting>(STORAGE_KEYS.SHOP_HERO_BANNER, INITIAL_SHOP_HERO_BANNER);
  },

  async saveShopHeroBanner(setting: Partial<ShopHeroBannerSetting>): Promise<ShopHeroBannerSetting> {
    const current = await this.getShopHeroBanner();
    const updated: ShopHeroBannerSetting = {
      ...current,
      ...setting,
      updated_at: new Date().toISOString(),
    };
    setLocalData(STORAGE_KEYS.SHOP_HERO_BANNER, updated);

    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/admin/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'shop', data: updated }),
        });
      } catch (_) {}
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('site_settings').upsert({
          key: 'shop_hero_banner',
          value: updated,
          updated_at: new Date().toISOString(),
        });
      } catch (_) {}
    }

    return updated;
  },

  // --------------------------------------------------------------------------
  // SITE SETTINGS & CONTACT INFO
  // --------------------------------------------------------------------------
  async getContactInfo(): Promise<ContactInfoSetting> {
    const localCached = getLocalData<ContactInfoSetting | null>(STORAGE_KEYS.CONTACT, null);

    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/contact?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const resData = await res.json();
          if (resData.contactInfo) {
            // If server returned the hardcoded default but local cache has a custom saved number, keep custom & sync to server
            if (
              localCached &&
              localCached.whatsapp &&
              localCached.whatsapp !== INITIAL_CONTACT_INFO.whatsapp &&
              resData.contactInfo.whatsapp === INITIAL_CONTACT_INFO.whatsapp
            ) {
              fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'settings', contactInfo: localCached }),
              }).catch(() => {});
              return localCached;
            }
            setLocalData(STORAGE_KEYS.CONTACT, resData.contactInfo);
            return resData.contactInfo as ContactInfoSetting;
          }
        }
      } catch (_) {}
    }

    if (localCached) return localCached;

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'contact_info')
        .single();
      if (!error && data?.value) {
        setLocalData(STORAGE_KEYS.CONTACT, data.value);
        return data.value as ContactInfoSetting;
      }
    }
    return INITIAL_CONTACT_INFO;
  },

  async saveContactInfo(info: Partial<ContactInfoSetting>): Promise<ContactInfoSetting> {
    const localCached = getLocalData<ContactInfoSetting>(STORAGE_KEYS.CONTACT, INITIAL_CONTACT_INFO);
    const updated: ContactInfoSetting = {
      ...localCached,
      ...info,
      phone: info.whatsapp || info.phone || localCached.phone,
    };
    setLocalData(STORAGE_KEYS.CONTACT, updated);

    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'settings', contactInfo: updated }),
        });
      } catch (e) {
        console.warn('Failed to save contact info via API:', e);
      }
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('site_settings').upsert(
          {
            key: 'contact_info',
            value: updated,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );
      } catch (e) {
        console.warn('Failed to update contact info in Supabase:', e);
      }
    }
    return updated;
  },

  async getSocialLinks(): Promise<SocialLinksSetting> {
    const localCached = getLocalData<SocialLinksSetting | null>(STORAGE_KEYS.SOCIAL, null);

    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/contact?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const resData = await res.json();
          if (resData.socialLinks) {
            if (
              localCached &&
              JSON.stringify(localCached) !== JSON.stringify(INITIAL_SOCIAL_LINKS) &&
              JSON.stringify(resData.socialLinks) === JSON.stringify(INITIAL_SOCIAL_LINKS)
            ) {
              fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'settings', socialLinks: localCached }),
              }).catch(() => {});
              return localCached;
            }
            setLocalData(STORAGE_KEYS.SOCIAL, resData.socialLinks);
            return resData.socialLinks as SocialLinksSetting;
          }
        }
      } catch (_) {}
    }

    if (localCached) return localCached;

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'social_links')
        .single();
      if (!error && data?.value) {
        setLocalData(STORAGE_KEYS.SOCIAL, data.value);
        return data.value as SocialLinksSetting;
      }
    }
    return INITIAL_SOCIAL_LINKS;
  },

  async saveSocialLinks(links: Partial<SocialLinksSetting>): Promise<SocialLinksSetting> {
    const localCached = getLocalData<SocialLinksSetting>(STORAGE_KEYS.SOCIAL, INITIAL_SOCIAL_LINKS);
    const updated: SocialLinksSetting = { ...localCached, ...links };
    setLocalData(STORAGE_KEYS.SOCIAL, updated);

    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'settings', socialLinks: updated }),
        });
      } catch (e) {
        console.warn('Failed to save social links via API:', e);
      }
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('site_settings').upsert(
          {
            key: 'social_links',
            value: updated,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );
      } catch (e) {
        console.warn('Failed to update social links in Supabase:', e);
      }
    }
    return updated;
  },

  // --------------------------------------------------------------------------
  // ABOUT SECTION
  // --------------------------------------------------------------------------
  async getAboutSection(): Promise<AboutSection> {
    const localCached = getLocalData<AboutSection | null>(STORAGE_KEYS.ABOUT, null);

    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/contact?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const resData = await res.json();
          if (resData.aboutSection) {
            const merged = { ...INITIAL_ABOUT_SECTION, ...resData.aboutSection };
            setLocalData(STORAGE_KEYS.ABOUT, merged);
            return merged;
          }
        }
      } catch (_) {}
    }

    if (localCached) return { ...INITIAL_ABOUT_SECTION, ...localCached };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('about_sections')
        .select('*')
        .limit(1)
        .single();
      if (!error && data) {
        const merged = { ...INITIAL_ABOUT_SECTION, ...(data as AboutSection) };
        setLocalData(STORAGE_KEYS.ABOUT, merged);
        return merged;
      }
    }
    return INITIAL_ABOUT_SECTION;
  },

  async saveAboutSection(about: Partial<AboutSection>): Promise<AboutSection> {
    const current = getLocalData<AboutSection>(STORAGE_KEYS.ABOUT, INITIAL_ABOUT_SECTION);
    const updated = { ...current, ...about };
    setLocalData(STORAGE_KEYS.ABOUT, updated);

    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'about', about: updated }),
        });
      } catch (e) {
        console.warn('Failed to save about section via API:', e);
      }
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('about_sections').upsert(updated);
      } catch (e) {
        console.warn('Failed to update about section in Supabase:', e);
      }
    }
    return updated;
  },

  // --------------------------------------------------------------------------
  // ORDERS (WhatsApp Workflow)
  // --------------------------------------------------------------------------
  async getOrders(): Promise<Order[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });
      if (!error && data) return data as unknown as Order[];
    }
    return getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  async getOrderByRef(orderRef: string): Promise<Order | null> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch(`/api/orders?ref=${encodeURIComponent(orderRef)}&t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.order) return resData.order as Order;
        }
      } catch (_) {}
    }

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('order_ref', orderRef)
        .single();
      if (!error && data) return data as unknown as Order;
    }
    const orders = getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
    return orders.find((o) => o.order_ref.toLowerCase() === orderRef.toLowerCase()) || null;
  },

  async createOrder(orderData: Omit<Order, 'id' | 'created_at'>): Promise<Order> {
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const orders = getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
    orders.unshift(newOrder);
    setLocalData(STORAGE_KEYS.ORDERS, orders);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { items, ...orderRecord } = newOrder;
        const { data: created, error } = await supabase
          .from('orders')
          .insert(orderRecord)
          .select()
          .single();

        if (!error && created && items && items.length > 0) {
          const orderItems = items.map((item) => ({
            ...item,
            order_id: created.id,
          }));
          await supabase.from('order_items').insert(orderItems);
        }
      } catch (e) {
        console.warn('Failed to write order to Supabase:', e);
      }
    }

    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    const orders = getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
    const index = orders.findIndex((o) => o.id === orderId || o.order_ref === orderId);
    if (index >= 0) {
      orders[index].status = status;
      orders[index].updated_at = new Date().toISOString();
      setLocalData(STORAGE_KEYS.ORDERS, orders);
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('orders')
          .update({ status, updated_at: new Date().toISOString() })
          .or(`id.eq.${orderId},order_ref.eq.${orderId}`);
      } catch (e) {
        console.warn('Failed to update order status in Supabase:', e);
      }
    }
    return true;
  },

  // --------------------------------------------------------------------------
  // CONTACT ENQUIRIES
  // --------------------------------------------------------------------------
  async getEnquiries(): Promise<ContactEnquiry[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('contact_enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as ContactEnquiry[];
    }
    return getLocalData<ContactEnquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
  },

  async createEnquiry(enquiry: Omit<ContactEnquiry, 'id' | 'created_at' | 'status'>): Promise<ContactEnquiry> {
    const newEnquiry: ContactEnquiry = {
      ...enquiry,
      id: 'enq-' + Date.now(),
      status: 'new',
      created_at: new Date().toISOString(),
    };

    const enquiries = getLocalData<ContactEnquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
    enquiries.unshift(newEnquiry);
    setLocalData(STORAGE_KEYS.ENQUIRIES, enquiries);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('contact_enquiries').insert(newEnquiry);
      } catch (e) {
        console.warn('Failed to submit enquiry to Supabase:', e);
      }
    }

    return newEnquiry;
  },

  async updateEnquiryStatus(id: string, status: ContactEnquiry['status']): Promise<boolean> {
    const enquiries = getLocalData<ContactEnquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
    const index = enquiries.findIndex((e) => e.id === id);
    if (index >= 0) {
      enquiries[index].status = status;
      setLocalData(STORAGE_KEYS.ENQUIRIES, enquiries);
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('contact_enquiries').update({ status }).eq('id', id);
      } catch (e) {
        console.warn('Failed to update enquiry status in Supabase:', e);
      }
    }
    return true;
  },
};
