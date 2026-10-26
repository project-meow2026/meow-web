-- ============================================================================
-- 003_seed_categories_and_settings.sql
-- Seed the 6 Exact MEOW Collections, Site Settings, Hero Banner & About Us
-- ============================================================================

-- 1. SEED THE EXACT SIX MEOW CATEGORIES
INSERT INTO public.categories (name, slug, description, sketch_image_url, banner_image_url, display_order, is_active)
VALUES 
    (
        'EVA for Women',
        'eva-for-women',
        'Featherlight, water-resistant everyday comfort crafted with ultra-cushioned high-rebound EVA technology.',
        '/images/sketches/eva-women.svg',
        NULL,
        1,
        true
    ),
    (
        'Cork Inn for Women',
        'cork-inn-for-women',
        'Anatomically shaped natural cork footbeds paired with premium adjustable straps for all-day posture support.',
        '/images/sketches/cork-inn-women.svg',
        NULL,
        2,
        true
    ),
    (
        'Double Density for Women',
        'double-density-for-women',
        'Engineered dual-layer comfort combining high-density shock-absorption outsole with a pillowy soft top layer.',
        '/images/sketches/double-density-women.svg',
        NULL,
        3,
        true
    ),
    (
        'EVA for Kids',
        'eva-for-kids',
        'Super-light, washable, and flexible slip-ons engineered to withstand active play and keep little feet smiling.',
        '/images/sketches/eva-kids.svg',
        NULL,
        4,
        true
    ),
    (
        'Cork Inn for Kids',
        'cork-inn-kids',
        'Natural foot-forming cork footbeds with gentle arch contours and durable protective soles for growing feet.',
        '/images/sketches/cork-inn-kids.svg',
        NULL,
        5,
        true
    ),
    (
        'Magic Craft for Kids',
        'magic-craft-for-kids',
        'Playful textures, sensory grips, and quick-fastening straps crafted for creative adventures and all-day ease.',
        '/images/sketches/magic-craft-kids.svg',
        NULL,
        6,
        true
    )
ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    sketch_image_url = EXCLUDED.sketch_image_url,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active;

-- 2. SEED DEFAULT HERO BANNER
INSERT INTO public.hero_banners (
    badge,
    heading,
    subtitle,
    cta_text,
    cta_link,
    desktop_video_url,
    mobile_video_url,
    poster_image_url,
    is_published
)
VALUES (
    'SPRING / SUMMER',
    'THE ART OF DRESSING WELL',
    'Quiet confidence. Timeless comfort.',
    'DISCOVER THE COLLECTION',
    '/shop',
    NULL,
    NULL,
    NULL,
    true
)
ON CONFLICT DO NOTHING;

-- 3. SEED SITE SETTINGS (WhatsApp concierge, contact info, social links)
INSERT INTO public.site_settings (key, value, description)
VALUES 
    (
        'contact_info',
        '{
            "phone": "+91 98765 43210",
            "whatsapp": "+91 98765 43210",
            "email": "support@mymeow.in",
            "hours": "Mon - Sat, 10:00 AM - 7:00 PM",
            "address": "MEOW Footwear Studio, Panampilly Nagar, Kochi, Kerala 682036, India"
        }'::JSONB,
        'Primary contact coordinates for customer service and WhatsApp ordering'
    ),
    (
        'social_links',
        '{
            "instagram": "https://instagram.com/meowfootwear",
            "facebook": "https://facebook.com/meowfootwear",
            "youtube": "https://youtube.com/@meowfootwear",
            "pinterest": "https://pinterest.com/meowfootwear"
        }'::JSONB,
        'Brand social media channels'
    ),
    (
        'shipping_rules',
        '{
            "free_shipping_threshold": 0,
            "standard_shipping_cost": 0,
            "estimated_days": "3-5 business days"
        }'::JSONB,
        'Shipping and delivery calculations'
    )
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value;

-- 4. SEED ABOUT SECTION CONTENT
INSERT INTO public.about_sections (
    tagline,
    heading,
    story_summary,
    story_detail,
    banner_image_url,
    craft_heading,
    craft_body,
    craft_image_url,
    mission_text,
    vision_text,
    values
)
VALUES (
    'OUR STORY',
    'CRAFTED FOR A BOLDER YOU.',
    'MEOW is more than footwear — it is a blend of craftsmanship, comfort, and contemporary style, made for everyday journeys.',
    'Born from a deep appreciation for anatomical wellness and understated luxury, MEOW redefines how modern individuals experience everyday movement. Every curve of our footbeds is shaped to cradle your natural stance, while our lightweight materials absorb shock effortlessly.',
    NULL,
    'EVERY STEP A STORY',
    'MEOW brings together minimal design and maximum comfort. We create footwear that fits your everyday life — from relaxed casuals to refined statements — with an uncompromising focus on quality, durability, and timeless silhouette.',
    NULL,
    'To craft footwear that inspires confidence everyday through anatomical support and conscious design.',
    'To make every step a more comfortable world.',
    '[
        {"title": "Quality First", "description": "We believe in footwear that lasts, made with care, precision, and hand-finished attention."},
        {"title": "Minimal Design", "description": "Clean, versatile silhouettes that elevate everyday outfits without unnecessary noise."},
        {"title": "Customer Focus", "description": "Your walking comfort and long-term satisfaction drive our entire innovation journey."},
        {"title": "A Greener Tomorrow", "description": "Responsible material choices, recyclable EVA, and natural cork for a better future."}
    ]'::JSONB
)
ON CONFLICT DO NOTHING;
