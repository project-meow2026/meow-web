'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Package,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Search,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Heart,
  Save,
  Check,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { dbService } from '@/lib/storage/db';
import { Order, OrderStatus } from '@/lib/supabase/types';
import { formatPrice, formatDate } from '@/lib/utils/formatters';
import { getWhatsAppRedirectUrl } from '@/lib/utils/whatsapp';

type ProfileTab = 'orders' | 'cart' | 'details';

interface SavedCustomerProfile {
  fullName: string;
  phoneNumber: string;
  whatsappNumber: string;
  emailAddress: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export default function CustomerProfilePage() {
  const { items, updateQuantity, removeFromCart, subtotal, itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [activeTab, setActiveTab] = useState<ProfileTab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchFeedback, setSearchFeedback] = useState('');

  // Customer Delivery Profile State
  const [profile, setProfile] = useState<SavedCustomerProfile>({
    fullName: '',
    phoneNumber: '',
    whatsappNumber: '',
    emailAddress: '',
    address: '',
    city: '',
    state: 'Kerala',
    pincode: '',
    country: 'India',
  });
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Punjab',
    'Rajasthan',
    'Tamil Nadu',
    'Telangana',
    'Uttar Pradesh',
    'West Bengal',
  ];

  useEffect(() => {
    async function initProfileAndOrders() {
      setLoadingOrders(true);
      let loadedProfile: SavedCustomerProfile | null = null;

      try {
        const rawProfile = localStorage.getItem('meow_customer_profile_v1');
        if (rawProfile) {
          loadedProfile = JSON.parse(rawProfile);
          if (loadedProfile) {
            setProfile((prev) => ({ ...prev, ...loadedProfile }));
          }
        }
      } catch (_) {}

      try {
        // Load orders stored on this device
        const localRaw = localStorage.getItem('meow_db_orders_v2');
        const localOrders: Order[] = localRaw ? JSON.parse(localRaw) : [];

        let serverOrders: Order[] = [];
        if (loadedProfile?.phoneNumber) {
          const res = await fetch(
            `/api/orders?phone=${encodeURIComponent(loadedProfile.phoneNumber)}&t=${Date.now()}`,
            { cache: 'no-store' }
          );
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.orders)) {
              serverOrders = data.orders;
            }
          }
        }

        // Merge and deduplicate by order_ref
        const mergedMap = new Map<string, Order>();
        for (const o of [...serverOrders, ...localOrders]) {
          if (o && o.order_ref && !mergedMap.has(o.order_ref)) {
            mergedMap.set(o.order_ref, o);
          }
        }
        setOrders(Array.from(mergedMap.values()));

        // If profile is empty but we have a local order, pre-populate from the most recent order
        if (!loadedProfile?.fullName && localOrders.length > 0) {
          const latest = localOrders[0];
          const inferred: SavedCustomerProfile = {
            fullName: latest.customer_name || '',
            phoneNumber: latest.customer_phone || '',
            whatsappNumber: latest.customer_whatsapp || latest.customer_phone || '',
            emailAddress: latest.customer_email || '',
            address: latest.address || '',
            city: latest.city || '',
            state: latest.state || 'Kerala',
            pincode: latest.postal_code || '',
            country: latest.country || 'India',
          };
          setProfile(inferred);
        }
      } catch (e) {
        console.error('Failed to load customer orders:', e);
      } finally {
        setLoadingOrders(false);
      }
    }

    initProfileAndOrders();
  }, []);

  const handleLookupOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    setSearching(true);
    setSearchFeedback('');

    try {
      const isOrderRef = q.toUpperCase().startsWith('MEOW-') || q.toUpperCase().startsWith('ORD-');
      let foundOrders: Order[] = [];

      if (isOrderRef) {
        const order = await dbService.getOrderByRef(q);
        if (order) foundOrders = [order];
      } else {
        const res = await fetch(`/api/orders?phone=${encodeURIComponent(q)}&t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.orders)) {
            foundOrders = data.orders;
          }
        }
        // Also check local orders by phone or ref
        const localRaw = localStorage.getItem('meow_db_orders_v2');
        const localOrders: Order[] = localRaw ? JSON.parse(localRaw) : [];
        const cleanQ = q.replace(/\D/g, '').slice(-10);
        const localMatched = localOrders.filter((o) => {
          const oPhone = (o.customer_phone || '').replace(/\D/g, '').slice(-10);
          return (
            o.order_ref.toLowerCase() === q.toLowerCase() ||
            (cleanQ && cleanQ.length >= 6 && oPhone.includes(cleanQ))
          );
        });
        foundOrders = [...foundOrders, ...localMatched];
      }

      if (foundOrders.length === 0) {
        setSearchFeedback('No matching orders found for that Order Reference or Phone Number.');
      } else {
        setOrders((prev) => {
          const map = new Map<string, Order>();
          for (const o of [...foundOrders, ...prev]) {
            if (o && o.order_ref && !map.has(o.order_ref)) {
              map.set(o.order_ref, o);
            }
          }
          return Array.from(map.values());
        });
        setSearchFeedback(`Found ${foundOrders.length} order(s).`);
      }
    } catch (_) {
      setSearchFeedback('Unable to look up orders right now. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('meow_customer_profile_v1', JSON.stringify(profile));
      setProfileSavedToast(true);
      setTimeout(() => setProfileSavedToast(false), 3000);
    } catch (_) {}
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_whatsapp':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[11px] uppercase tracking-wider font-semibold">
            <Clock className="w-3 h-3" />
            Pending WhatsApp Confirmation
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[11px] uppercase tracking-wider font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            Order Confirmed
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[11px] uppercase tracking-wider font-semibold">
            <Package className="w-3 h-3" />
            In Production / Packing
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[11px] uppercase tracking-wider font-semibold">
            <Truck className="w-3 h-3" />
            Dispatched
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[11px] uppercase tracking-wider font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-[11px] uppercase tracking-wider font-semibold">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header />

      <main className="bg-white min-h-screen py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Customer Profile Banner */}
          <div className="pb-8 border-b border-meow-border mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#FAF9F6] border border-meow-border flex items-center justify-center text-meow-dark flex-shrink-0">
                <User className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-meow-subtle block">
                  MY MEOW ACCOUNT
                </span>
                <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-meow-dark tracking-tight">
                  {profile.fullName ? `Welcome, ${profile.fullName}` : 'Customer Profile'}
                </h1>
                <p className="text-xs text-meow-muted mt-0.5">
                  Manage your footwear orders, shopping bag, and saved delivery details.
                </p>
              </div>
            </div>

            {/* Quick Summary Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all flex items-center gap-2 ${
                  activeTab === 'orders'
                    ? 'bg-meow-dark text-white border-meow-dark'
                    : 'bg-[#FAF9F6] text-meow-dark border-meow-border hover:border-meow-dark/40'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Orders ({orders.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cart')}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all flex items-center gap-2 ${
                  activeTab === 'cart'
                    ? 'bg-meow-dark text-white border-meow-dark'
                    : 'bg-[#FAF9F6] text-meow-dark border-meow-border hover:border-meow-dark/40'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Cart ({itemCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all flex items-center gap-2 ${
                  activeTab === 'details'
                    ? 'bg-meow-dark text-white border-meow-dark'
                    : 'bg-[#FAF9F6] text-meow-dark border-meow-border hover:border-meow-dark/40'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Delivery Profile</span>
              </button>

              {wishlistCount > 0 && (
                <Link
                  href="/shop?filter=wishlist"
                  className="px-4 py-2 rounded-full text-xs font-medium border bg-[#FAF9F6] text-meow-dark border-meow-border hover:border-meow-dark/40 transition-all flex items-center gap-2"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Wishlist ({wishlistCount})</span>
                </Link>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left Sidebar Navigation & Quick Info */}
            <div className="lg:col-span-4 space-y-6">
              {/* Navigation Menu Card */}
              <div className="border border-meow-border rounded-xl p-5 bg-[#FAF9F6] space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-meow-subtle px-2 block mb-2">
                  Account Sections
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
                    activeTab === 'orders'
                      ? 'bg-meow-dark text-white shadow-sm'
                      : 'text-meow-dark hover:bg-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Package className="w-4 h-4" />
                    <span>Order Details & History</span>
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${
                      activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-meow-border text-meow-dark'
                    }`}
                  >
                    {orders.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('cart')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
                    activeTab === 'cart'
                      ? 'bg-meow-dark text-white shadow-sm'
                      : 'text-meow-dark hover:bg-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Shopping Cart Details</span>
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${
                      activeTab === 'cart' ? 'bg-white/20 text-white' : 'bg-meow-border text-meow-dark'
                    }`}
                  >
                    {itemCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
                    activeTab === 'details'
                      ? 'bg-meow-dark text-white shadow-sm'
                      : 'text-meow-dark hover:bg-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <User className="w-4 h-4" />
                    <span>Saved Delivery Address</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Saved Customer Details Summary Card */}
              <div className="border border-meow-border rounded-xl p-6 bg-white space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-meow-border">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-meow-dark">
                    Customer Details
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className="text-[11px] text-meow-muted hover:text-meow-dark underline"
                  >
                    Edit
                  </button>
                </div>

                {profile.fullName || profile.phoneNumber || profile.address ? (
                  <div className="space-y-3 text-xs">
                    {profile.fullName && (
                      <div className="flex items-start gap-2.5">
                        <User className="w-4 h-4 text-meow-subtle flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-meow-subtle block text-[11px]">Name</span>
                          <span className="font-medium text-meow-dark">{profile.fullName}</span>
                        </div>
                      </div>
                    )}
                    {profile.phoneNumber && (
                      <div className="flex items-start gap-2.5">
                        <Phone className="w-4 h-4 text-meow-subtle flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-meow-subtle block text-[11px]">Phone / WhatsApp</span>
                          <span className="font-mono font-medium text-meow-dark">
                            {profile.phoneNumber}
                          </span>
                        </div>
                      </div>
                    )}
                    {profile.emailAddress && (
                      <div className="flex items-start gap-2.5">
                        <Mail className="w-4 h-4 text-meow-subtle flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-meow-subtle block text-[11px]">Email</span>
                          <span className="font-medium text-meow-dark">{profile.emailAddress}</span>
                        </div>
                      </div>
                    )}
                    {profile.address && (
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-meow-subtle flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-meow-subtle block text-[11px]">Delivery Address</span>
                          <span className="font-medium text-meow-dark leading-relaxed block">
                            {profile.address}
                            {profile.city ? `, ${profile.city}` : ''}
                            {profile.state ? `, ${profile.state}` : ''}
                            {profile.pincode ? ` - ${profile.pincode}` : ''}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-meow-muted space-y-3">
                    <p>No delivery profile saved yet. Save your details for faster checkout.</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('details')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-meow-dark hover:opacity-75"
                    >
                      <span>Add Delivery Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Main Panel */}
            <div className="lg:col-span-8 space-y-8">
              {/* TAB 1: ORDER DETAILS & TRACKING */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  {/* Order Lookup Bar */}
                  <div className="border border-meow-border rounded-xl p-5 sm:p-6 bg-[#FAF9F6] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark">
                          Track or Find an Order
                        </h2>
                        <p className="text-xs text-meow-muted">
                          Enter your Order Reference (e.g. MEOW-...) or mobile number to view order details.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleLookupOrder} className="flex flex-col sm:flex-row gap-2.5 pt-1">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-meow-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Order Reference (MEOW-XXXXXX) or 10-digit Phone Number"
                          className="w-full text-xs pl-10 pr-4 py-3 rounded-lg border border-meow-border bg-white focus:border-meow-dark outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={searching}
                        className="px-6 py-3 bg-meow-dark text-white text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-meow-dark/90 transition-colors disabled:opacity-50"
                      >
                        {searching ? 'Searching...' : 'Find Order'}
                      </button>
                    </form>

                    {searchFeedback && (
                      <p className="text-xs text-meow-dark font-medium pt-1">{searchFeedback}</p>
                    )}
                  </div>

                  {/* Orders List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark">
                        Your Orders ({orders.length})
                      </h2>
                      {itemCount > 0 && (
                        <button
                          type="button"
                          onClick={() => setActiveTab('cart')}
                          className="text-xs font-medium text-meow-dark underline hover:opacity-75"
                        >
                          View Active Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                        </button>
                      )}
                    </div>

                    {loadingOrders ? (
                      <div className="p-12 border border-meow-border rounded-xl text-center space-y-3 bg-white">
                        <div className="w-7 h-7 border-2 border-meow-dark border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-xs uppercase tracking-widest text-meow-muted">
                          Loading your orders...
                        </p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="py-16 px-6 text-center border border-dashed border-meow-border rounded-xl bg-white space-y-4">
                        <div className="w-14 h-14 rounded-full bg-[#FAF9F6] border border-meow-border flex items-center justify-center mx-auto text-meow-subtle">
                          <Package className="w-7 h-7 stroke-[1.3]" />
                        </div>
                        <div className="space-y-1 max-w-md mx-auto">
                          <h3 className="font-editorial text-2xl font-medium text-meow-dark">
                            No orders placed yet
                          </h3>
                          <p className="text-xs text-meow-muted leading-relaxed">
                            When you place an order with MEOW, your order reference, item breakdown, and live delivery status will appear right here.
                          </p>
                        </div>
                        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                          <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 px-7 py-3 bg-meow-dark text-white text-xs uppercase tracking-widest font-semibold hover:bg-meow-dark/85 transition-colors"
                          >
                            <span>Explore Collection</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          {itemCount > 0 && (
                            <button
                              type="button"
                              onClick={() => setActiveTab('cart')}
                              className="inline-flex items-center gap-2 px-6 py-3 border border-meow-border text-meow-dark text-xs uppercase tracking-widest font-semibold hover:bg-[#FAF9F6] transition-colors"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>View Cart ({itemCount})</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {orders.map((order) => (
                          <div
                            key={order.id || order.order_ref}
                            className="border border-meow-border rounded-xl bg-white overflow-hidden shadow-sm"
                          >
                            {/* Order Card Header */}
                            <div className="px-5 sm:px-6 py-4 bg-[#FAF9F6] border-b border-meow-border flex flex-wrap items-center justify-between gap-4">
                              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
                                <div>
                                  <span className="text-[10px] uppercase tracking-wider text-meow-subtle block">
                                    Order Reference
                                  </span>
                                  <span className="font-mono font-bold text-meow-dark">
                                    {order.order_ref}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase tracking-wider text-meow-subtle block">
                                    Order Date
                                  </span>
                                  <span className="font-medium text-meow-dark">
                                    {formatDate(order.created_at)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase tracking-wider text-meow-subtle block">
                                    Total Amount
                                  </span>
                                  <span className="font-mono font-bold text-meow-dark">
                                    {formatPrice(order.total_amount)}
                                  </span>
                                </div>
                              </div>

                              <div>{getStatusBadge(order.status)}</div>
                            </div>

                            {/* Order Items */}
                            <div className="p-5 sm:p-6 divide-y divide-meow-border/60">
                              {order.items?.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs"
                                >
                                  <div className="flex items-center gap-3.5">
                                    {item.miniature_image_url ? (
                                      <img
                                        src={item.miniature_image_url}
                                        alt={item.product_name}
                                        className="w-14 h-14 rounded-lg object-cover border border-meow-border flex-shrink-0 bg-[#FAF9F6]"
                                      />
                                    ) : (
                                      <div className="w-14 h-14 rounded-lg border border-meow-border bg-[#FAF9F6] flex items-center justify-center text-[10px] text-meow-subtle flex-shrink-0">
                                        MEOW
                                      </div>
                                    )}
                                    <div className="space-y-0.5">
                                      <h4 className="font-semibold text-meow-dark text-sm">
                                        {item.product_name}
                                      </h4>
                                      <p className="text-meow-muted">
                                        Color: <strong className="text-meow-dark font-medium">{item.variant_color}</strong>{' '}
                                        • Size: <strong className="text-meow-dark font-medium">{item.size}</strong>{' '}
                                        • Qty: <strong className="text-meow-dark font-medium">{item.quantity}</strong>
                                      </p>
                                      <p className="text-[11px] text-meow-subtle font-mono">
                                        Unit Price: {formatPrice(item.unit_price)}
                                      </p>
                                    </div>
                                  </div>

                                  <span className="font-mono font-bold text-meow-dark whitespace-nowrap">
                                    {formatPrice(item.total_price)}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Order Footer: Address & Actions */}
                            <div className="px-5 sm:px-6 py-4 bg-[#FAF9F6]/60 border-t border-meow-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                              <div className="text-meow-muted">
                                <span className="font-semibold text-meow-dark">Delivery To: </span>
                                {order.customer_name} ({order.customer_phone}) — {order.address}, {order.city},{' '}
                                {order.state} - {order.postal_code}
                              </div>

                              <div className="flex items-center gap-3 flex-shrink-0">
                                <a
                                  href={getWhatsAppRedirectUrl(order)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#25D366] hover:bg-[#20BA5A] text-white text-[11px] uppercase tracking-wider font-bold rounded transition-colors"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                                  <span>WhatsApp Support</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>

                                <Link
                                  href={`/order-confirmation?ref=${encodeURIComponent(order.order_ref)}`}
                                  className="inline-flex items-center gap-1 px-3.5 py-2 border border-meow-border bg-white text-meow-dark text-[11px] uppercase tracking-wider font-semibold rounded hover:bg-[#FAF9F6] transition-colors"
                                >
                                  <span>Receipt</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: CART DETAILS */}
              {activeTab === 'cart' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-meow-border">
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark">
                        Shopping Cart Details ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
                      </h2>
                      <p className="text-xs text-meow-muted mt-0.5">
                        Review the items currently saved in your shopping bag.
                      </p>
                    </div>
                    {items.length > 0 && (
                      <Link
                        href="/checkout"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-meow-dark text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-meow-dark/90"
                      >
                        <span>Checkout</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>

                  {items.length === 0 ? (
                    <div className="py-16 px-6 text-center border border-dashed border-meow-border rounded-xl bg-white space-y-4">
                      <ShoppingBag className="w-10 h-10 text-meow-subtle mx-auto stroke-[1.3]" />
                      <div className="space-y-1">
                        <h3 className="font-editorial text-2xl font-medium text-meow-dark">
                          Your shopping bag is empty
                        </h3>
                        <p className="text-xs text-meow-muted">
                          Explore our handcrafted anatomical cork and EVA footwear collections.
                        </p>
                      </div>
                      <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-7 py-3 bg-meow-dark text-white text-xs uppercase tracking-widest font-semibold hover:bg-meow-dark/85"
                      >
                        <span>Browse Footwear</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="divide-y divide-meow-border border border-meow-border rounded-xl p-4 sm:p-6 bg-white">
                        {items.map((item) => (
                          <div
                            key={`${item.productId}-${item.variantId}-${item.size}`}
                            className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                          >
                            <div className="flex gap-4 items-center">
                              <Link
                                href={`/product/${item.slug}`}
                                className="w-20 h-20 bg-[#FAF9F6] border border-meow-border rounded-lg overflow-hidden flex-shrink-0"
                              >
                                <img
                                  src={item.miniatureImageUrl || item.primaryImageUrl}
                                  alt={item.productName}
                                  className="w-full h-full object-cover object-center"
                                />
                              </Link>
                              <div className="space-y-1">
                                <Link
                                  href={`/product/${item.slug}`}
                                  className="text-sm font-semibold text-meow-dark hover:underline"
                                >
                                  {item.productName}
                                </Link>
                                <div className="flex items-center gap-3 text-xs text-meow-muted">
                                  <span>
                                    Color: <strong className="text-meow-dark font-medium">{item.colorName}</strong>
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Size: <strong className="text-meow-dark font-medium">{item.size}</strong>
                                  </span>
                                </div>
                                <span className="text-xs text-meow-subtle font-mono block">
                                  Unit Price: {formatPrice(item.price)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between w-full sm:w-auto gap-5">
                              <div className="flex items-center border border-meow-border rounded">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.variantId, item.size, item.quantity - 1)}
                                  className="p-1.5 px-2.5 text-meow-dark hover:bg-[#FAF9F6]"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-3 text-xs font-bold text-meow-dark">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.variantId, item.size, item.quantity + 1)}
                                  className="p-1.5 px-2.5 text-meow-dark hover:bg-[#FAF9F6]"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <span className="text-sm font-bold font-mono text-meow-dark min-w-[80px] text-right">
                                {formatPrice(item.price * item.quantity)}
                              </span>

                              <button
                                type="button"
                                onClick={() => removeFromCart(item.variantId, item.size)}
                                className="text-meow-subtle hover:text-red-500 transition-colors p-1"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Cart Totals Box */}
                      <div className="border border-meow-border rounded-xl p-6 bg-[#FAF9F6] space-y-4">
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between text-meow-muted">
                            <span>Subtotal ({itemCount} items)</span>
                            <span className="font-mono font-medium text-meow-dark">{formatPrice(subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-meow-muted">
                            <span>Shipping</span>
                            <span className="text-green-700 font-semibold uppercase">Free</span>
                          </div>
                          <div className="flex justify-between text-base font-bold text-meow-dark pt-3 border-t border-meow-border">
                            <span>Total Amount</span>
                            <span className="font-mono">{formatPrice(subtotal)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <Link
                            href="/checkout"
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-meow-dark text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-meow-dark/90 shadow-sm"
                          >
                            <span>Proceed to Checkout</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          <Link
                            href="/shop"
                            className="px-6 py-3.5 border border-meow-border bg-white text-meow-dark text-xs uppercase tracking-widest font-semibold rounded hover:bg-[#FAF9F6] text-center"
                          >
                            Continue Shopping
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SAVED DELIVERY PROFILE */}
              {activeTab === 'details' && (
                <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white space-y-6">
                  <div className="pb-4 border-b border-meow-border">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark">
                      Saved Customer & Delivery Details
                    </h2>
                    <p className="text-xs text-meow-muted mt-1">
                      Save your contact and shipping address here to auto-fill during checkout.
                    </p>
                  </div>

                  {profileSavedToast && (
                    <div className="p-3.5 bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Your delivery profile has been saved.</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-meow-dark block mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profile.fullName}
                          onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                          placeholder="Your full name"
                          className="w-full text-xs px-3.5 py-3 rounded border border-meow-border bg-white focus:border-meow-dark outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-meow-dark block mb-1.5">
                          Phone / WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          value={profile.phoneNumber}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              phoneNumber: e.target.value,
                              whatsappNumber: e.target.value,
                            })
                          }
                          placeholder="10-digit mobile number"
                          className="w-full text-xs px-3.5 py-3 rounded border border-meow-border bg-white focus:border-meow-dark outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-meow-dark block mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.emailAddress}
                        onChange={(e) => setProfile({ ...profile, emailAddress: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full text-xs px-3.5 py-3 rounded border border-meow-border bg-white focus:border-meow-dark outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-meow-dark block mb-1.5">
                        Street Address (House Name, Street, Landmark)
                      </label>
                      <input
                        type="text"
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        placeholder="e.g. Flat 4B, Emerald Heights, Marine Drive"
                        className="w-full text-xs px-3.5 py-3 rounded border border-meow-border bg-white focus:border-meow-dark outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-medium text-meow-dark block mb-1.5">
                          City
                        </label>
                        <input
                          type="text"
                          value={profile.city}
                          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                          placeholder="e.g. Kochi"
                          className="w-full text-xs px-3.5 py-3 rounded border border-meow-border bg-white focus:border-meow-dark outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-meow-dark block mb-1.5">
                          State
                        </label>
                        <select
                          value={profile.state}
                          onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                          className="w-full text-xs px-3.5 py-3 rounded border border-meow-border bg-white focus:border-meow-dark outline-none cursor-pointer"
                        >
                          {indianStates.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-meow-dark block mb-1.5">
                          Pincode
                        </label>
                        <input
                          type="text"
                          value={profile.pincode}
                          onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                          placeholder="e.g. 682036"
                          className="w-full text-xs px-3.5 py-3 rounded border border-meow-border bg-white focus:border-meow-dark outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-meow-dark text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-meow-dark/90 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Profile Details</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

