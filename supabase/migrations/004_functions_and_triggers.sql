-- ============================================================================
-- 004_functions_and_triggers.sql
-- Automatic Timestamps, Order Reference Generator & Helpers
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
DROP TRIGGER IF EXISTS tr_categories_updated_at ON public.categories;
CREATE TRIGGER tr_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_products_updated_at ON public.products;
CREATE TRIGGER tr_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_product_variants_updated_at ON public.product_variants;
CREATE TRIGGER tr_product_variants_updated_at
    BEFORE UPDATE ON public.product_variants
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_hero_banners_updated_at ON public.hero_banners;
CREATE TRIGGER tr_hero_banners_updated_at
    BEFORE UPDATE ON public.hero_banners
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER tr_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_about_sections_updated_at ON public.about_sections;
CREATE TRIGGER tr_about_sections_updated_at
    BEFORE UPDATE ON public.about_sections
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_orders_updated_at ON public.orders;
CREATE TRIGGER tr_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_contact_enquiries_updated_at ON public.contact_enquiries;
CREATE TRIGGER tr_contact_enquiries_updated_at
    BEFORE UPDATE ON public.contact_enquiries
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to generate a formatted unique order reference
CREATE OR REPLACE FUNCTION public.generate_meow_order_ref()
RETURNS VARCHAR(50) AS $$
DECLARE
    new_ref VARCHAR(50);
    exists_check BOOLEAN;
BEGIN
    LOOP
        -- Generate format: MEOW-ORD-XXXXX (e.g. MEOW-ORD-48291)
        new_ref := 'MEOW-ORD-' || LPAD(FLOOR(RANDOM() * 90000 + 10000)::TEXT, 5, '0');
        
        SELECT EXISTS(SELECT 1 FROM public.orders WHERE order_ref = new_ref) INTO exists_check;
        IF NOT exists_check THEN
            RETURN new_ref;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
