import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Cloudinary credentials missing in environment variables' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const folder = body.folder || 'meow/hero/desktop';
    const timestamp = Math.round(Date.now() / 1000);

    // Alphabetical parameter order required by Cloudinary: folder, then timestamp
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    return NextResponse.json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
    });
  } catch (err: any) {
    console.error('Error generating Cloudinary signature:', err);
    return NextResponse.json({ error: err.message || 'Signature generation failed' }, { status: 500 });
  }
}
