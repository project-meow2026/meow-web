import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptimeSeconds: number;
  checks: {
    supabase: {
      status: 'ok' | 'degraded' | 'error' | 'not_configured';
      latencyMs?: number;
      message?: string;
      tables?: {
        products?: number;
        categories?: number;
        siteSettings?: number;
        heroBanners?: number;
      };
    };
    cloudinary: {
      status: 'ok' | 'not_configured';
      cloudName: string;
      apiKeyConfigured: boolean;
    };
    diskStorage: {
      status: 'ok' | 'degraded';
      settingsFilesFound: string[];
    };
  };
}

const startTime = Date.now();

export async function GET() {
  const result: HealthCheckResult = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    checks: {
      supabase: { status: 'not_configured' },
      cloudinary: {
        status: 'not_configured',
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'k7t4skr1',
        apiKeyConfigured: Boolean(process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY),
      },
      diskStorage: { status: 'ok', settingsFilesFound: [] },
    },
  };

  // 1. Check Supabase
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const t0 = Date.now();
    try {
      const [prodRes, catRes, setRes, heroRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('site_settings').select('key', { count: 'exact', head: true }),
        supabase.from('hero_banners').select('id', { count: 'exact', head: true }),
      ]);

      const latencyMs = Date.now() - t0;
      const hasErrors = Boolean(prodRes.error || catRes.error || setRes.error || heroRes.error);

      result.checks.supabase = {
        status: hasErrors ? 'degraded' : 'ok',
        latencyMs,
        tables: {
          products: prodRes.count ?? undefined,
          categories: catRes.count ?? undefined,
          siteSettings: setRes.count ?? undefined,
          heroBanners: heroRes.count ?? undefined,
        },
        message: hasErrors ? 'Some tables had errors' : 'Connected and responding',
      };

      if (hasErrors) result.status = 'degraded';
    } catch (err: any) {
      result.checks.supabase = {
        status: 'error',
        latencyMs: Date.now() - t0,
        message: err.message || 'Supabase query failed',
      };
      result.status = 'degraded';
    }
  } else {
    result.checks.supabase = {
      status: 'not_configured',
      message: 'Supabase credentials missing on server',
    };
    result.status = 'degraded';
  }

  // 2. Check Cloudinary
  if (result.checks.cloudinary.cloudName) {
    result.checks.cloudinary.status = 'ok';
  }

  // 3. Check Disk Storage
  try {
    const settingsDir = path.join(process.cwd(), 'public', 'settings');
    const files = await fs.readdir(settingsDir);
    result.checks.diskStorage = {
      status: 'ok',
      settingsFilesFound: files.filter((f) => f.endsWith('.json')),
    };
  } catch (err) {
    result.checks.diskStorage = {
      status: 'degraded',
      settingsFilesFound: [],
    };
  }

  const statusCode = result.status === 'unhealthy' ? 503 : 200;
  return NextResponse.json(result, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
