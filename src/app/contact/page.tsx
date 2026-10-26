'use client';

import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Headphones,
  Zap,
  ShieldCheck,
  Heart,
  Instagram,
  Facebook,
  Youtube,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { dbService, INITIAL_CONTACT_INFO, INITIAL_SOCIAL_LINKS } from '@/lib/storage/db';
import { ContactInfoSetting, SocialLinksSetting } from '@/lib/supabase/types';

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfoSetting>(INITIAL_CONTACT_INFO);
  const [socialLinks, setSocialLinks] = useState<SocialLinksSetting>(INITIAL_SOCIAL_LINKS);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Order Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [info, social] = await Promise.all([
          dbService.getContactInfo(),
          dbService.getSocialLinks(),
        ]);
        setContactInfo(info);
        setSocialLinks(social);
      } catch (err) {
        console.error('Failed to load contact coordinates:', err);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccess(false);

    if (!fullName.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg('Please complete all fields before sending your message.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          subject,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      setSuccess(true);
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please reach us directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactCards = [
    {
      icon: Phone,
      title: 'Phone Number',
      value: contactInfo.phone,
      subtitle: contactInfo.hours,
      href: `tel:${contactInfo.phone.replace(/\D/g, '')}`,
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Concierge',
      value: contactInfo.whatsapp,
      subtitle: 'Instant support on WhatsApp',
      href: `https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}`,
    },
    {
      icon: Mail,
      title: 'Email Address',
      value: contactInfo.email,
      subtitle: 'We usually reply within 24 hours',
      href: `mailto:${contactInfo.email}`,
    },
    {
      icon: MapPin,
      title: 'Our Location',
      value: 'MEOW Footwear Studio',
      subtitle: 'Kochi, Kerala, India (Visit by appointment)',
      href: '#',
    },
  ];

  const bottomGuarantees = [
    { icon: Headphones, title: 'Customer Support', desc: "We're here to help anytime" },
    { icon: Zap, title: 'Fast Response', desc: 'Usually within 24 hours' },
    { icon: ShieldCheck, title: 'Genuine Assistance', desc: 'For sizing, care & returns' },
    { icon: Heart, title: 'A Better Experience', desc: 'Your comfort matters most' },
  ];

  return (
    <>
      <Header />

      <main className="bg-white min-h-screen pb-20">
        {/* Hero Banner matching Reference PDF page 7 */}
        <section className="relative bg-gradient-to-r from-[#F5F2EB] via-[#FAF9F6] to-[#ECE8E1] border-b border-meow-border overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,0,0,0.02),transparent_70%)] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-meow-terracotta font-sans font-semibold">
              GET IN TOUCH
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl font-medium text-meow-dark tracking-tight">
              WE&apos;RE HERE FOR YOU.
            </h1>
            <p className="text-xs sm:text-sm text-meow-dark/85 font-sans leading-relaxed">
              Have a question, need help with an order, or just want to know more about MEOW? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* Content Layout */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Contact Coordinates Cards */}
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-meow-dark pb-2 border-b border-meow-border">
                Contact Information
              </h2>
              <p className="text-xs text-meow-muted">
                Reach out to us anytime. Our concierge team will get back to you as soon as possible.
              </p>

              <div className="space-y-3 pt-2">
                {contactCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <a
                      key={card.title}
                      href={card.href}
                      target={card.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="block p-4 rounded-xl border border-meow-border bg-[#FAF9F6] hover:border-meow-dark transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-white border border-meow-border flex items-center justify-center text-meow-dark group-hover:bg-meow-dark group-hover:text-white transition-colors flex-shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-meow-subtle block">
                            {card.title}
                          </span>
                          <span className="text-xs font-semibold text-meow-dark block font-sans">
                            {card.value}
                          </span>
                          <span className="text-[11px] text-meow-muted block">
                            {card.subtitle}
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Social Channels Side Card matching PDF page 7 */}
              <div className="p-6 rounded-xl border border-meow-border bg-white space-y-4 pt-6">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-meow-dark">
                  LET&apos;S STAY CONNECTED
                </h3>
                <p className="text-xs text-meow-muted leading-relaxed">
                  Follow us for new arrivals, style inspirations, and exclusive updates.
                </p>
                <div className="flex items-center gap-3">
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-meow-border flex items-center justify-center text-meow-dark hover:bg-meow-dark hover:text-white transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {socialLinks.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-meow-border flex items-center justify-center text-meow-dark hover:bg-meow-dark hover:text-white transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {socialLinks.youtube && (
                    <a
                      href={socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-meow-border flex items-center justify-center text-meow-dark hover:bg-meow-dark hover:text-white transition-colors"
                      aria-label="YouTube"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Functional Send Us a Message Form */}
            <div className="lg:col-span-8 border border-meow-border rounded-xl p-6 sm:p-10 bg-white space-y-6">
              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-meow-dark">
                  Send Us a Message
                </h2>
                <p className="text-xs text-meow-muted mt-1">
                  Fill out the form below and we will get back to you promptly.
                </p>
              </div>

              {success && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg flex items-center gap-3 animate-fade-in-up">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>
                    Thank you! Your message has been received by our studio team. We will contact you shortly.
                  </span>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <div>
                    <label className="text-xs font-medium text-meow-dark block mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full text-xs px-3.5 py-3 rounded border border-meow-border bg-white focus:border-meow-dark outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-meow-dark block mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Mobile number for callback"
                      className="w-full text-xs px-3.5 py-3 rounded border border-meow-border bg-white focus:border-meow-dark outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-meow-dark block mb-1.5">
                      Subject *
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full text-xs px-3.5 py-3 rounded border border-meow-border bg-white focus:border-meow-dark outline-none transition-colors cursor-pointer"
                    >
                      <option value="Order Inquiry">Order Inquiry</option>
                      <option value="Size & Fit Assistance">Size & Fit Assistance</option>
                      <option value="Return or Exchange">Return or Exchange</option>
                      <option value="Bespoke / Bulk Request">Bespoke / Bulk Request</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-meow-dark block mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full text-xs p-3.5 rounded border border-meow-border bg-white focus:border-meow-dark outline-none transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3.5 bg-meow-dark text-white text-xs uppercase tracking-widest font-semibold hover:bg-meow-dark/85 shadow-md flex items-center gap-2 rounded transition-all disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Bottom 4 Guarantees matching PDF page 7 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 pt-12 border-t border-meow-border">
            {bottomGuarantees.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-4 rounded-xl border border-meow-border bg-[#FAF9F6] flex flex-col items-center text-center space-y-1.5"
                >
                  <Icon className="w-5 h-5 text-meow-dark" />
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-meow-dark">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-meow-muted">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
