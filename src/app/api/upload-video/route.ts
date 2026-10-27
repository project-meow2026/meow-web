import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest) {
  return NextResponse.json({
    error: 'Direct server upload is deprecated. Upload directly to Cloudinary using uploadMediaToCloudinary.',
  }, { status: 400 });
}
