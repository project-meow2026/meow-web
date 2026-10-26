# MEOW Footwear — Supabase Database Setup & Migrations

This folder contains the complete, ordered PostgreSQL migrations for MEOW Footwear.

## Migration Files Overview

1. `001_initial_schema.sql`: Core tables for `categories`, `products`, `product_images`, `product_variants`, `hero_banners`, `site_settings`, `about_sections`, `orders`, `order_items`, `contact_enquiries`, `admin_users`.
2. `002_rls_policies.sql`: Production-grade Row Level Security policies for public customer read/order creation and administrative CRUD.
3. `003_seed_categories_and_settings.sql`: Idempotent seed initializing the 6 exact MEOW categories, initial hero banner, site settings (WhatsApp contact), and About Us content.
4. `004_functions_and_triggers.sql`: `updated_at` triggers and unique order reference generator (`MEOW-ORD-XXXXX`).

## How to Apply to Supabase

### Option A: Via Supabase SQL Editor (Fastest)
1. Go to your [Supabase Dashboard](https://app.supabase.com).
2. Open your project -> **SQL Editor**.
3. Create a new query, paste the contents of `001_initial_schema.sql`, and click **Run**.
4. Repeat for `002_rls_policies.sql`, `003_seed_categories_and_settings.sql`, and `004_functions_and_triggers.sql`.

### Option B: Via Supabase CLI
```bash
supabase link --project-ref your-project-ref
supabase db push
```

## Admin User Authorization
To authorize an admin user:
1. In Supabase Dashboard -> **Authentication** -> **Users**, invite or register an admin email.
2. Run this SQL query to link their admin privileges:
```sql
INSERT INTO public.admin_users (email, full_name, role)
VALUES ('admin@mymeow.in', 'MEOW Store Manager', 'admin')
ON CONFLICT (email) DO NOTHING;
```
