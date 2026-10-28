'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Check,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils/formatters';

export const CheckoutForm: React.FC = () => {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sameWhatsapp, setSameWhatsapp] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Kerala');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');
  const [orderNotes, setOrderNotes] = useState('');
  const [saveAddress, setSaveAddress] = useState(true);

  // Load saved customer profile on mount
  React.useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('meow_customer_profile_v1');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.phoneNumber) setPhoneNumber(parsed.phoneNumber);
        if (parsed.whatsappNumber) {
          setWhatsappNumber(parsed.whatsappNumber);
          if (parsed.phoneNumber && parsed.whatsappNumber !== parsed.phoneNumber) {
            setSameWhatsapp(false);
          }
        }
        if (parsed.emailAddress) setEmailAddress(parsed.emailAddress);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.city) setCity(parsed.city);
        if (parsed.state) setState(parsed.state);
        if (parsed.pincode) setPincode(parsed.pincode);
      }
    } catch (_) {}
  }, []);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !phoneNumber.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
      setErrorMessage('Please fill in all mandatory delivery fields marked with *');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Your shopping bag is empty. Please add items before checking out.');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalWhatsapp = sameWhatsapp ? phoneNumber.trim() : (whatsappNumber.trim() || phoneNumber.trim());

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: fullName,
          customerPhone: phoneNumber,
          customerWhatsapp: finalWhatsapp,
          customerEmail: emailAddress || null,
          address,
          city,
          state,
          postalCode: pincode,
          country,
          notes: orderNotes || null,
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Persist order to client localStorage for immediate profile & order confirmation access
      try {
        if (data.order) {
          const existingRaw = localStorage.getItem('meow_db_orders_v2');
          const existingOrders = existingRaw ? JSON.parse(existingRaw) : [];
          const filteredOrders = existingOrders.filter((o: any) => o.order_ref !== data.order.order_ref);
          localStorage.setItem('meow_db_orders_v2', JSON.stringify([data.order, ...filteredOrders]));
        }
        if (saveAddress) {
          localStorage.setItem(
            'meow_customer_profile_v1',
            JSON.stringify({
              fullName: fullName.trim(),
              phoneNumber: phoneNumber.trim(),
              whatsappNumber: finalWhatsapp,
              emailAddress: emailAddress.trim(),
              address: address.trim(),
              city: city.trim(),
              state,
              pincode: pincode.trim(),
              country,
            })
          );
        }
      } catch (_) {}

      // Clear cart items
      clearCart();

      // Open WhatsApp in new tab with the pre-filled message
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
      }

      // Navigate to order confirmation page
      router.push(`/order-confirmation?ref=${data.orderRef}`);
    } catch (err: any) {
      console.error('Order submission error:', err);
      setErrorMessage(err.message || 'Something went wrong while placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 3-Step Visual Progress Bar */}
      <div className="flex items-center justify-center max-w-xl mx-auto mb-10 sm:mb-14">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-full bg-meow-dark text-white text-xs font-semibold flex items-center justify-center">
            1
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold text-meow-dark hidden sm:inline">
            Customer Details
          </span>
        </div>
        <div className="w-12 sm:w-16 h-0.5 bg-meow-dark mx-2" />
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-full bg-meow-dark text-white text-xs font-semibold flex items-center justify-center">
            2
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold text-meow-dark hidden sm:inline">
            Delivery Address
          </span>
        </div>
        <div className="w-12 sm:w-16 h-0.5 bg-meow-dark mx-2" />
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-full bg-meow-dark text-white text-xs font-semibold flex items-center justify-center">
            3
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold text-meow-dark hidden sm:inline">
            WhatsApp Order
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form Column (Steps 1, 2, 3) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer Details */}
            <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white space-y-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark flex items-center gap-2 pb-3 border-b border-meow-border">
                <span>1. Customer Details</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-meow-dark block mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full text-xs px-3.5 py-3 rounded border border-meow-border bg-white focus:border-meow-dark outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-meow-dark block mb-1.5">
                      Phone Number *
                    </label>
                    <div className="flex items-center border border-meow-border rounded focus-within:border-meow-dark overflow-hidden">
                      <span className="text-xs font-medium text-meow-dark px-3 bg-meow-surface border-r border-meow-border">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full text-xs px-3 py-3 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-meow-dark block mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="For digital order invoice"
                      className="w-full text-xs px-3.5 py-3 rounded border border-meow-border bg-white focus:border-meow-dark outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Same as WhatsApp toggle */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 text-xs text-meow-muted cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sameWhatsapp}
                      onChange={(e) => setSameWhatsapp(e.target.checked)}
                      className="rounded border-meow-border accent-meow-dark w-4 h-4"
                    />
                    <span>WhatsApp number is the same as contact phone number</span>
                  </label>

                  {!sameWhatsapp && (
                    <div className="mt-3">
                      <label className="text-xs font-medium text-meow-dark block mb-1.5">
                        WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="WhatsApp number with country code"
                        className="w-full text-xs px-3.5 py-3 rounded border border-meow-border bg-white focus:border-meow-dark outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Address */}
            <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white space-y-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark flex items-center gap-2 pb-3 border-b border-meow-border">
                <span>2. Delivery Address</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-meow-dark block mb-1.5">
                    Address (House name, Street name, Landmark) *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Flat 4B, Emerald Heights, Marine Drive"
                    className="w-full text-xs px-3.5 py-3 rounded border border-meow-border bg-white focus:border-meow-dark outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-meow-dark block mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Kochi"
                      className="w-full text-xs px-3.5 py-3 rounded border border-meow-border bg-white focus:border-meow-dark outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-meow-dark block mb-1.5">
                      Postal Code / Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 682036"
                      className="w-full text-xs px-3.5 py-3 rounded border border-meow-border bg-white focus:border-meow-dark outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-meow-dark block mb-1.5">
                      State *
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full text-xs px-3.5 py-3 rounded border border-meow-border bg-white focus:border-meow-dark outline-none transition-colors cursor-pointer"
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
                      Country
                    </label>
                    <input
                      type="text"
                      disabled
                      value={country}
                      className="w-full text-xs px-3.5 py-3 rounded border border-meow-border bg-meow-surface text-meow-dark cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 text-xs text-meow-muted cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="rounded border-meow-border accent-meow-dark w-4 h-4"
                    />
                    <span>Save this delivery address for future orders</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Step 3: Additional Notes */}
            <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark pb-3 border-b border-meow-border">
                3. Additional Notes (Optional)
              </h2>
              <textarea
                rows={3}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Any special instructions for courier, landmark details, or gift packaging notes..."
                className="w-full text-xs p-3.5 rounded border border-meow-border bg-white focus:border-meow-dark outline-none transition-colors"
              />
            </div>
          </div>

          {/* Right Column: Order Summary, WhatsApp Box, Trust Badges & CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-[#FAF9F6] space-y-6 sticky top-28">
              <div className="flex items-center justify-between pb-4 border-b border-meow-border">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-meow-dark">
                  Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h3>
              </div>

              {/* Items List */}
              <div className="divide-y divide-meow-border/80 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId}-${item.size}`}
                    className="py-3.5 first:pt-0 last:pb-0 flex gap-3.5 items-center justify-between"
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-14 h-14 bg-white border border-meow-border rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.miniatureImageUrl || item.primaryImageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-semibold text-meow-dark line-clamp-1">
                          {item.productName}
                        </h4>
                        <p className="text-[11px] text-meow-muted">
                          Color: <strong className="font-medium text-meow-dark">{item.colorName}</strong> | Size: <strong className="font-medium text-meow-dark">{item.size}</strong>
                        </p>
                        <p className="text-[11px] text-meow-subtle font-mono">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-meow-dark whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Subtotal, Shipping, Total */}
              <div className="space-y-2 pt-4 border-t border-meow-border text-xs">
                <div className="flex justify-between text-meow-muted">
                  <span>Subtotal</span>
                  <span className="font-mono text-meow-dark font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-meow-muted">
                  <span>Shipping</span>
                  <span className="text-green-700 font-semibold uppercase tracking-wider">Free</span>
                </div>
                <div className="flex justify-between text-meow-muted">
                  <span>GST</span>
                  <span className="text-meow-subtle">Inclusive</span>
                </div>
                <div className="flex justify-between text-base font-bold text-meow-dark pt-3 border-t border-meow-border">
                  <span>Total Amount</span>
                  <span className="font-mono">{formatPrice(subtotal)}</span>
                </div>
              </div>

              {/* Green WhatsApp Notice Box matching PDF page 5 */}
              <div className="p-4 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-[#128C7E] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#075E54] leading-relaxed">
                  <strong>WhatsApp Order Concierge:</strong> Clicking below will record your order reference and redirect you to WhatsApp with your order details pre-filled.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 text-[11px] text-meow-muted border-t border-meow-border">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-meow-dark" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-meow-dark" />
                  <span>Secure Ordering</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-meow-dark" />
                  <span>Easy Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-meow-dark" />
                  <span>Support on WhatsApp</span>
                </div>
              </div>

              {/* Error feedback */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Primary Action Button */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs uppercase tracking-widest font-bold rounded flex items-center justify-center gap-2.5 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>{isSubmitting ? 'Recording Order...' : 'Place Order via WhatsApp'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-center text-meow-subtle">
                  Your details are safe and will only be used for order processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
