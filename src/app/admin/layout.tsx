'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import type { Session } from '@supabase/supabase-js';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setCheckingAuth(false);
      return;
    }

    // Check current active session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setCheckingAuth(false);
    });

    // Listen for auth state changes (login / logout / token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setCheckingAuth(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    if (!isSupabaseConfigured() || !supabase) {
      setErrorMessage('Supabase is not configured. Please check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message || 'Invalid login credentials.');
      } else if (data?.session) {
        setSession(data.session);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unable to sign in right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setPassword('');
  };

  // Loading state while verifying session
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-7 h-7 text-meow-dark animate-spin mb-3" />
        <p className="text-xs uppercase tracking-[0.2em] text-meow-muted">
          Verifying Admin Session...
        </p>
      </div>
    );
  }

  // Unauthenticated: Render Luxury Admin Login Form
  if (!session) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between p-4 sm:p-8">
        {/* Top Bar: Back to Storefront */}
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-meow-muted hover:text-meow-dark transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </Link>

          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-meow-subtle">
            <ShieldCheck className="w-3.5 h-3.5 text-meow-dark" />
            <span>Protected Portal</span>
          </div>
        </div>

        {/* Center Login Card */}
        <div className="w-full max-w-md mx-auto my-8">
          <div className="bg-white border border-meow-border rounded-2xl shadow-sm p-8 sm:p-10 space-y-7">
            {/* Brand Header */}
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <Image
                  src="/logo.png"
                  alt="MEOW"
                  width={130}
                  height={40}
                  className="h-8 w-auto object-contain"
                  priority
                />
              </div>
              <div className="space-y-1 pt-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-meow-subtle block">
                  STORE MANAGEMENT CMS
                </span>
                <h1 className="font-editorial text-2xl sm:text-3xl font-medium text-meow-dark tracking-tight">
                  Admin Sign In
                </h1>
                <p className="text-xs text-meow-muted">
                  Enter your Supabase administrator credentials to access the dashboard.
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-email"
                  className="text-xs font-medium text-meow-dark block uppercase tracking-wider"
                >
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-meow-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mymeow.in"
                    className="w-full text-xs pl-10 pr-4 py-3.5 rounded-lg border border-meow-border bg-white focus:border-meow-dark outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-password"
                  className="text-xs font-medium text-meow-dark block uppercase tracking-wider"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-meow-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-xs pl-10 pr-10 py-3.5 rounded-lg border border-meow-border bg-white focus:border-meow-dark outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-meow-subtle hover:text-meow-dark p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-meow-dark text-white text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-meow-dark/90 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Sign In to Admin Panel</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[11px] text-meow-subtle">
          © 2026 MEOW Footwear • Authorized Personnel Only
        </div>
      </div>
    );
  }

  // Authenticated: Render Admin Sidebar & Dashboard Content
  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      {/* Sidebar Navigation: Fixed on Desktop, Drawer on Mobile */}
      <AdminSidebar adminEmail={session.user?.email} onSignOut={handleSignOut} />

      {/* Main Content Area: Offset by 64 on Desktop to account for fixed sidebar */}
      <div className="lg:pl-64 min-w-0 transition-all">
        <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
