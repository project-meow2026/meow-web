'use client';

import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      {/* Sidebar Navigation: Fixed on Desktop, Drawer on Mobile */}
      <AdminSidebar />

      {/* Main Content Area: Offset by 64 on Desktop to account for fixed sidebar */}
      <div className="lg:pl-64 min-w-0 transition-all">
        <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
