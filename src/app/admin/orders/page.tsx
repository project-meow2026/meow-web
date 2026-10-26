'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  MessageCircle,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dbService } from '@/lib/storage/db';
import { Order, OrderStatus } from '@/lib/supabase/types';
import { formatPrice, formatDate } from '@/lib/utils/formatters';
import { getWhatsAppRedirectUrl } from '@/lib/utils/whatsapp';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const loadOrders = async () => {
    try {
      const data = await dbService.getOrders();
      setOrders(data);
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    await dbService.updateOrderStatus(orderId, newStatus);
    await loadOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    setToastMsg(`Order status updated to "${newStatus}".`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const filtered = orders.filter((o) => {
    const matchesSearch =
      !searchQuery ||
      o.order_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_phone.includes(searchQuery);
    const matchesStatus = !statusFilter || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_whatsapp':
        return (
          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] uppercase font-bold">
            Pending WhatsApp
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] uppercase font-bold">
            Confirmed
          </span>
        );
      case 'processing':
        return (
          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded text-[10px] uppercase font-bold">
            In Production
          </span>
        );
      case 'shipped':
        return (
          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[10px] uppercase font-bold">
            Dispatched
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded text-[10px] uppercase font-bold">
            Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-[10px] uppercase font-bold">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <AdminHeader
        title="Orders & WhatsApp Concierge"
        description="Review incoming footwear orders, customer delivery locations, order items, and status progression."
      />

      {toastMsg && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded flex items-center gap-2 animate-fade-in-up">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-meow-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order Ref, customer, or phone..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded border border-meow-border bg-white outline-none focus:border-meow-dark"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded border border-meow-border bg-white outline-none focus:border-meow-dark cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="pending_whatsapp">Pending WhatsApp</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">In Production</option>
            <option value="shipped">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border border-meow-border rounded-xl bg-white shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-meow-muted space-y-2">
            <ShoppingBag className="w-8 h-8 text-meow-subtle mx-auto stroke-[1.2]" />
            <p className="font-semibold text-meow-dark">No orders found.</p>
            <p>Customer orders submitted through checkout will appear here in real time.</p>
          </div>
        ) : (
          <table className="w-full text-xs text-left divide-y divide-meow-border">
            <thead className="bg-[#FAF9F6] text-meow-dark uppercase font-semibold">
              <tr>
                <th className="px-6 py-3.5">Order Ref</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Items</th>
                <th className="px-6 py-3.5">Total Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-meow-border/60">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-meow-surface">
                  <td className="px-6 py-4 font-mono font-bold text-meow-dark">
                    {ord.order_ref}
                  </td>
                  <td className="px-6 py-4 text-meow-muted">
                    {formatDate(ord.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-meow-dark block">{ord.customer_name}</span>
                    <span className="font-mono text-meow-muted text-[11px]">{ord.customer_phone}</span>
                  </td>
                  <td className="px-6 py-4 text-meow-muted">
                    {ord.items?.length || 1} {ord.items?.length === 1 ? 'pair' : 'pairs'}
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-meow-dark">
                    {formatPrice(ord.total_amount)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(ord.status)}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1 bg-meow-surface hover:bg-white text-meow-dark font-semibold rounded border border-meow-border inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />

          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6 sm:p-8 z-10 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-meow-border">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-meow-subtle block">
                  MEOW ORDER RECORD
                </span>
                <h2 className="font-mono text-xl font-bold text-meow-dark">
                  {selectedOrder.order_ref}
                </h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-meow-muted hover:text-meow-dark">
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Status Workflow Selector */}
            <div className="p-4 rounded-lg bg-meow-surface border border-meow-border flex items-center justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-meow-dark">
                Update Order Status:
              </span>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                className="text-xs font-semibold px-3 py-1.5 rounded border border-meow-border bg-white text-meow-dark outline-none cursor-pointer"
              >
                <option value="pending_whatsapp">Pending WhatsApp</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">In Production</option>
                <option value="shipped">Dispatched</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Customer Coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg border border-meow-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-meow-subtle block">Customer Details</span>
                <p className="font-semibold text-meow-dark">{selectedOrder.customer_name}</p>
                <p className="font-mono text-meow-muted">Phone: {selectedOrder.customer_phone}</p>
                {selectedOrder.customer_whatsapp && (
                  <p className="font-mono text-green-700">WhatsApp: {selectedOrder.customer_whatsapp}</p>
                )}
                {selectedOrder.customer_email && (
                  <p className="text-meow-muted">Email: {selectedOrder.customer_email}</p>
                )}
              </div>

              <div className="p-4 rounded-lg border border-meow-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-meow-subtle block">Delivery Address</span>
                <p className="text-meow-dark font-medium leading-relaxed">
                  {selectedOrder.address}<br />
                  {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.postal_code}<br />
                  {selectedOrder.country}
                </p>
                {selectedOrder.notes && (
                  <p className="text-meow-subtle pt-1 italic">Notes: &ldquo;{selectedOrder.notes}&rdquo;</p>
                )}
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-meow-dark block">
                Ordered Footwear Items
              </span>
              <div className="divide-y divide-meow-border border border-meow-border rounded-lg overflow-hidden">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white">
                    <div className="flex items-center gap-3">
                      {item.miniature_image_url && (
                        <img
                          src={item.miniature_image_url}
                          alt={item.product_name}
                          className="w-12 h-12 rounded object-cover border border-meow-border"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold text-meow-dark">{item.product_name}</h4>
                        <p className="text-meow-muted">
                          Color: <strong>{item.variant_color}</strong> | Size: <strong>{item.size}</strong> | Qty: <strong>{item.quantity}</strong>
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-meow-dark">
                      {formatPrice(item.total_price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Calculation */}
            <div className="space-y-1.5 pt-2 border-t border-meow-border text-xs">
              <div className="flex justify-between text-meow-muted">
                <span>Subtotal</span>
                <span className="font-mono">{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-meow-muted">
                <span>Shipping</span>
                <span className="text-green-700 font-semibold uppercase">Free</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-meow-dark pt-2 border-t border-meow-border">
                <span>Total</span>
                <span className="font-mono">{formatPrice(selectedOrder.total_amount)}</span>
              </div>
            </div>

            {/* Open WhatsApp Chat Button */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <a
                href={getWhatsAppRedirectUrl(selectedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#20BA5A] shadow"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Open WhatsApp Chat with Customer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-meow-border text-meow-dark text-xs font-semibold rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
