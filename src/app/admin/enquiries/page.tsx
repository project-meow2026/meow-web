'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MessageSquare, Check, Trash2, Search, ExternalLink } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dbService } from '@/lib/storage/db';
import { ContactEnquiry } from '@/lib/supabase/types';
import { formatDate } from '@/lib/utils/formatters';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const loadEnquiries = async () => {
    try {
      const data = await dbService.getEnquiries();
      setEnquiries(data);
    } catch (e) {
      console.error('Failed to load enquiries:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: ContactEnquiry['status']) => {
    await dbService.updateEnquiryStatus(id, status);
    await loadEnquiries();
    setToastMsg(`Status updated to ${status}.`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div>
      <AdminHeader
        title="Customer Messages & Contact Enquiries"
        description="Track inquiries sent through the storefront Contact form with quick WhatsApp and email reply triggers."
      />

      {toastMsg && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded flex items-center gap-2 animate-fade-in-up">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {enquiries.length === 0 ? (
        <div className="border border-meow-border rounded-xl p-12 bg-white text-center text-xs text-meow-muted space-y-2">
          <MessageSquare className="w-8 h-8 text-meow-subtle mx-auto stroke-[1.2]" />
          <p className="font-semibold text-meow-dark">No customer messages yet.</p>
          <p>When customers fill out the Contact Us form, their messages will be safely stored and displayed here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              className="border border-meow-border rounded-xl p-6 bg-white shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-meow-border">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm text-meow-dark">{enq.full_name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-meow-surface text-meow-dark border border-meow-border">
                    {enq.subject}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-meow-subtle">
                  <span>{formatDate(enq.created_at)}</span>
                  <select
                    value={enq.status}
                    onChange={(e) => handleUpdateStatus(enq.id, e.target.value as any)}
                    className="text-[11px] font-semibold px-2 py-1 rounded border border-meow-border bg-white text-meow-dark cursor-pointer"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Review</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <p className="text-xs text-meow-dark leading-relaxed whitespace-pre-line bg-[#FAF9F6] p-4 rounded-lg border border-meow-border/60">
                &ldquo;{enq.message}&rdquo;
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                <div className="flex items-center gap-4 text-meow-muted">
                  <a
                    href={`mailto:${enq.email}`}
                    className="flex items-center gap-1.5 hover:text-meow-dark transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{enq.email}</span>
                  </a>
                  <a
                    href={`tel:${enq.phone.replace(/\D/g, '')}`}
                    className="flex items-center gap-1.5 hover:text-meow-dark transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{enq.phone}</span>
                  </a>
                </div>

                <a
                  href={`https://wa.me/${enq.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                    enq.full_name
                  )},%20this%20is%20MEOW%20Footwear%20replying%20to%20your%20inquiry%20regarding%20${encodeURIComponent(
                    enq.subject
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white text-[11px] font-bold rounded hover:bg-[#20BA5A] transition-colors"
                >
                  <span>Reply on WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
