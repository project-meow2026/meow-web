'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, User } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description?: string;
  actionButton?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  description,
  actionButton,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-meow-border mb-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span className="text-[10px] uppercase tracking-widest font-semibold text-meow-subtle">
            AUTHENTICATED CMS CONSOLE
          </span>
        </div>
        <h1 className="font-editorial text-3xl font-medium text-meow-dark tracking-tight">
          {title}
        </h1>
        {description && <p className="text-xs text-meow-muted mt-1">{description}</p>}
      </div>

      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};
