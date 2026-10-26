-- ============================================================================
-- 001_initial_schema.sql
-- MEOW Footwear E-Commerce Complete Database Architecture
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE (The 6 MEOW Collections)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    sketch_image_url TEXT, -- Hand-drawn pencil-sketch circular category illustration
    banner_image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category lookup by slug
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active_order ON public.categories(is_active, display_order);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    sale_price NUMERIC(10, 2) CHECK (sale_price IS NULL OR (sale_price >= 0 AND sale_price <= price)),
    primary_image_url TEXT NOT NULL,
    stock INT DEFAULT 0 CHECK (stock >= 0),
    sizes TEXT[] DEFAULT ARRAY['5', '6', '7', '8', '9', '10', '11']::TEXT[],
    highlights TEXT[] DEFAULT ARRAY['Lightweight Comfort', 'Cushioned Footbed', 'Premium Materials', 'Built for Everyday']::TEXT[],
    specifications JSONB DEFAULT '{"sole": "High-density EVA", "insole": "Anatomical Cork Footbed", "upper": "Water-resistant Vegan Nubuck", "closure": "Dual Adjustable Buckles", "fit": "True to size"}'::JSONB,
    is_bestseller BOOLEAN DEFAULT false,
    is_new_arrival BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_flags ON public.products(is_active, is_bestseller, is_new_arrival, is_featured);

-- 3. PRODUCT IMAGES TABLE (Gallery images for each product)
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id, display_order);

-- 4. PRODUCT COLOR VARIANTS TABLE
-- MANDATORY REQUIREMENT: Miniature footwear images representing actual colors
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    color_name VARCHAR(100) NOT NULL,
    sku VARCHAR(100),
    miniature_image_url TEXT NOT NULL, -- Small miniature footwear image of the actual shoe in this color
    primary_image_url TEXT, -- Full resolution image of this variant
    gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    available_sizes TEXT[] DEFAULT ARRAY['5', '6', '7', '8', '9', '10', '11']::TEXT[],
    stock INT DEFAULT 10 CHECK (stock >= 0),
    price_override NUMERIC(10, 2) CHECK (price_override IS NULL OR price_override >= 0),
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id, is_active, display_order);

-- 5. HERO BANNER TABLE (Exploded 3D Footwear Video & Content)
CREATE TABLE IF NOT EXISTS public.hero_banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    badge VARCHAR(100) DEFAULT 'SPRING / SUMMER',
    heading VARCHAR(255) DEFAULT 'THE ART OF DRESSING WELL',
    subtitle VARCHAR(255) DEFAULT 'Quiet confidence. Timeless comfort.',
    cta_text VARCHAR(100) DEFAULT 'DISCOVER THE COLLECTION',
    cta_link VARCHAR(255) DEFAULT '/shop',
    desktop_video_url TEXT,
    mobile_video_url TEXT,
    poster_image_url TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SITE SETTINGS TABLE (WhatsApp concierge, contact info, social links)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ABOUT SECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.about_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tagline VARCHAR(255) DEFAULT 'OUR STORY',
    heading VARCHAR(255) DEFAULT 'CRAFTED FOR A BOLDER YOU.',
    story_summary TEXT DEFAULT 'MEOW is more than footwear — it is a blend of craftsmanship, comfort, and contemporary style, made for everyday journeys.',
    story_detail TEXT,
    banner_image_url TEXT,
    craft_heading VARCHAR(255) DEFAULT 'EVERY STEP A STORY',
    craft_body TEXT DEFAULT 'MEOW brings together minimal design and maximum comfort. We create footwear that fits your everyday life — from relaxed casuals to refined statements — with a focus on quality, durability, and timeless design.',
    craft_image_url TEXT,
    mission_text TEXT DEFAULT 'To craft footwear that inspires confidence everyday through anatomical support and conscious design.',
    vision_text TEXT DEFAULT 'To make every step a more comfortable world.',
    values JSONB DEFAULT '[
        {"title": "Quality First", "description": "We believe in footwear that lasts, made with care and precision."},
        {"title": "Minimal Design", "description": "Clean, versatile styles for every occasion."},
        {"title": "Customer Focus", "description": "Your comfort and satisfaction drive our journey."},
        {"title": "A Greener Tomorrow", "description": "Responsible material choices for a better future."}
    ]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDERS TABLE (WhatsApp order persistence)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_ref VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_whatsapp VARCHAR(50),
    customer_email VARCHAR(255),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(50) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    notes TEXT,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    shipping_amount NUMERIC(10, 2) DEFAULT 0.00 CHECK (shipping_amount >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(50) DEFAULT 'pending_whatsapp', 
    -- Status workflow: pending_whatsapp, confirmed, processing, shipped, delivered, cancelled
    whatsapp_url TEXT,
    is_whatsapp_confirmed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_ref ON public.orders(order_ref);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status, created_at DESC);

-- 9. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    variant_color VARCHAR(100),
    miniature_image_url TEXT,
    size VARCHAR(20) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- 10. CONTACT ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.contact_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new', -- new, in_progress, resolved
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.contact_enquiries(status, created_at DESC);

-- 11. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
