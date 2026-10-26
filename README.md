# MEOW Footwear — Minimal Luxury Footwear E-Commerce

A complete, production-ready luxury footwear e-commerce application built for **MEOW**, faithful to the visual reference design in `Meow-web-pages.pdf` with a clean white aesthetic (`#FFFFFF` background, `#111111` primary typography, subtle grey borders, and dark charcoal action elements).

---

## 🌟 Key Architecture & Highlights

### 1. Brand Integrity
- Exclusively showcases **MEOW Footwear**. All legacy "Velvero" / "by Velvero" references are completely removed across customer-facing UI, metadata, schemas, and assets.

### 2. The Six MEOW Collections
Implements the exact six requested collection categories:
1. **EVA for Women** (`/shop?category=eva-for-women`)
2. **Cork Inn for Women** (`/shop?category=cork-inn-for-women`)
3. **Double Density for Women** (`/shop?category=double-density-for-women`)
4. **EVA for Kids** (`/shop?category=eva-for-kids`)
5. **Cork Inn for Kids** (`/shop?category=cork-inn-kids`)
6. **Magic Craft for Kids** (`/shop?category=magic-craft-for-kids`)

### 3. Pre-Intro Hand-Drawn Pencil Sketch Splash Screen
- Simulates hand-drawn pencil sketching of footwear with progressive graphite stroke rendering.
- Cross-fades smoothly into the finished luxury footwear visual.
- Includes progress bar, "Skip Intro" option, and reduced-motion fallback.

### 4. 3D Exploded-Layer Footwear Hero & Video Banner
- Interactive 3D exploded view with manual scrubber and cinematic auto-motion showing all 5 layers:
  1. Hand-stitched Vegan Nubuck Upper & Antique Brass Buckles
  2. Ultra-soft Microfiber Footbed Lining
  3. Anatomical Natural Cork-Latex Core
  4. High-Rebound Shock Absorbing Midsole
  5. Anti-Skid Traction EVA Outsole
- Video mode support with separate desktop and mobile video assets, poster fallback, and autoplay.
- Fully controllable from the Admin CMS.

### 5. Shop by Category with Pencil Sketches
- 6 circular containers with distinct, authentic hand-drawn pencil-sketch illustrations corresponding to each of the 6 MEOW collections.

### 6. Miniature Footwear Colorway Selector (Mandatory Feature)
- Round color swatches replaced with **miniature footwear images of the actual same shoe in each colorway**.
- Clicking a miniature footwear image switches the active product image, gallery, SKU, price override, and size availability on both Product Cards and Product Detail Page.

### 7. Checkout & WhatsApp Concierge Order Flow
- 3-step checkout collecting customer details and delivery address.
- Server-side validation and database persistence generating unique order references (`MEOW-ORD-XXXXX`).
- Generates properly URL-encoded WhatsApp messages containing customer name, phone, address, and itemized product list with variants, sizes, and totals.
- Confirmation screen clearly notifying customers that order awaits business confirmation via WhatsApp.

### 8. Full Functional Admin Dashboard CMS (`/admin`)
- **Dashboard Overview**: Live database metrics, revenue, low stock alerts, and recent orders.
- **Category Management**: Full CRUD, slug configuration, and pencil sketch upload.
- **Product Management**: Full CRUD, description, category assignment, price, sale price, stock, sizes, and homepage placement flags.
- **Color Variant Management**: Multiple colorway configuration with individual miniature footwear image upload.
- **Hero Banner Management**: Desktop and mobile video upload, poster image, and editorial copy.
- **About Us Management**: Brand story, craft narrative, vision, mission, and core values.
- **Contact & Social CMS**: WhatsApp concierge number, phone, email, and social links.
- **Orders & Enquiries**: Order status workflow (`Pending WhatsApp`, `Confirmed`, `In Production`, `Dispatched`, `Delivered`, `Cancelled`) and customer message tracking.

### 9. Supabase PostgreSQL Architecture (`supabase/migrations/`)
- `001_initial_schema.sql`: 11 normalized tables for categories, products, images, variants, hero banners, site settings, about sections, orders, order items, enquiries, and admins.
- `002_rls_policies.sql`: Production-grade Row Level Security policies.
- `003_seed_categories_and_settings.sql`: Idempotent seed for the 6 MEOW collections and default settings.
- `004_functions_and_triggers.sql`: `updated_at` triggers and unique order reference generator.

### 10. Cloudinary Media Storage
- Dedicated media upload utility (`src/lib/cloudinary/upload.ts`) with size/format validation and structured folders (`meow/products`, `meow/categories`, `meow/variants`, `meow/hero`, `meow/about`).
- Server-side signature endpoint (`src/app/api/cloudinary/sign`).

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase project credentials, Cloudinary cloud name/keys, and WhatsApp business number.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the MEOW storefront.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the Admin Dashboard.

### 4. Build for Production
```bash
npm run build
npm start
```
