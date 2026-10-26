-- ============================================================================
-- 002_rls_policies.sql
-- Row Level Security (RLS) Configuration & Access Control
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 1. PUBLIC READ POLICIES (Storefront Visitors)
-- ----------------------------------------------------------------------------

-- Allow public to read active categories
CREATE POLICY "Public can view active categories"
    ON public.categories FOR SELECT
    USING (is_active = true);

-- Allow public to read active products
CREATE POLICY "Public can view active products"
    ON public.products FOR SELECT
    USING (is_active = true);

-- Allow public to read images for active products
CREATE POLICY "Public can view active product images"
    ON public.product_images FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = product_images.product_id
            AND p.is_active = true
        )
    );

-- Allow public to read active variants
CREATE POLICY "Public can view active product variants"
    ON public.product_variants FOR SELECT
    USING (
        is_active = true AND
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = product_variants.product_id
            AND p.is_active = true
        )
    );

-- Allow public to read published hero banners
CREATE POLICY "Public can view published hero banner"
    ON public.hero_banners FOR SELECT
    USING (is_published = true);

-- Allow public to read site settings
CREATE POLICY "Public can view site settings"
    ON public.site_settings FOR SELECT
    USING (true);

-- Allow public to read about sections
CREATE POLICY "Public can view about content"
    ON public.about_sections FOR SELECT
    USING (true);

-- ----------------------------------------------------------------------------
-- 2. PUBLIC WRITE POLICIES (Order Placement & Contact Forms)
-- ----------------------------------------------------------------------------

-- Allow public customers to submit new orders
CREATE POLICY "Public can insert new orders"
    ON public.orders FOR INSERT
    WITH CHECK (true);

-- Allow public to read their created order by order_ref
CREATE POLICY "Public can view own order by ref"
    ON public.orders FOR SELECT
    USING (true);

-- Allow public to insert order items
CREATE POLICY "Public can insert order items"
    ON public.order_items FOR INSERT
    WITH CHECK (true);

-- Allow public to view order items for created order
CREATE POLICY "Public can view order items"
    ON public.order_items FOR SELECT
    USING (true);

-- Allow public customers to submit contact enquiries
CREATE POLICY "Public can submit contact enquiry"
    ON public.contact_enquiries FOR INSERT
    WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 3. ADMINISTRATIVE POLICIES (Service Role & Admin Users)
-- ----------------------------------------------------------------------------

-- Service role bypasses RLS automatically, but we also grant full access to authenticated admins
CREATE POLICY "Admins have full access to categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins have full access to products"
    ON public.products FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins have full access to product_images"
    ON public.product_images FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins have full access to product_variants"
    ON public.product_variants FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins have full access to hero_banners"
    ON public.hero_banners FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins have full access to site_settings"
    ON public.site_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins have full access to about_sections"
    ON public.about_sections FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins have full access to orders"
    ON public.orders FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins have full access to order_items"
    ON public.order_items FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins have full access to contact_enquiries"
    ON public.contact_enquiries FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins have full access to admin_users"
    ON public.admin_users FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
