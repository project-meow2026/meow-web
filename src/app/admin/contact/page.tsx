'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, Phone, MessageCircle, Mail, MapPin, Share2 } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { dbService, INITIAL_CONTACT_INFO, INITIAL_SOCIAL_LINKS } from '@/lib/storage/db';
import { ContactInfoSetting, SocialLinksSetting } from '@/lib/supabase/types';

export default function AdminContactPage() {
  const [info, setInfo] = useState<ContactInfoSetting>(INITIAL_CONTACT_INFO);
  const [social, setSocial] = useState<SocialLinksSetting>(INITIAL_SOCIAL_LINKS);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function load() {
      const [contactData, socialData] = await Promise.all([
        dbService.getContactInfo(),
        dbService.getSocialLinks(),
      ]);
      setInfo(contactData);
      setSocial(socialData);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedInfo = {
        ...info,
        phone: info.whatsapp,
      };
      const [savedInfo, savedSocial] = await Promise.all([
        dbService.saveContactInfo(updatedInfo),
        dbService.saveSocialLinks(social),
      ]);
      setInfo(savedInfo);
      setSocial(savedSocial);
      setToastMsg('Contact coordinates & social media links saved successfully!');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Contact Coordinates & Social Media CMS"
        description="Configure your business WhatsApp concierge phone number, support email, studio address, and public social channels."
      />

      {toastMsg && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded flex items-center gap-2 animate-fade-in-up">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Contact Information */}
        <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark pb-3 border-b border-meow-border flex items-center gap-2">
            <Phone className="w-4 h-4 text-meow-dark" />
            <span>1. Customer Support & WhatsApp Concierge</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                WhatsApp Business Number (With Country Code) *
              </label>
              <div className="relative">
                <MessageCircle className="w-4 h-4 text-green-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={info.whatsapp}
                  onChange={(e) => setInfo({ ...info, whatsapp: e.target.value, phone: e.target.value })}
                  placeholder="e.g. 919876543210"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded border border-meow-border font-mono"
                />
              </div>
              <span className="text-[10px] text-meow-subtle mt-1 block">
                Storefront & Checkout redirects open chats with this exact number.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                Support Email Address *
              </label>
              <input
                type="email"
                required
                value={info.email}
                onChange={(e) => setInfo({ ...info, email: e.target.value })}
                placeholder="support@mymeow.in"
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                Operating Working Hours
              </label>
              <input
                type="text"
                value={info.hours}
                onChange={(e) => setInfo({ ...info, hours: e.target.value })}
                placeholder="Mon - Sat, 10:00 AM - 7:00 PM"
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-meow-dark block mb-1">
              Studio Postal Address *
            </label>
            <textarea
              rows={2}
              required
              value={info.address}
              onChange={(e) => setInfo({ ...info, address: e.target.value })}
              className="w-full text-xs p-3 rounded border border-meow-border"
            />
          </div>
        </div>

        {/* Social Media Channels */}
        <div className="border border-meow-border rounded-xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark pb-3 border-b border-meow-border flex items-center gap-2">
            <Share2 className="w-4 h-4 text-meow-dark" />
            <span>2. Official Brand Social Channels</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={social.instagram}
                onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
                placeholder="https://instagram.com/meowfootwear"
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={social.facebook}
                onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
                placeholder="https://facebook.com/meowfootwear"
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={social.youtube}
                onChange={(e) => setSocial({ ...social, youtube: e.target.value })}
                placeholder="https://youtube.com/@meowfootwear"
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-meow-dark block mb-1">
                Pinterest URL
              </label>
              <input
                type="url"
                value={social.pinterest}
                onChange={(e) => setSocial({ ...social, pinterest: e.target.value })}
                placeholder="https://pinterest.com/meowfootwear"
                className="w-full text-xs px-3.5 py-2.5 rounded border border-meow-border font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end p-4 border border-meow-border rounded-xl bg-white shadow-sm">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 bg-meow-dark text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-meow-dark/85 shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
