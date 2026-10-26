import { NextRequest, NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'meow/hero/desktop';
    const isVideo = (formData.get('isVideo') as string) === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Cloudinary server credentials not configured' },
        { status: 500 }
      );
    }

    const timestamp = Math.round(Date.now() / 1000);
    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const crypto = await import('crypto');
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('api_key', apiKey);
    uploadFormData.append('timestamp', timestamp.toString());
    uploadFormData.append('signature', signature);
    uploadFormData.append('folder', folder);

    const resourceType = isVideo || file.type.startsWith('video/') ? 'video' : 'image';
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const res = await fetch(endpoint, {
      method: 'POST',
      body: uploadFormData,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Cloudinary server error:', data);
      return NextResponse.json(
        { error: data.error?.message || 'Failed to upload to Cloudinary' },
        { status: res.status }
      );
    }

    return NextResponse.json({
      url: data.secure_url,
      publicId: data.public_id,
      format: data.format,
      resourceType: data.resource_type,
      bytes: data.bytes,
    });
  } catch (error: any) {
    console.error('Error in /api/cloudinary/upload:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
