export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sketch_image_url: string | null;
  banner_image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string | null;
  display_order: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color_name: string;
  sku?: string | null;
  miniature_image_url: string; // Mandatory: miniature footwear image of the actual shoe in this color
  primary_image_url?: string | null;
  gallery_images: string[];
  available_sizes: string[];
  stock: number;
  price_override?: number | null;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number | null;
  primary_image_url: string;
  stock: number;
  sizes: string[];
  highlights: string[];
  specifications: Record<string, string>;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  // Joined fields
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface HeroBanner {
  id: string;
  badge: string;
  heading: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  desktop_video_url?: string | null;
  mobile_video_url?: string | null;
  poster_image_url?: string | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PreloadVideoSetting {
  id?: string;
  is_enabled: boolean;
  video_url: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  skip_button_text?: string;
  auto_close_on_end?: boolean;
  updated_at?: string;
}

export interface MidPageBannerSetting {
  id?: string;
  is_enabled: boolean;
  image_url: string;
  badge: string;
  heading: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  updated_at?: string;
}

export interface BottomCtaSetting {
  id?: string;
  is_enabled: boolean;
  background_image_url: string;
  badge: string;
  heading: string;
  subtitle: string;
  button_text: string;
  updated_at?: string;
}

export interface TheMeowStandardSetting {
  id?: string;
  is_enabled: boolean;
  image_url: string;
  badge: string;
  heading: string;
  subtitle: string;
  updated_at?: string;
}

export interface ShopHeroBannerSetting {
  id?: string;
  is_enabled: boolean;
  badge: string;
  heading: string;
  subtitle: string;
  accent_tag?: string;
  background_image_url?: string | null;
  video_url?: string | null;
  overlay_opacity?: number;
  text_color?: 'dark' | 'white';
  updated_at?: string;
}

export interface ContactInfoSetting {
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
  address: string;
}

export interface SocialLinksSetting {
  instagram: string;
  facebook: string;
  youtube: string;
  pinterest: string;
}

export interface AboutSection {
  id: string;
  tagline: string;
  heading: string;
  story_summary: string;
  story_detail: string;
  banner_image_url: string | null;
  craft_heading: string;
  craft_body: string;
  craft_image_url: string | null;
  values_image_url?: string | null;
  values_image_caption?: string;
  vision_image_url?: string | null;
  mission_text: string;
  vision_text: string;
  values: Array<{
    title: string;
    description: string;
  }>;
}

export interface CollectionCardItem {
  id: string;
  number: string;
  title: string;
  slug: string;
  description: string;
  image_url: string | null;
}

export interface CollectionsPageSetting {
  hero_badge: string;
  hero_heading: string;
  hero_subtitle: string;
  hero_accent: string;
  hero_image_url: string | null;
  cards: CollectionCardItem[];
  philosophy_badge: string;
  philosophy_heading: string;
  philosophy_body: string;
  philosophy_image_url: string | null;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string | null;
  product_name: string;
  variant_id: string | null;
  variant_color: string;
  miniature_image_url: string;
  size: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export type OrderStatus = 
  | 'pending_whatsapp' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export interface Order {
  id: string;
  order_ref: string;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp?: string | null;
  customer_email?: string | null;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  notes?: string | null;
  subtotal: number;
  shipping_amount: number;
  total_amount: number;
  status: OrderStatus;
  whatsapp_url?: string | null;
  is_whatsapp_confirmed: boolean;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface ContactEnquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  admin_notes?: string | null;
  created_at: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  slug: string;
  categoryName?: string;
  variantId: string;
  colorName: string;
  miniatureImageUrl: string;
  primaryImageUrl: string;
  size: string;
  price: number;
  quantity: number;
}
